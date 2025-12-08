
import { getJwt } from './auth';

const BASE_URL = 'https://group5project3-74e9cad2d6ba.herokuapp.com';

export interface User {
    userId: number;
    username: string;
    email?: string;
    provider?: string;
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
