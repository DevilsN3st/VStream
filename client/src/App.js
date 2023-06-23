import { Routes, Route } from "react-router-dom";
import { Post } from "./components/Post";
import { PostList } from "./components/PostLists";
import { PostProvider } from "./contexts/PostContext";
import { UserProvider } from "./contexts/UserContext";
import NewPost from "./components/NewPost";
import NewVideo from "./components/NewVideo";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div >
      <Navbar/>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-post" element={<NewPost />} />
          <Route path="/create-video" element={<NewVideo />} />
          <Route
            path="/posts/:id"
            element={
              <PostProvider>
                <Post />
              </PostProvider>
            }
          />
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;
