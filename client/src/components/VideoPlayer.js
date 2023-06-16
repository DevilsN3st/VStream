import { useState, useEffect } from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ videoId }) => {
  // const[videoId, setVideoId] = useState(videoId);
  const [videoUrl, setVideoUrl] = useState(
    `${process.env.REACT_APP_SERVER_URL}/videos/${videoId}`
  );
  const [videoData, setVideoData] = useState({});
  // console.log(videoId);

  // useEffect(() => {
  //   const fetchVideo = async () => {
  //     try {
  //       const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/videos/${videoId}/data`);
  //       const data = await res.json();
  //       console.log("data",data);
  //       setVideoData(data);
  //       // setVideoUrl(data.id);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchVideo();
  // }, []);

  return (
    <>
      <ReactPlayer
        url={videoUrl}
        controls
        playing
        width="100%"
        height="100%"
        config={{
          file: { attributes: { controlsList: "nodownload" } },
        }}
      />
    </>
  );
};

export default VideoPlayer;
