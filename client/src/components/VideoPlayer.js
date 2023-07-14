import { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ videoId }) => {
  // const[videoId, setVideoId] = useState(videoId);
  const fileName = videoId.replace(".", "_");
  const fileName2 = videoId.replace(".mp4", "");
  const fileName1 = fileName + "_master.m3u8";
  const [videoUrl, setVideoUrl] = useState(
    `${process.env.REACT_APP_SERVER_URL}/static/videos/hls/${fileName2}/${fileName1}`
  );
  const [videoData, setVideoData] = useState({});
  console.log(videoUrl);

  const player = useRef();

  const onChangeBitrate = (event) => {
    const internalPlayer = player.current?.getInternalPlayer("hls");
    if (internalPlayer) {
      // currentLevel expect to receive an index of the levels array
      internalPlayer.currentLevel = event.target.value;
    }
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/videos/${videoId}/data`
        );
        const data = await res.json();
        console.log("data", data);
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
        ref={player}
      />
      Quality:
      <select onChange={onChangeBitrate}>
        {player.current?.getInternalPlayer("hls")?.levels.map((level, id) => (
          <option key={id} value={id}>
            {level.bitrate}
          </option>
        ))}
      </select>
    </>
  );
};

export default VideoPlayer;
