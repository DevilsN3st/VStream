import { useState, useEffect } from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ videoId }) => {
  // const[videoId, setVideoId] = useState(videoId);
  const [videoUrl, setVideoUrl] = useState(
    `http://localhost:4000/videos/${videoId}`
  );
  const [videoData, setVideoData] = useState({});

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`http://localhost:4000/videos/${videoId}/data`);
        const data = await res.json();
        // console.log("data",data);
        setVideoData(data);
        // setVideoUrl(data.id);
      } catch (error) {
        console.log(error);
      }
    };
    fetchVideo();
  }, []);

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
