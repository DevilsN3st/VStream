import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getPosts } from "../services/posts";

export function PostList() {
  const { loading, error, value: posts } = useAsync(getPosts);
  console.log(posts);

  if (loading) return <h1>Loading</h1>;
  if (error) return <h1 className="error-msg">{error}</h1>;

  return (
    <>
    <div className="container p-2">

      {/* <Link to={"/create-post"}>Create Post</Link> */}
      {posts.map((post) => {
        return (
          <div className="card mt-2 p-2" key={post.id} style={{width: '20rem'}}>
            <div className="card-body">
              <h5 className="card-title" >
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
              </h5>
            </div>
          </div>
        );
      })}
      </div>
    </>
  );
}
