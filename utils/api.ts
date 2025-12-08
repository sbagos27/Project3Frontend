
import { getJwt } from './auth';

const BASE_URL = 'https://group5project3-74e9cad2d6ba.herokuapp.com';

export interface User {
    id: number;
    username: string;
    email: string;
    provider?: string;
    providerId?: string;
}

export interface ChatMessage {
    id: number;
    senderId: number;
    recipientId: number;
    content: string;
    createdAt: string;
}

export interface Post {
    id: number;
    caption?: string;
    imageUrl: string;
    authorId: number;
    catId?: number;
    likesCount: number;
    commentCount: number;
    createdAt: string;
}

export interface Comment {
    id: number;
    postId: number;
    userId: number;
    content: string;
    createdAt: string;
}

export interface Like {
    id: number;
    postId: number;
    userId: number;
    createdAt: string;
}

export interface Cat {
    id: number;
    name: string;
    bio?: string;
    avatarUrl?: string;
    birthdate?: string;
    userId: number;
    createdAt: string;
}

async function getAuthHeaders() {
    const token = await getJwt();
    if (!token) return null;
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
}

export async function getAllUsers(): Promise<User[]> {
    const headers = await getAuthHeaders();
    if (!headers) return [];

    try {
        const response = await fetch(`${BASE_URL}/api/users/all`, { headers });
        if (!response.ok) throw new Error('Failed to fetch users');
        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function getCurrentUser(): Promise<User | null> {
    const headers = await getAuthHeaders();
    if (!headers) return null;

    try {
        const response = await fetch(`${BASE_URL}/api/users/me`, { headers });
        if (!response.ok) throw new Error('Failed to fetch current user');
        return await response.json();
    } catch (error) {
        console.error("Error fetching current user:", error);
        return null;
    }
}

export async function updateUsername(userId: number, username: string): Promise<User | null> {
    const headers = await getAuthHeaders();
    if (!headers) return null;

    try {
        const response = await fetch(`${BASE_URL}/api/users/${userId}/username`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ username }),
        });
        if (!response.ok) throw new Error('Failed to update username');
        const data = await response.json();
        return data.userId ? { ...data, id: data.userId } : data; // Handle potential field mismatch
    } catch (error) {
        console.error("Error updating username:", error);
        return null;
    }
}

// --- Post Endpoints ---

export async function createPost(postData: { caption: string; imageUrl: string; authorId: number; catId: number }): Promise<Post | null> {
    const headers = await getAuthHeaders();
    if (!headers) return null;

    try {
        const response = await fetch(`${BASE_URL}/api/posts`, {
            method: 'POST',
            headers,
            body: JSON.stringify(postData),
        });
        if (!response.ok) throw new Error('Failed to create post');
        return await response.json();
    } catch (error) {
        console.error("Error creating post:", error);
        return null;
    }
}

