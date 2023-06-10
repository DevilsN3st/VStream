import { makeRequest } from "./makeRequest"

export function createComment({ postId, message, parentId, user }) {
  return makeRequest(`posts/${postId}/comments`, {
    method: "POST",
    data: { message, parentId, user },
  })
}

export function updateComment({ postId, message, id }) {
  return makeRequest(`posts/${postId}/comments/${id}`, {
    method: "PUT",
    data: { message },
  })
}

export function deleteComment({ postId, id }) {
  return makeRequest(`posts/${postId}/comments/${id}`, {
    method: "DELETE",
  })
}

export function toggleCommentLike({ id, postId }) {
  return makeRequest(`/posts/${postId}/comments/${id}/toggleLike`, {
    method: "POST",
  })
}
