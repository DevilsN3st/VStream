import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const NewPost = () => {

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const navigate = useNavigate()

    const {user} = useUser();
    const userId = user?.id;
    // console.log(useUser());

    const handleSubmit = async (e) => {
        e.preventDefault();
        const post = {title, body, userId};

        await fetch('http://localhost:4000/posts', {

            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(post)
        }).then((data) => {
            data.json().then((res) => {
                console.log(res);
            })
            navigate('/create-video');        
        }).catch((err) => { 
            console.log(err);
        })


    }



  return (
  <>
  
    <form onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
        <input
            type="text"
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
        />
        <button type="submit">Add Post</button>
    </form>
  
  
  
  </>
    )
}

export default NewPost