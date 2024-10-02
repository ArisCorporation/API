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

ytdl.createAgent([
  {
    domain: '.youtube.com',
    expirationDate: 1761234033.09311,
    hostOnly: false,
    httpOnly: false,
    name: '__Secure-1PAPISID',
    path: '/',
    sameSite: 'unspecified',
    secure: true,
    session: false,
    storeId: '0',
    value: 'Bl7x24iPQmiL7p1-/AfNDlUuG1aqzUkBhH',
    id: 1,
  },
  {
    domain: '.youtube.com',
    expirationDate: 1761234033.093494,
    hostOnly: false,
    httpOnly: true,
    name: '__Secure-1PSID',
    path: '/',
    sameSite: 'unspecified',
    secure: true,
    session: false,
    storeId: '0',
    value:
      'g.a000oAhbP6YfGEx2DFcCMRTa2-8R1U1oCBCeQqUGqQMG4dMivZ6s7Ht6DC6DsArUClyQxwshegACgYKASYSARESFQHGX2Mixn3PZMkD9e-4ojT98a229RoVAUF8yKqn6gLG7KJkMPFHemr6qjw30076',
    id: 2,
  },
  {
    domain: '.youtube.com',
    expirationDate: 1759407465.471194,
    hostOnly: false,
    httpOnly: true,
    name: '__Secure-1PSIDCC',
    path: '/',
    sameSite: 'unspecified',
    secure: true,
    session: false,
    storeId: '0',
    value:
      'AKEyXzWtyUGVMSnJdCFBDYtKRNXiGDcE3rb3r70sPqsElYI4wAp9ebiRznARRTJqcaP-sKxFTho',
    id: 3,
  },
  {
    domain: '.youtube.com',
    expirationDate: 1759407452.320449,
    hostOnly: false,
    httpOnly: true,
    name: '__Secure-1PSIDTS',
    path: '/',
    sameSite: 'unspecified',
    secure: true,
    session: false,
    storeId: '0',
    value:
      'sidts-CjIBQlrA-HOmLLl_6OB6oTTkxSvHhg8xRr01HymGXYYMtaz-JzXB3RL5L_e4OyB73LIGzRAA',
    id: 4,
  },
  {
    domain: '.youtube.com',
    expirationDate: 1761234033.09316,
    hostOnly: false,
    httpOnly: false,
    name: '__Secure-3PAPISID',
    path: '/',
    sameSite: 'no_restriction',
    secure: true,
    session: false,
    storeId: '0',
    value: 'Bl7x24iPQmiL7p1-/AfNDlUuG1aqzUkBhH',
    id: 5,
  },
  {
    domain: '.youtube.com',
    expirationDate: 1761234033.09352,
    hostOnly: false,
    httpOnly: true,
    name: '__Secure-3PSID',
    path: '/',
    sameSite: 'no_restriction',
    secure: true,
    session: false,
    storeId: '0',
    value:
      'g.a000oAhbP6YfGEx2DFcCMRTa2-8R1U1oCBCeQqUGqQMG4dMivZ6sbcLrcNTqISfssGRPJx21YgACgYKAYMSARESFQHGX2MisBIquViPYrL0XiG4viu8iRoVAUF8yKoZewcTOzWSoSPgQm1TjhZ90076',
    id: 6,
  },
  {
    domain: '.youtube.com',
    expirationDate: 1759407465.471235,
    hostOnly: false,
    httpOnly: true,
    name: '__Secure-3PSIDCC',
    path: '/',
    sameSite: 'no_restriction',
    secure: true,
    session: false,
    storeId: '0',
    value:
      'AKEyXzXyI2jDLqOdc3LC2mn-KzbnBf-_P2rbYpcv1leF-ZyU77C60w5TNf3zEgLYqTDJ9mrqW-g',
    id: 7,
  },
  {
    domain: '.youtube.com',
    expirationDate: 1759407452.320526,
    hostOnly: false,
    httpOnly: true,
    name: '__Secure-3PSIDTS',
    path: '/',
    sameSite: 'no_restriction',
    secure: true,
    session: false,
    storeId: '0',
    value:
      'sidts-CjIBQlrA-HOmLLl_6OB6oTTkxSvHhg8xRr01HymGXYYMtaz-JzXB3RL5L_e4OyB73LIGzRAA',
    id: 8,
  },
  {
    domain: '.youtube.com',
    expirationDate: 1751065638.277914,
    hostOnly: false,
    httpOnly: true,
    name: '__Secure-YEC',
    path: '/',
    sameSite: 'lax',
    secure: true,
    session: false,
    storeId: '0',
    value: 'CgtGMm91ZlhfbVVMayjd8_S3BjIKCgJERRIEEgAgNw%3D%3D',
    id: 9,
  },
  {
    domain: '.youtube.com',
    expirationDate: 1748936415.561972,
    hostOnly: false,
    httpOnly: false,
    name: '_ga',
    path: '/',
    sameSite: 'unspecified',
    secure: false,
    session: false,
    storeId: '0',
    value: 'GA1.1.1049121894.1712084921',
    id: 10,
  },
  {
    domain: '.youtube.com',
    expirationDate: 1748941785.983984,
    hostOnly: false,
    httpOnly: false,
    name: '_ga_VCGEPY40VB',
    path: '/',
    sameSite: 'unspecified',
    secure: false,
    session: false,
    storeId: '0',
    value: 'GS1.1.1714381785.3.0.1714381785.60.0.0',
    id: 11,
  },
  {
    domain: '.youtube.com',
    expirationDate: 1761234033.093062,
    hostOnly: false,
    httpOnly: false,
    name: 'APISID',
    path: '/',
    sameSite: 'unspecified',
    secure: false,
    session: false,
    storeId: '0',
    value: '3v5V00_dKrDh_Df8/A9BXf3Udp_If_yw4N',
    id: 12,
  },
  {
    domain: '.youtube.com',
    expirationDate: 1761234033.092965,
    hostOnly: false,
    httpOnly: true,
    name: 'HSID',
    path: '/',
    sameSite: 'unspecified',
    secure: false,
    session: false,
    storeId: '0',
    value: 'ATVZqgq0naAFhQauq',
    id: 13,
  },
  {
    domain: '.youtube.com',
    expirationDate: 1746400812.630918,
    hostOnly: false,
    httpOnly: true,
    name: 'LOGIN_INFO',
    path: '/',
    sameSite: 'no_restriction',
    secure: true,
    session: false,
    storeId: '0',
    value:
      'AFmmF2swRQIgKsFU8HPM49K8CT9LzFV5i8H2_t8oZ_hf58iiMrl7_KkCIQDo7ogbWmxv3kYwDlACg03DxsnXx3J52RPS-FVxP3s3mQ:QUQ3MjNmeXV5Yi1vNmROMV9zM3pMVDVpOWpHT1RPZU5vNEhxQ3dGeDBkLVN1S3FwWF9GS09wM3VZSkp4YXNFOHplSUJMdExPeC12UjRlWVZDN1hFUnFhSi1rNGxkVXRMTTVFMjFyMFZzR1JmRmFPNjlZYUNaN2pkclN4d0luX2dyQS1UM0tCS05pTGtxYUhud2E5OUJ3Q3hxRHpCdlp3dkl3',
    id: 14,
  },
  {
    domain: '.youtube.com',
    expirationDate: 1727896147.59143,
    hostOnly: false,
    httpOnly: true,
    name: 'NID',
    path: '/',
    sameSite: 'unspecified',
    secure: true,
    session: false,
    storeId: '0',
    value:
      '512=VTo5UCRRxT8rwSzrN2sucYRmYg4c5ZnDQ6t877P6M7-p-JCLUPT5SIf6OQteAhlcjkIHvL9_vazWKdghM4IsiW2MbWyrWF6YyW_stErfdl6KRjTpgcPogwGEJIGG9ykBGcrZ7QF5Of5hRbUovvtAcocQ5nW2SsSJiuWFUi-i5876dqPD1i73aXSRKd8jW5dpw0o',
    id: 15,
  },
  {
    domain: '.youtube.com',
    expirationDate: 1762431457.228099,
    hostOnly: false,
    httpOnly: false,
    name: 'PREF',
    path: '/',
    sameSite: 'unspecified',
    secure: true,
    session: false,
    storeId: '0',
    value: 'f6=40000000&f7=4100&tz=Europe.Berlin&f5=30000&f4=4000000',
    id: 16,
  },
  {
    domain: '.youtube.com',
    expirationDate: 1761234033.093088,
    hostOnly: false,
    httpOnly: false,
    name: 'SAPISID',
    path: '/',
    sameSite: 'unspecified',
    secure: true,
    session: false,
    storeId: '0',
    value: 'Bl7x24iPQmiL7p1-/AfNDlUuG1aqzUkBhH',
    id: 17,
  },
  {
    domain: '.youtube.com',
    expirationDate: 1761234033.093467,
    hostOnly: false,
    httpOnly: false,
    name: 'SID',
    path: '/',
    sameSite: 'unspecified',
    secure: false,
    session: false,
    storeId: '0',
    value:
      'g.a000oAhbP6YfGEx2DFcCMRTa2-8R1U1oCBCeQqUGqQMG4dMivZ6skYC4Dvh1BpZNyBmQHsNUbwACgYKARASARESFQHGX2MiJvNKzw9uNrBtZlRLnJ2odxoVAUF8yKo1nor86kIc5faNeIpD5SGG0076',
    id: 18,
  },
  {
    domain: '.youtube.com',
    expirationDate: 1759407465.471064,
    hostOnly: false,
    httpOnly: false,
    name: 'SIDCC',
    path: '/',
    sameSite: 'unspecified',
    secure: false,
    session: false,
    storeId: '0',
    value:
      'AKEyXzVzZH3RLwA1e_GtCI1vehgwbqtpmB-q0kJaB2XzXpK5n-J4EkadT_ex5WeEM606_5tAvmJl',
    id: 19,
  },
  {
    domain: '.youtube.com',
    expirationDate: 1761234033.093037,
    hostOnly: false,
    httpOnly: true,
    name: 'SSID',
    path: '/',
    sameSite: 'unspecified',
    secure: true,
    session: false,
    storeId: '0',
    value: 'AVTRGyrZBrHJ4R5zu',
    id: 20,
  },
  {
    domain: '.youtube.com',
    hostOnly: false,
    httpOnly: false,
    name: 'wide',
    path: '/',
    sameSite: 'unspecified',
    secure: false,
    session: true,
    storeId: '0',
    value: '1',
    id: 21,
  },
  {
    domain: '.youtube.com',
    hostOnly: false,
    httpOnly: true,
    name: 'YSC',
    path: '/',
    sameSite: 'no_restriction',
    secure: true,
    session: true,
    storeId: '0',
    value: 'pVvUWWlfoOo',
    id: 22,
  },
]);

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
