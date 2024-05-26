'use strict'

// Importing necessary modules
const express = require('express'),
  router = express.Router(),
  ytdl = require('ytdl-core'),
  ffmpeg = require('fluent-ffmpeg'),
  fs = require('fs'),
  path = require('path'),
  { v4: uuidv4 } = require('uuid'),
  { createDirectus, staticToken, uploadFiles, rest } = require('@directus/sdk')

// Route handler for GET requests
router.get('/', async (req, res) => {
  // Set a 60 minutes timeout for the request
  req.setTimeout(3600000, () => {
    console.log('Request timed out')
    res.status(408).send('Request timed out')
  })

  // Log that a request was received
  console.log('Received request to convert video')
  // Log the client's IP address
  console.log('Client IP: ', req.ip || req.headers['x-forwarded-for'])
  // Get the YouTube video URL from the request
  const videoUrl = req.query.url

  // Validate the YouTube video URL or ID
  if (!ytdl.validateID(videoUrl) && !ytdl.validateURL(videoUrl)) {
    // If the URL is invalid, send a 400 status code and an error message
    return res.status(400).send('Invalid YouTube URL or ID')
  }

  // Log the YouTube video URL or ID
  console.log(ytdl.validateURL(videoUrl) ? 'URL: ' : 'ID: ', videoUrl)

  // Generate a unique ID for the request
  const id = uuidv4()
  // Get the video info from the YouTube video URL
  const info = await ytdl.getInfo(videoUrl)
  // Get the video title and sanitize it
  const title = info.videoDetails.title
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase()

  // Log the video title
  console.log(`Video title for ${id}: ${title}`)

  // Define the path for the video, audio and output files
  const videoPath = path.join(__dirname, `../tmp/${id}_video.mp4`)
  const audioPath = path.join(__dirname, `../tmp/${id}_audio.mp3`)
  const outputPath = path.join(__dirname, `../tmp/${id}.webm`)

  // Create a stream for the video and audio data
  const videoStream = ytdl(videoUrl, { quality: 'highestvideo' })
  const audioStream = ytdl(videoUrl, { quality: 'highestaudio' })

  // Pipe the video data to a file
  videoStream
    .pipe(fs.createWriteStream(videoPath))
    .on('finish', () => {
      // Once the video data is written, pipe the audio data to a file
      audioStream.pipe(fs.createWriteStream(audioPath)).on('finish', () => {
        // Once the audio data is written, start the ffmpeg process
        ffmpeg()
          .input(videoPath) // Input the video file
          .input(audioPath) // Input the audio file
          .format('webm') // Set the output format to webm
          .on('progress', function (progress) {
            // Log the progress of the ffmpeg process
            console.log(
              `FFMPEG Processing for ${id}: ${progress.percent}% done`
            )
          })
          .on('error', (error) => {
            // Log any errors that occur during the ffmpeg process
            console.error(`Error processing for ${id}: `, error)
          })
          .on('end', async () => {
            // Log when the ffmpeg process is finished
            console.log(`FFMPEG processing finished for ${id}`)
            // If the 'dl' query parameter is not set to 'false', download the output file
            if (req.query.dl !== 'false') {
              // Use the 'download' method of the response object to start a file download
              res.download(outputPath, `${title}.webm`, (err) => {
                // If an error occurs during the download, log the error and send a 500 status code
                if (err) {
                  console.error(`Error downloading file for ${id}: `, err)
                  res.status(500).send('Error downloading file')
                } else {
                  // If the download is successful, log a success message
                  console.log(`File downloaded successfully for ${id}`)
                  // Delete the video, audio, and output files
                  fs.unlinkSync(videoPath)
                  fs.unlinkSync(audioPath)
                  fs.unlinkSync(outputPath)
                  // Log a message indicating that the files were deleted successfully
                  console.log(`Files deleted successfully for ${id}`)
                }
              })
            }
            // If the 'uploadcms' query parameter is set to 'true', upload the output file to the CMS
            if (req.query.uploadcms === 'true') {
              // Get the Directus token from the request headers
              const directusToken = req.headers['cms-token']
              // If the Directus token is not provided, log an error and send a 400 status code
              if (!directusToken) {
                console.error(`Directus token not provided for ${id}`)
                res.status(400).send('Directus token not provided')
                return
              }

              // Create a Directus client with the provided URL and token
              const client = createDirectus('https://cms.ariscorp.de')
                .with(rest())
                .with(staticToken(directusToken))

              // Try to read the output file and upload it to Directus
              try {
                // Get the output file
                // const fileData = await fs.promises.readFile(outputPath)
                const fileObject = new Blob([fs.readFileSync(outputPath)], {
                  type: 'video/webm',
                })
                // Define the file name
                const fileName = `${title}.webm`
                // Get the folder ID from the request
                const folderId = req.query.folder

                // Create a new FormData object
                const formData = new FormData()
                // Append the title, folder ID, and file data to the FormData object
                formData.append('title', title)
                formData.append('folder', folderId)
                formData.append('file', fileObject, fileName)

                // Make a request to upload the files to Directus
                await client.request(uploadFiles(formData))

                // Log a success message
                console.log(`File uploaded successfully to Directus for ${id}`)

                // Delete the video, audio, and output files
                fs.unlinkSync(videoPath)
                fs.unlinkSync(audioPath)
                fs.unlinkSync(outputPath)

                res.status(200).send('File uploaded successfully to CMS')
              } catch (error) {
                // If an error occurs, log the error and send a 500 status code
                console.error(
                  `Error uploading file to Directus for ${id}: `,
                  error
                )
                res.status(500).send('Error uploading file to Directus')
              }
            }
          })
          .save(outputPath)
      })
    })
    // If an error occurs while downloading the video, log the error
    .on('error', (error) => {
      console.error(`Error downloading video for ${id}: `, error)
    })

  // If an error occurs while downloading the audio, log the error and retry if possible
  audioStream.on('error', (error) => {
    console.error(`Error downloading audio for ${id}: `, error)
    let retries = 3
    if (retries > 0) {
      // If there are retries left, decrement the retry count and retry the download
      retries--
      console.log(`Retrying download. Remaining attempts: ${retries}`)
      downloadAudio()
    } else {
      // If there are no retries left, log an error message
      console.error('Failed to download audio after 3 attempts')
    }
  })
})

module.exports = router
