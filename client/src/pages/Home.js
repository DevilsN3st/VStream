import { PostList } from "../components/PostLists";
// import Navbar  from "../components/Navbar"
import NewPost from "../components/NewPost";

import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {/* <Navbar/> */}

      <button type="button" className="btn btn-success m-2 p-2">
        <Link className="nav-link" to="/create-post">
          Add Post
        </Link>
      </button>
      <PostList />
      {/* <NewPost/> */}
    </div>
  );
};

export default Home;
