import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Post } from "./components/Post";
import { PostList } from "./components/PostLists";
import { PostProvider } from "./contexts/PostContext";
import { UserProvider, useUser } from "./contexts/UserContext";
import NewPost from "./components/NewPost";
import NewVideo from "./components/NewVideo";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useUser as useUser1 } from "./hooks/useUser";

function App() {
  // const { user, error, loading } = useUser();
  // if (loading) {
  //   return <h1>Loading</h1>;
  // }
  // if (error === "404") {
  //   return (
  //     <>
  //       <Navbar />
  //       <h1>Server Unreachable</h1>
  //     </>
  //   );
  // }
  const {user, setUser, setLoading, setError} = useUser();
  const {user : user1} = useUser1();
  useEffect(() => {
    console.log(user1?.id);
    setUser(user1);
    setLoading(false);
    setError(false);
  }, [user1])

  console.log("user from app", user);
  console.log("userid from app", user?.id);
  return (
    <div>
      <Navbar />
      {/* <UserProvider> */}
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/create-post" element={!user ?  <Register /> : <NewPost />} />
        <Route
          path="/create-video"
          element={!user ? <Register /> : <NewVideo />}
        />
        <Route
          path="/posts/:id"
          element={
            <PostProvider>
              <Post />
            </PostProvider>
          }
        />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
      </Routes>
      {/* </UserProvider> */}
    </div>
  );
}

export default App;
