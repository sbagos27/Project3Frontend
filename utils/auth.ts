import AsyncStorage from "@react-native-async-storage/async-storage";

export type AuthInfo = {token: string; userId: number; username?: string };

const KEY = "auth";

export async function setAuth(auth: AuthInfo){
    await AsyncStorage.setItem(KEY, JSON.stringify(auth));
}

export async function getAuth(): Promise <AuthInfo | null> {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
}

export async function clearAuth() { await AsyncStorage.removeItem(KEY);}