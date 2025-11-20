import { authFetch } from "./authFetch";

const BASE_URL = "https://group5project3-74e9cad2d6ba.herokuapp.com/api/comments";

const CommentsAPI = {
  // Ping endpoint
  async ping() {
    return await authFetch(`${BASE_URL}/ping`);
  },

  // CREATE a comment  -> POST /api/comments
  // comment = { postId, userId, content, ... }
  async createComment(comment) {
    return await authFetch(`${BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });
  },

  // READ all comments -> GET /api/comments
  async getAllComments() {
    return await authFetch(`${BASE_URL}`);
  },

  // READ comments for a specific post -> GET /api/comments/post/{postId}
  async getCommentsByPostId(postId) {
    return await authFetch(`${BASE_URL}/post/${postId}`);
  },

  // READ a single comment -> GET /api/comments/{id}
  async getCommentById(id) {
    return await authFetch(`${BASE_URL}/${id}`);
  },

  // UPDATE a comment -> PUT /api/comments/{id}
  async updateComment(id, updatedFields) {
    return await authFetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });
  },

  // DELETE a comment -> DELETE /api/comments/{id}
  async deleteComment(id) {
    return await authFetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  }
};

export default CommentsAPI;