import { PostList } from "../components/PostLists";
// import Navbar  from "../components/Navbar"
import NewPost from "../components/NewPost";
import {useUser} from '../contexts/UserContext'
import { Link } from "react-router-dom";

const Home = () => {
  const {user} = useUser();
  return (
    <div className="container">
      {/* <Navbar/> */}
      {
        user &&
        <button type="button" className="btn btn-success m-2 p-2">
        <Link className="nav-link" to="/create-post">
          Add Post
        </Link>
      </button>
      }
      <PostList />
      {/* <NewPost/> */}
    </div>
  );
};

export default Home;