export async function getAllPosts(): Promise<Post[]> {
    const headers = await getAuthHeaders();
    if (!headers) return [];

    try {
        const response = await fetch(`${BASE_URL}/api/posts`, { headers });
        if (!response.ok) throw new Error('Failed to fetch posts');
        return await response.json();
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export async function getPostsByUser(userId: number): Promise<Post[]> {
    const headers = await getAuthHeaders();
    if (!headers) return [];

    try {
        const response = await fetch(`${BASE_URL}/api/posts/user/${userId}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch user posts');
        return await response.json();
    } catch (error) {
        console.error("Error fetching user posts:", error);
        return [];
    }
}

export async function getPostsByCat(catId: number): Promise<Post[]> {
    const headers = await getAuthHeaders();
    if (!headers) return [];

    try {
        const response = await fetch(`${BASE_URL}/api/posts/cat/${catId}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch cat posts');
        return await response.json();
    } catch (error) {
        console.error("Error fetching cat posts:", error);
        return [];
    }
}

export async function getPostById(id: number): Promise<Post | null> {
    const headers = await getAuthHeaders();
    if (!headers) return null;

    try {
        const response = await fetch(`${BASE_URL}/api/posts/${id}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch post');
        return await response.json();
    } catch (error) {
        console.error("Error fetching post:", error);
        return null;
    }
}

export async function updatePost(id: number, data: { caption?: string; imageUrl?: string }): Promise<Post | null> {
    const headers = await getAuthHeaders();
    if (!headers) return null;

    try {
        const response = await fetch(`${BASE_URL}/api/posts/${id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update post');
        return await response.json();
    } catch (error) {
        console.error("Error updating post:", error);
        return null;
    }
}

export async function deletePost(id: number): Promise<boolean> {
    const headers = await getAuthHeaders();
    if (!headers) return false;

    try {
        const response = await fetch(`${BASE_URL}/api/posts/${id}`, {
            method: 'DELETE',
            headers,
        });
        return response.ok;
    } catch (error) {
        console.error("Error deleting post:", error);
        return false;
    }
}

// --- Comment Endpoints ---

export async function createComment(commentData: { postId: number; userId: number; content: string }): Promise<Comment | null> {
    const headers = await getAuthHeaders();
    if (!headers) return null;

    try {
        const response = await fetch(`${BASE_URL}/api/comments`, {
            method: 'POST',
            headers,
            body: JSON.stringify(commentData),
        });
        if (!response.ok) throw new Error('Failed to create comment');
        return await response.json();
    } catch (error) {
        console.error("Error creating comment:", error);
        return null;
    }
}

export async function getCommentsByPost(postId: number): Promise<Comment[]> {
    const headers = await getAuthHeaders();
    if (!headers) return [];

    try {
        const response = await fetch(`${BASE_URL}/api/comments/post/${postId}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch comments');
        return await response.json();
    } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
    }
}

export async function deleteComment(id: number): Promise<boolean> {
    const headers = await getAuthHeaders();
    if (!headers) return false;

    try {
        const response = await fetch(`${BASE_URL}/api/comments/${id}`, {
            method: 'DELETE',
            headers,
        });
        return response.ok;
    } catch (error) {
        console.error("Error deleting comment:", error);
        return false;
    }
}

// --- Like Endpoints ---

export async function likePost(likeData: { postId: number; userId: number }): Promise<boolean> {
    const headers = await getAuthHeaders();
    if (!headers) return false;

    try {
        const response = await fetch(`${BASE_URL}/api/likes`, {
            method: 'POST',
            headers,
            body: JSON.stringify(likeData),
        });
        if (response.status === 409) return false; // Already liked
        if (!response.ok) throw new Error('Failed to like post');
        return true;
    } catch (error) {
        console.error("Error liking post:", error);
        return false;
    }
}

export async function getLikesByPost(postId: number): Promise<Like[]> {
    const headers = await getAuthHeaders();
    if (!headers) return [];

    try {
        const response = await fetch(`${BASE_URL}/api/likes/post/${postId}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch likes');
        return await response.json();
    } catch (error) {
        console.error("Error fetching likes:", error);
        return [];
    }
}

export async function unlikePost(id: number): Promise<boolean> {
    const headers = await getAuthHeaders();
    if (!headers) return false;

    try {
        const response = await fetch(`${BASE_URL}/api/likes/${id}`, {
            method: 'DELETE',
            headers,
        });
        return response.ok;
    } catch (error) {
        console.error("Error unliking post:", error);
        return false;
    }
}

// --- Cat Endpoints ---

export async function getAllCats(): Promise<Cat[]> {
    const headers = await getAuthHeaders();
    if (!headers) return [];

    try {
        const response = await fetch(`${BASE_URL}/api/cats`, { headers });
        if (!response.ok) throw new Error('Failed to fetch cats');
        return await response.json();
    } catch (error) {
        console.error("Error fetching cats:", error);
        return [];
    }
}

export async function getCatById(id: number): Promise<Cat | null> {
    const headers = await getAuthHeaders();
    if (!headers) return null;

    try {
        const response = await fetch(`${BASE_URL}/api/cats/${id}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch cat');
        return await response.json();
    } catch (error) {
        console.error("Error fetching cat:", error);
        return null;
    }
}

export async function createCat(catData: { name: string; description?: string; imageUrl?: string }): Promise<Cat | null> {
    const headers = await getAuthHeaders();
    if (!headers) return null;

    try {
        const response = await fetch(`${BASE_URL}/api/cats`, {
            method: 'POST',
            headers,
            body: JSON.stringify(catData),
        });
        if (!response.ok) throw new Error('Failed to create cat');
        return await response.json();
    } catch (error) {
        console.error("Error creating cat:", error);
        return null;
    }
}

export async function updateCat(id: number, catData: Partial<Cat>): Promise<Cat | null> {
    const headers = await getAuthHeaders();
    if (!headers) return null;

    try {
        const response = await fetch(`${BASE_URL}/api/cats/${id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(catData),
        });
        if (!response.ok) throw new Error('Failed to update cat');
        return await response.json();
    } catch (error) {
        console.error("Error updating cat:", error);
        return null;
    }
}

export async function deleteCat(id: number): Promise<boolean> {
    const headers = await getAuthHeaders();
    if (!headers) return false;

    try {
        const response = await fetch(`${BASE_URL}/api/cats/${id}`, {
            method: 'DELETE',
            headers,
        });
        return response.ok;
    } catch (error) {
        console.error("Error deleting cat:", error);
        return false;
    }
}

// --- Chat Endpoints ---

export async function getChatHistory(otherUserId: number): Promise<ChatMessage[]> {
    const headers = await getAuthHeaders();
    if (!headers) return [];

    try {
        const response = await fetch(`${BASE_URL}/api/messages/${otherUserId}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch chat history');
        return await response.json();
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return [];
    }
}

