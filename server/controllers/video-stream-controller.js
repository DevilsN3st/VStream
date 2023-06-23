


const fs = require("fs");


// const  redisClient  = require("../utils/redis-instance");


const streamVideo = async function (req, res) {
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
      // try{
      //   await redisClient.get(`video:${req.params.id}-${start}-${end}`)
      //   .then(( video ) =>{
          let file;
          // if( video != null){
          //   console.log("video served from redis");
          //   // file = JSON.parse(video);
          //   file = video;
          // // let buff = new Buffer(data, 'base64');
          // // let text = buff.toString('ascii');
          // }
          // else{
            file = fs.createReadStream(path, { start, end });
            console.log("video served from server");
            // redisClient.set(`video:${req.params.id}-${start}-${end}`, JSON.stringify(file))
          // }
          const head = {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4",
          };
          res.writeHead(206, head);
          file.pipe(res);
        // })
  
      // }
      // catch(error){
      //   console.log("video Streaming From Redis", error);
      // }
      // const file = fs.createReadStream(path, { start, end });
      // const head = {
      //   "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      //   "Accept-Ranges": "bytes",
      //   "Content-Length": chunksize,
      //   "Content-Type": "video/mp4",
      // };
      // res.writeHead(206, head);
      // file.pipe(res);
    } else {
      console.log("no range", range);
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(path).pipe(res);
    }
  }

  module.exports = { streamVideo };