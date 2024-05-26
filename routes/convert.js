'use strict'

const express = require('express'),
  router = express.Router(),
  ytdl = require('ytdl-core'),
  ffmpeg = require('fluent-ffmpeg'),
  fs = require('fs'),
  path = require('path'),
  { v4: uuidv4 } = require('uuid')

router.get('/', async (req, res) => {
  req.setTimeout(12000000, () => {
    console.log('Request timed out')
    res.status(408).send('Request timed out')
  })

  console.log('Received request to convert video')
  console.log('Client IP: ', req.ip || req.headers['x-forwarded-for'])
  const videoUrl = req.query.url
  console.log('URL: ', videoUrl)

  if (!ytdl.validateURL(videoUrl)) {
    return res.status(400).send('Invalid YouTube URL')
  }

  const id = uuidv4()
  const info = await ytdl.getInfo(videoUrl)
  const title = info.videoDetails.title
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase()

  console.log(`Video title for ${id}: ${title}`)

  const videoPath = path.join(__dirname, `../tmp/${id}_video.mp4`)
  const audioPath = path.join(__dirname, `../tmp/${id}_audio.mp3`)
  const outputPath = path.join(__dirname, `../tmp/${id}.mp4`)

  const videoStream = ytdl(videoUrl, { quality: 'highestvideo' })
  const audioStream = ytdl(videoUrl, { quality: 'highestaudio' })

  videoStream
    .pipe(fs.createWriteStream(videoPath))
    .on('finish', () => {
      audioStream.pipe(fs.createWriteStream(audioPath)).on('finish', () => {
        ffmpeg()
          .input(videoPath)
          .input(audioPath)
          .format('webm')
          .on('progress', function (progress) {
            console.log(
              `FFMPEG Processing for ${id}: ${progress.percent}% done`
            )
          })
          .on('error', (error) => {
            console.error(`Error processing for ${id}: `, error)
          })
          .on('end', () => {
            console.log(`FFMPEG processing finished for ${id}`)
            res.download(outputPath, `${title}.webm`, (err) => {
              if (err) {
                console.error(`Error downloading file for ${id}: `, err)
                res.status(500).send('Error downloading file')
              } else {
                console.log(`File downloaded successfully for ${id}`)
                fs.unlinkSync(videoPath)
                fs.unlinkSync(audioPath)
                fs.unlinkSync(outputPath)
                console.log(`Files deleted successfully for ${id}`)
              }
            })
          })
          .save(outputPath)
      })
    })
    .on('error', (error) => {
      console.error(`Error downloading video for ${id}: `, error)
    })

  audioStream.on('error', (error) => {
    console.error(`Error downloading audio for ${id}: `, error)
    if (retries > 0) {
      retries--
      console.log(`Retrying download. Remaining attempts: ${retries}`)
      downloadAudio()
    } else {
      console.error('Failed to download audio after 3 attempts')
    }
  })
})

module.exports = router
