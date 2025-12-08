
import { getJwt } from './auth';

const BASE_URL = 'https://group5project3-74e9cad2d6ba.herokuapp.com';

export interface User {
    id: number;
    username: string;
    email?: string;
    provider?: string;
}

export interface ChatMessage {
    id?: number;
    senderId: number;
    recipientId: number;
    content: string;
    timestamp?: string;
}

export async function getAllUsers(): Promise<User[]> {
    const token = await getJwt();
    if (!token) {
        console.warn("No token found when fetching users");
        return [];
    }

    try {
        const response = await fetch(`${BASE_URL}/api/users/all`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch users:", response.status);
            throw new Error('Failed to fetch users');
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function getChatHistory(otherUserId: number): Promise<ChatMessage[]> {
    const token = await getJwt();
    if (!token) {
        console.warn("No token found when fetching chat history");
        return [];
    }

    try {
        const response = await fetch(`${BASE_URL}/api/messages/${otherUserId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch chat history:", response.status);
            throw new Error('Failed to fetch chat history');
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return [];
    }
}

