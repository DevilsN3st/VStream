import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import axios from "axios";
import { useAsync } from "../hooks/useAsync";
import { getPosts } from "../services/posts";

// import { useAsyncFn } from "../hooks/useAsync"
// import { makeRequest } from "../services/makeRequest";

function NewVideo() {
  const [customMessage, setCustomMessage] = useState("");
  const { user } = useUser();
  // const [posts, setPosts] = useState([]);
  const userId = user?.id;
  const {
    loading,
    error,
    value: posts,
  } = useAsync(() => getPosts(userId), [userId]);
  const [postId, setPostId] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const file = event.target.elements[1];
    // console.log("files uploaded",event.target.elements[1]);
    if (validateForm(file)) {
      uploadVideo(event.target);
    }
  };

  function validateForm(formData) {
    const uploadedFile = formData.files[0];
    // console.log("valForm",uploadedFile);
    if (!uploadedFile) {
      setCustomMessage("Please select a video to upload");
      return false;
    }
    const fileLimit = 104857600;
    if (uploadedFile.size > fileLimit) {
      setCustomMessage("Maximum video size allowed: 100MB");
      return false;
    }
    return true;
  }

  async function uploadVideo(formData) {
    // document.getElementById("submit").disabled = true;
    setCustomMessage("uploading video..");
    // var formElement = document.getElementById("video-upload");
    try {
      var request = new XMLHttpRequest();
      request.open("POST", "http://localhost:4000/videos/videos", true);
      request.onload = onComplete;
      request.upload.onprogress = fileUploadPercentage;
      // const data = new FormData(formElement);
      console.log(formData);
      const data = new FormData();
      data.append("userId", userId);
      data.append("postId", postId);
      data.append("user-file", formData.elements[1].files[0]);
      console.log("userId", userId);
      console.log("data", data);
      request.send(data);
    } catch (err) {
      console.log(err);
    }
  }

  function onComplete(event) {
    const response = JSON.parse(event.currentTarget.response);
    if (response.success) {
      setCustomMessage(`Video Uploaded successfully!!.`);
      // Please <a href=${response.link +}>click here</a> to view the video.`);
    } else {
      setCustomMessage(response.error);
      // customMessage.style.color = 'red';
    }
    // document.getElementById("submit").disabled = false;
  }

  function fileUploadPercentage(e) {
    if (e.lengthComputable) {
      // var customMessage = document.getElementById('message');
      var percentage = (e.loaded / e.total) * 100;
      setCustomMessage(`Uploading Video: ' + ${percentage} + %`);
    }
  }

  if (loading) return <div> Loading </div>;
  if (error) return <h1 className="error-msg">{error}</h1>;

  // console.log("new video component", posts);

  return (
    <>
      <div className="container-sm mt-2 p-2">
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              <label htmlFor="title" className="form-label">
                Post
              </label>
            </span>
            <select
              className="form-select"
              id="title"
              aria-label="Default select example"
              onChange={(e) => setPostId(e.target.value)}
            >
              {posts.map((post) => (
                <option value={post.id} key={post.id}>
                  {post.title}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group mb-3">
            {/* <label className="input-group-text" for="inputGroupFile01"> Select file to upload:</label> */}
            <input
              type="file"
              accept="video/mp4"
              className="form-control"
              id="inputGroupFile01"
              name="user-file"
            />
          </div>
          <div className="input-group mb-3">
            <button type="submit" className="btn btn-primary">
              Add Video to the post
            </button>
          </div>
        </form>
        {customMessage}
      </div>
    </>
  );
}

export default NewVideo;
