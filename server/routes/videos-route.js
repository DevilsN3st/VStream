const express = require("express");

const multer = require("multer");

const {
  getAllVideos,
  getVideoCaptions,
  getVideoThumbnail,
  getVideoMetaData,
} = require("../controllers/videos-fetch-controller");
const { streamVideo } = require("../controllers/video-stream-controller");
const { uploadVideo } = require("../controllers/video-upload-controller");
const { fileUploadConfig } = require("../config/multer-config");

const  redisClient  = require("../utils/redis-instance");

const router = express.Router();

// endpoint to fetch all videos metadata

router.get("/videos", getAllVideos);

router.get("/:id/caption", getVideoCaptions);

router.get("/:id/poster", getVideoThumbnail);

// endpoint to fetch a single video's metadata
router.get("/:id/data", getVideoMetaData );

router.get("/:id", streamVideo);

router.post(
  "/videos",
  multer(fileUploadConfig).single("user-file"),
  uploadVideo
);

module.exports = router;
