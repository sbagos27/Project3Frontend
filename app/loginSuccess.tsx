import React, { useEffect } from "react";
import { ActivityIndicator, View, Text, Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function LoginSuccess() {
  const { token } = useLocalSearchParams(); // read ?token=.... from URL
  const router = useRouter();

  useEffect(() => {
    const storeToken = async () => {
      if (!token || typeof token !== "string") {
        console.error("No token found in redirect URL");
        return;
      }

      try {
        if (Platform.OS === "web") {
          // Web: use localStorage for testing
          window.localStorage.setItem("jwt", token);
        } else {
          // Native: use SecureStore
          await SecureStore.setItemAsync("jwt", token);
        }
      } catch (err) {
        console.error("Error storing token", err);
      }

      // Redirect user into main app
      router.replace("/(tabs)/home");
    };

    storeToken();
  }, [token]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 16, fontSize: 16 }}>Signing you in…</Text>
    </View>
  );
}
