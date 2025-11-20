// since we are using a strict OAUTH we will have to figure how to store our token to access our routes and what not
// just an extra step

import { authFetch } from "./authFetch";

const BASE_URL = "https://group5project3-74e9cad2d6ba.herokuapp.com/api/likes";

const LikeAPI = {
  // Ping endpoint
  async ping() {
    return await authFetch(`${BASE_URL}/ping`);
  },

  // Create a like  -> POST /api/likes
  // like = { postId: number, userId: number }
  async createLike(like) {
    return await authFetch(`${BASE_URL}`, {
      method: "POST",
      body: JSON.stringify(like),
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  // Get all likes  -> GET /api/likes
  async getAllLikes() {
    return await authFetch(`${BASE_URL}`);
  },

  // Get likes for a post -> GET /api/likes/post/{postId}
  async getLikesByPostId(postId) {
    return await authFetch(`${BASE_URL}/post/${postId}`);
  },

  // Get one like -> GET /api/likes/{id}
  async getLikeById(id) {
    return await authFetch(`${BASE_URL}/${id}`);
  },

  // Delete a like -> DELETE /api/likes/{id}
  async deleteLike(id) {
    return await authFetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};

export default LikeAPI;