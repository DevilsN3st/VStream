const express = require("express");
const prisma = require("../utils/prisma-instance");
const thumbsupply = require("thumbsupply");
const fs = require("fs");

const multer = require("multer");
const path = require("path");

const {commitToDb} = require("../services/commit-to-db");

const router = express.Router();

// endpoint to fetch all videos metadata

router.get("/videos", async function (req, res) {
  const videos = await prisma.video.findMany();
  res.json(videos);
});

router.get("/:id/caption", function (req, res) {
  res.sendFile("assets/captions/sample.vtt", { root: __dirname });
});

router.get("/:id/poster", function (req, res) {
  thumbsupply
    .generateThumbnail(`assets/${req.params.id}.mp4`)
    .then((thumb) => res.sendFile(thumb))
    .catch((err) => console.log(err));
});

// endpoint to fetch a single video's metadata
router.get("/:id/data", async function (req, res) {
  const videoData = await prisma.video.findUnique({
    where: { id: req.params.id },
  });
  // console.log(videoData);
  // const id = parseInt(req.params.id, 10);
  res.json(videoData);
});

router.get("/:id", async function (req, res) {
  const path = `assets/${req.params.id}`;
  const stat = fs.statSync(path);
  if (!stat) {
    path = `assets/${req.params.id}.mp4`;
  }
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    console.log("we have range", range);
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    console.log(parts);
    const chunksize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    console.log("no range", range);
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});

function fileFilter(req, file, callback) {
  var errorMessage = "";
  if (!file || file.mimetype !== "video/mp4") {
    errorMessage =
      'Wrong file type "' +
      file.originalname.split(".").pop() +
      '" found. Only mp4 video files are allowed!';
  }
  if (errorMessage) {
    return callback(
      { errorMessage: errorMessage, code: "LIMIT_FILE_TYPE" },
      false
    );
  }
  callback(null, true);
}

function destinationPath(req, file, callback) {
  var stat = null;
  try {
    stat = fs.statSync(process.env.FILE_UPLOAD_PATH);
  } catch (err) {
    fs.mkdirSync(process.env.FILE_UPLOAD_PATH);
  }
  callback(null, process.env.FILE_UPLOAD_PATH);
}

function fileNameConvention(req, file, callback) {
  callback(
    null,
    file.fieldname +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname)
  );
}

const limits = {
  fileSize: parseInt(process.env.FILE_SIZE) * 1024 * 1024, // 200MB
};

const storage = multer.diskStorage({
  destination: destinationPath,
  filename: fileNameConvention,
});

const fileUploadConfig = {
  fileFilter: fileFilter,
  storage: storage,
  limits: limits,
};

router.post(
  "/videos",
  multer(fileUploadConfig).single("user-file"),
  function (req, res, next) {
    console.log("req.body", req.body);
    console.log("req.file", req.file);
    console.log("req.files", req.files);

    const data = {
      title: req.file.originalname,
      description: req.file.originalname,
      userId: req.body.userId,
      fileName: req.file.filename,
      postId: "b4c55f46-047d-41ab-965a-16cf23c5410b",
      duration: "2 min",
      poster: "fsdafsd",
    };
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
  }
);

module.exports = router;
