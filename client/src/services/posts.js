import { makeRequest } from "./makeRequest"

export function getPosts(id) {
  return makeRequest(`/posts?user=${id}`)
}

export function getPost(id) {
  return makeRequest(`/posts/${id}`)
}

export function getCookie() {
  return makeRequest("/")
}
