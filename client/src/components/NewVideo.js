import { useState } from 'react'
import { useUser } from "../contexts/UserContext"


function NewVideo() {

    const[customMessage, setCustomMessage] = useState('');
    const { user } = useUser();
    const userId = user?.id;


  const handleSubmit = async (event) => {
    event.preventDefault();
    const file = event.target.elements[0];
    if(validateForm(file)) {
      uploadVideo(event.target);
    }
  };
  
  function validateForm(formData) {
    const uploadedFile = formData.files[0];
    // console.log("valForm",uploadedFile);
    if(!uploadedFile) {
      setCustomMessage( "Please select a video to upload");
      return false;
    }
    const fileLimit = 104857600;
    if(uploadedFile.size > fileLimit) {
      setCustomMessage("Maximum video size allowed: 100MB");
      return false;
    }
    return true;
  }
  
  async function uploadVideo(formData) {
    // document.getElementById("submit").disabled = true;
    setCustomMessage('uploading video..')
    // var formElement = document.getElementById("video-upload");
    try{
      var request = new XMLHttpRequest();
      request.open("POST", "http://localhost:4000/videos", true);
      request.onload = onComplete;
      request.upload.onprogress = fileUploadPercentage;
      // const data = new FormData(formElement);
      console.log(formData);
      const data = new FormData();
      data.append("userId", userId);
      data.append("user-file", formData.elements[0].files[0]);
      console.log('userId',userId);
      console.log('data',data);
      request.send(data);

    }
    catch(err) {
      console.log(err);
    }
  }
  
  function onComplete(event) {
    const response = JSON.parse(event.currentTarget.response);
    if(response.success) {
      setCustomMessage(`Video Uploaded successfully!!.`)
      // Please <a href=${response.link +}>click here</a> to view the video.`);
    } else {
      setCustomMessage( response.error);
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

  return (
    <>
      <form onSubmit={handleSubmit}>
        Select file to upload:
        <input type="file" accept ="video/mp4" name="user-file" />
        <input type="submit" />
      </form>
      {customMessage}
    </>
  );
}

export default NewVideo;
