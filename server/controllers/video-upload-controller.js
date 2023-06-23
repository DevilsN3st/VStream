const prisma = require("../utils/prisma-instance");



const uploadVideo = function (req, res, next) {
    // console.log("req.body", req.body);
    // console.log("req.file", req.file);
    // console.log("req.files", req.files);

    const data = {
      title: req.file.originalname,
      description: req.file.originalname,
      userId: req.body.userId,
      fileName: req.file.filename,
      postId: req.body.postId,
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


  module.exports = { uploadVideo };