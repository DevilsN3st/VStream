
const prisma = require("../utils/prisma-instance");
const thumbsupply = require("thumbsupply");

// const  redisClient  = require("../utils/redis-instance");


const getAllVideos = async function (req, res) {
    const videos = await prisma.video.findMany();
    res.json(videos);
  }

const getVideoCaptions = function (req, res) {
    res.sendFile("assets/captions/sample.vtt", { root: __dirname });
  }

  const getVideoThumbnail = function (req, res) {
    thumbsupply
      .generateThumbnail(`assets/${req.params.id}.mp4`)
      .then((thumb) => res.sendFile(thumb))
      .catch((err) => console.log(err));
  }

// const getVideoMetaData = async function (req, res) {
    //   // if( redisClient.connected == false) console.log("redis not connected");
    //   try{
    
    //     await redisClient.get(`videoData:${req.params.id}-data`)
    //     .then(( videoData) =>{
    //       // console.log("here inside the redis");
    //       if(videoData != null) {
    //         console.log("videodata from redis");
    //         return res.json(JSON.parse(videoData));
    //       }
    //       else{
    //         (async() =>{
    //         const videoData = await prisma.video.findMany({
    //           where: { fileName: req.params.id },
    //         });
    //         console.log("videodata from db");
    //         // console.log(videoData);
    //         redisClient.set(`videoData:${req.params.id}-data`, JSON.stringify(videoData))
    //       })();
    //         res.json(videoData);
    //       }
    //     })
    //   }
    //   catch (error ) {
    //     console.log(error);
    //   }
    //   }


module.exports = { getAllVideos, getVideoCaptions, getVideoThumbnail };