import { usePost } from "../contexts/PostContext"
import { useUser } from "../contexts/UserContext"
import { useAsyncFn } from "../hooks/useAsync"
import { createComment } from "../services/comments"
import { CommentForm } from "./CommentForm"
import { CommentList } from "./CommentList"
import VideoPlayer from "./VideoPlayer"

export function Post() {
  const { post, rootComments, createLocalComment } = usePost()
  const user1 = useUser();
  const user = user1?.user;
  console.log("user from post", user1 )
  const { loading, error, execute: createCommentFn } = useAsyncFn(createComment)

  function onCommentCreate(message) {
    return createCommentFn({ postId: post?.id, message, user }).then(
      createLocalComment
    )
  }
  console.log("post from post", post);
  console.log(post?.video?.fileName);
  return (
    <>
        {post?.video?.id && <VideoPlayer videoId = {post?.video.fileName}/>}
      <h1>{post.title}</h1>
      <article>{post.body}</article>
      <h3 className="comments-title">Comments</h3>
      <section>
        {user !== undefined ? <CommentForm
          loading={loading}
          error={error}
          onSubmit={onCommentCreate}
        /> : <div> Login to comment </div>}
        {rootComments != null && rootComments.length > 0 && (
          <div className="mt-4">
            <CommentList comments={rootComments} />
          </div>
        )}
      </section>
    </>
  )
}
