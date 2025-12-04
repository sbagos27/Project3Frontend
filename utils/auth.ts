import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CAT_KEY = 'selectedCatId';

export async function getJwt() {
  if (Platform.OS === "web") {
    return window.localStorage.getItem("jwt");
  }
  return await SecureStore.getItemAsync("jwt");
}

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
export async function logout() {
  // Clear JWT (web vs native)
  if (Platform.OS === "web") {
    window.localStorage.removeItem("jwt");
  } else {
    await SecureStore.deleteItemAsync("jwt");
  }

  // Clear selected cat
  if (Platform.OS === "web") {
    window.localStorage.removeItem("selectedCatId");
  } else {
    await AsyncStorage.removeItem("selectedCatId");
  }
}

