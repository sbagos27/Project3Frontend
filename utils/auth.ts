import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export async function getJwt() {
  if (Platform.OS === "web") {
    return window.localStorage.getItem("jwt");
  }
  return await SecureStore.getItemAsync("jwt");
}
