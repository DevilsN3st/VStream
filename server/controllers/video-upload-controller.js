const prisma = require("../utils/prisma-instance");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const fs = require("fs");
// const { Transcoder } = require("simple-hls");

const convertToHLS = async (req, res, next) => {
  const mp4FileName = req.file.filename;
  // const mp4Folder = 'assets';
  const hlsFolder = "assets/hls";

  console.log("Starting script");
  const newName = mp4FileName.replace(".mp4", "");

  try {
    let dir = `./assets/hls/${newName}`;
    // check if directory already exists
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
        console.log("Directory is created.");
    } else {
        console.log("Directory already exists.");
    }
  } catch (err) {
      console.log(err);
  }

  try {
      console.log('Downloading s3 mp4 file locally');

      const resolutions = [
          {
              resolution: '320x180',
              videoBitrate: '500k',
              audioBitrate: '64k'
          },
          {
              resolution: '854x480',
              videoBitrate: '1000k',
              audioBitrate: '128k'
          },
          {
              resolution: '1280x720',
              videoBitrate: '2500k',
              audioBitrate: '192k'
          }
      ];

      const variantPlaylists = [];
      for (const { resolution, videoBitrate, audioBitrate } of resolutions) {
          console.log(`HLS conversion starting for ${resolution}`);
          const outputFileName = `${mp4FileName.replace(
              '.',
              '_'
          )}_${resolution}.m3u8`;
          const segmentFileName = `${mp4FileName.replace(
              '.',
              '_'
          )}_${resolution}_%03d.ts`;
          await new Promise((resolve, reject) => {
              ffmpeg(`./assets/${mp4FileName}`)
                  .outputOptions([
                      `-c:v h264`,
                      `-b:v ${videoBitrate}`,
                      `-c:a aac`,
                      `-b:a ${audioBitrate}`,
                      `-vf scale=${resolution}`,
                      `-f hls`,
                      `-hls_time 10`,
                      `-hls_list_size 0`,
                      `-hls_segment_filename ./assets/hls/${newName}/${segmentFileName}`
                  ])
                  .output(`./assets/hls/${newName}/${outputFileName}`)
                  .on('end', () => resolve())
                  .on('error', (err) => {
                    console.log(err);
                    reject(err)
                  })
                  .run();
          });
          const variantPlaylist = {
              resolution,
              outputFileName
          };
          variantPlaylists.push(variantPlaylist);
          console.log(`HLS conversion done for ${resolution}`);
      }
      console.log(`HLS master m3u8 playlist generating`);
      let masterPlaylist = variantPlaylists
          .map((variantPlaylist) => {
              const { resolution, outputFileName } = variantPlaylist;
              const bandwidth =
                  resolution === '320x180'
                      ? 676800
                      : resolution === '854x480'
                      ? 1353600
                      : 3230400;
              return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n${outputFileName}`;
          })
          .join('\n');
      masterPlaylist = `#EXTM3U\n` + masterPlaylist;

      const masterPlaylistFileName = `${mp4FileName.replace(
          '.',
          '_'
      )}_master.m3u8`;
      const masterPlaylistPath = `./assets/hls/${newName}/${masterPlaylistFileName}`;
      fs.writeFileSync(masterPlaylistPath, masterPlaylist);
      console.log(`HLS master m3u8 playlist generated`);

  console.log(`Deleting locally downloaded s3 mp4 file`);

  saveToDB(req, res, next);

  } catch (error) {
      console.error('Error:', error);
  }
};

const saveToDB = (req, res, next) => {
  const data = {
    title: req.file.originalname,
    description: req.file.originalname,
    userId: req.body.userId,
    fileName: req.file.filename,
    postId: req.body.postId,
    duration: "2 min",
    poster: "fsdafsd",
  };
  console.log("data from video uploader", data);  
  if (req.file) {
    prisma.video
      .create({
        data,
      })
      .then((data) => {
        return res.json({ success: true });
      })
      .catch((err) => {
        console.log(err);
        return res.json({ success: false, error: err });
      });
  }
};

const uploadVideo = function (req, res, next) {
  // console.log("req.body", req.body);
  // console.log("req.file", req.file);
  // console.log("req.files", req.files);
  convertToHLS(req, res, next);
};

module.exports = { uploadVideo };
