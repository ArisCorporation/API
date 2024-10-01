import {
  Headers,
  Controller,
  UseInterceptors,
  Post,
  Body,
  HttpException,
  Query,
  Res,
} from '@nestjs/common';
import { TimeoutInterceptor } from 'src/timeout.service';
import * as ytdl from '@distube/ytdl-core';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createDirectus, staticToken, uploadFiles, rest } from '@directus/sdk';

@Controller('video')
@UseInterceptors(TimeoutInterceptor) // 👈 Apply the TimeoutInterceptor to set a 150 minutes timeout.
export class VideoController {
  @Post()
  async getVideo(@Headers() headers, @Body() body, @Query() query, @Res() res) {
    if (!body.video) {
      // If the video URL is not provided, send a 400 status code and an error message
      // return body;
      throw new HttpException('No video URL or ID provided!', 400);
    }
    if (query.dl === false && query.uploadcms === false) {
      // If the 'dl' and 'uploadcms' query parameters are not set, send a 400 status code and an error message
      throw new HttpException('No action provided!', 400);
    }
    if (query.uploadcms === true && !body.folder) {
      // If the 'uploadcms' query parameter is set to 'true' but no folder ID is provided, send a 400 status code and an error message
      throw new HttpException('No folder provided!', 400);
    }
    if (query.uploadcms && !headers['cms-token']) {
      // If the 'uploadcms' query parameter is set to 'true' but no CMS token is provided, send a 400 status code and an error message
      throw new HttpException('No CMS token provided!', 400);
    }
    if (query.format && !['webm', 'mp4'].includes(query.format)) {
      // If the 'format' query parameter is provided but is not 'webm' or 'mp4', send a 400 status code and an error message
      throw new HttpException('Invalid format provided!', 400);
    }

    // Log that a request was received
    console.log('Received request to convert video');
    // Get the YouTube video URL from the request
    const videoUrl = body.video;

    // Validate the YouTube video URL or ID
    if (!ytdl.validateID(videoUrl) && !ytdl.validateURL(videoUrl)) {
      // If the URL is invalid, send a 400 status code and an error message
      throw new HttpException('Invalid YouTube URL or ID!', 400);
    }

    // Log the YouTube video URL or ID
    console.log(ytdl.validateURL(videoUrl) ? 'URL: ' : 'ID: ', videoUrl);

    // Generate a unique ID for the request
    const id = uuidv4();
    // Get the video info from the YouTube video URL
    const info = await ytdl.getInfo(videoUrl);
    // Get the video title and sanitize it
    const title = info.videoDetails.title;

    // Log the video title
    console.log(`Video title for ${id}: ${title}`);

    // Set the file type to the query parameter or default to 'webm'
    const fileFormat = query.format || 'webm';

    // Define the path for the video, audio and output files
    const videoPath = path.join(__dirname, `./tmp_${id}_video.mp4`);
    const audioPath = path.join(__dirname, `./tmp_${id}_audio.mp3`);
    const outputPath = path.join(__dirname, `./tmp_${id}.${fileFormat}`);

    // Create a stream for the video and audio data
    const videoStream = ytdl(videoUrl, { quality: 'highestvideo' });
    const audioStream = ytdl(videoUrl, { quality: 'highestaudio' });

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
            .format(fileFormat) // Set the output format to webm
            .on('progress', function (progress) {
              // Log the progress of the ffmpeg process
              console.log(
                `FFMPEG Processing for ${id}: ${progress.percent}% done`,
              );
            })
            .on('error', (error) => {
              // Log any errors that occur during the ffmpeg process
              console.error(`Error processing for ${id}: `, error);
            })
            .on('end', async () => {
              // Log when the ffmpeg process is finished
              console.log(`FFMPEG processing finished for ${id}`);
              // If the 'dl' query parameter is not set to 'false', download the output file
              if (query.dl !== 'false') {
                // Use the 'download' method of the response object to start a file download
                return res.download(
                  outputPath,
                  `${title}.${fileFormat}`,
                  (err) => {
                    // If an error occurs during the download, log the error and send a 500 status code
                    if (err) {
                      console.error(`Error downloading file for ${id}: `, err);
                      throw new HttpException('Error downloading file', 400);
                    } else {
                      // If the download is successful, log a success message
                      console.log(`File downloaded successfully for ${id}`);
                      // Delete the video, audio, and output files
                      fs.unlinkSync(videoPath);
                      fs.unlinkSync(audioPath);
                      fs.unlinkSync(outputPath);
                      // Log a message indicating that the files were deleted successfully
                      console.log(`Files deleted successfully for ${id}`);
                    }
                  },
                );
              }
              // If the 'uploadcms' query parameter is set to 'true', upload the output file to the CMS
              if (query.uploadcms === 'true') {
                // Get the Directus token from the request headers
                const directusToken = headers['cms-token'];
                // If the Directus token is not provided, log an error and send a 400 status code
                if (!directusToken) {
                  console.error(`Directus token not provided for ${id}`);
                  throw new HttpException('Directus token not provided', 400);
                }

                // Create a Directus client with the provided URL and token
                const client = createDirectus('https://cms.ariscorp.de')
                  .with(rest())
                  .with(staticToken(directusToken));

                // Try to read the output file and upload it to Directus
                try {
                  // Get the output file
                  // const fileData = await fs.promises.readFile(outputPath)
                  const fileObject = new Blob([fs.readFileSync(outputPath)], {
                    type: 'video/' + fileFormat,
                  });
                  // Define the file name
                  const fileName = `${title}.${fileFormat}`
                    .replace(/[^a-z0-9]/gi, '_')
                    .toLowerCase();

                  // Get the folder ID from the request
                  const folderId = body.folder;

                  // Create a new FormData object
                  const formData = new FormData();
                  // Append the title, folder ID, and file data to the FormData object
                  formData.append('title', title);
                  formData.append('folder', folderId);
                  formData.append('file', fileObject, fileName);

                  // Make a request to upload the files to Directus
                  const directus_res = await client.request(
                    uploadFiles(formData),
                  );

                  // Log a success message
                  console.log(
                    `File uploaded successfully to Directus for ${id}`,
                  );

                  // Delete the video, audio, and output files
                  fs.unlinkSync(videoPath);
                  fs.unlinkSync(audioPath);
                  fs.unlinkSync(outputPath);

                  return res.send(directus_res);
                } catch (error) {
                  // If an error occurs, log the error and send a 500 status code
                  console.error(
                    `Error uploading file to Directus for ${id}: `,
                    error,
                  );
                  throw new HttpException(
                    'Error uploading file to Directus',
                    500,
                  );
                }
              }
            })
            .save(outputPath);
        });
      })
      // If an error occurs while downloading the video, log the error
      .on('error', (error) => {
        console.error(`Error downloading video for ${id}: `, error);
      });

    // If an error occurs while downloading the audio, log the error and retry if possible
    audioStream.on('error', (error) => {
      console.error(`Error downloading audio for ${id}: `, error);
      let retries = 3;
      if (retries > 0) {
        // If there are retries left, decrement the retry count and retry the download
        retries--;
        console.log(`Retrying download. Remaining attempts: ${retries}`);
        // downloadAudio();
      } else {
        // If there are no retries left, log an error message
        console.error('Failed to download audio after 3 attempts');
      }
    });
  }
}
