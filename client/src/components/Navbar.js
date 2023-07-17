import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const Navbar = () => {
  const { user, setUser } = useUser();
  return (
    // <div >
      <nav className="navbar navbar-expand-lg navbar-light bg-light p-2">
        <Link className="navbar-brand" to="/">
          Navbar
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <Link className="nav-link" to="/">
                Home <span className="sr-only">(current)</span>
              </Link>
            </li>
            {user && <li className="nav-item">
              <Link className="nav-link" to="/create-post">
                Add Post
              </Link>
            </li>
            } 
            {user && 
            <li className="nav-item">
              <Link className="nav-link" to="/create-video">
                Add video
              </Link>
            </li>
            }
            {user && 
            <li className="nav-item">
              <button type="button" className="btn btn-danger" onClick={()=>setUser(undefined)}>
                Logout
              </button>
            </li>
            }
            {user === undefined && 
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
            }
            {user === undefined && 
            <li className="nav-item">
              <Link className="nav-link" to="/register">
                Register
              </Link>
            </li>
            }
            {/* <li className="nav-item">
              <Link className="nav-link disabled" to="/">
                Disabled
              </Link>
            </li> */}
          </ul>
        </div>
      </nav>
    // </div>
  );
};

export default Navbar;
