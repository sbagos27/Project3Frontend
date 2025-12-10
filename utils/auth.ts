// utils/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const CAT_KEY = 'selectedCatId';
const JWT_KEY = 'jwt';

// ---- JWT helpers ----

export async function getJwt(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return window.localStorage.getItem(JWT_KEY);
  }
  return await SecureStore.getItemAsync(JWT_KEY);
}

export async function setJwt(token: string | null): Promise<void> {
  if (Platform.OS === 'web') {
    if (token) {
      window.localStorage.setItem(JWT_KEY, token);
    } else {
      window.localStorage.removeItem(JWT_KEY);
    }
    return;
  }

  if (token) {
    await SecureStore.setItemAsync(JWT_KEY, token);
  } else {
    await SecureStore.deleteItemAsync(JWT_KEY);
  }
}

// ---- Selected cat helpers ----

export const getSelectedCatId = async (): Promise<number | null> => {
  const value = await AsyncStorage.getItem(CAT_KEY);
  if (!value) return null;

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

export const setSelectedCatId = async (id: number | null): Promise<void> => {
  if (id == null) {
    await AsyncStorage.removeItem(CAT_KEY);
  } else {
    await AsyncStorage.setItem(CAT_KEY, String(id));
  }
};

// ---- Logout ----

export async function logout(): Promise<void> {
  // Clear JWT (web vs native)
  if (Platform.OS === 'web') {
    window.localStorage.removeItem(JWT_KEY);
  } else {
    await SecureStore.deleteItemAsync(JWT_KEY);
  }

  // Clear selected cat
  if (Platform.OS === 'web') {
    window.localStorage.removeItem(CAT_KEY);
  } else {
    await AsyncStorage.removeItem(CAT_KEY);
  }
}

// ---- JWT decoding & user id ----

function decodeJwtPayload(token: string): any | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    // atob is available on web; in native you may need a polyfill if this ever breaks
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );

    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Failed to decode JWT:', err);
    return null;
  }
}

export async function getUserId(): Promise<number | null> {
  const token = await getJwt();
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  return (
    (typeof payload.id === 'number' && payload.id) ||
    (typeof payload.userId === 'number' && payload.userId) ||
    (payload.sub ? Number(payload.sub) : null) ||
    null
  );
}
