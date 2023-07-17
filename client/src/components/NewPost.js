import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const navigate = useNavigate();

  const { user } = useUser();
  const userId = user;
  console.log("user at newPost",useUser().user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const post = { title, body, userId };
    console.log("post", post);

    await fetch("http://localhost:4000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
      credentials: "include",
    })
      .then((data) => {
        data.json().then((res) => {
          console.log(res);
        });
        navigate("/create-video");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="container-sm mt-2 p-2">
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              <label htmlFor="title" className="form-label">
                Title
              </label>
            </span>
            <input
              type="text"
              placeholder="Title"
              className="form-control"
              value={title}
              id = "title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="body" className="form-label">
              Write your Post
            </label>
            <input
              type="text"
              placeholder="Body"
              id = "body"
              className="form-control"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <button type="submit" className="btn btn-primary">Add Post</button>
        </div>
        </form>
      </div>
    </>
  );
};

export default NewPost;
