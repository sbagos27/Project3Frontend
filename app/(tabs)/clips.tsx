import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { globalStyles } from "@/styles/globalStyle";
import { getJwt } from "@/utils/auth";

export default function ClipsScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        setLoading(true);
        setError(null);
        const t = await getJwt();
        if (!t) {
          setError("You must sign in first.");
        } else {
          setToken(t);
        }
      } catch (err) {
        console.error("Failed to load auth token:", err);
        setError("Failed to load auth token.");
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Checking your session…</Text>
      </View>
    );
  }

  if (error || !token) {
    return (
      <View style={globalStyles.container}>
        <Text>{error ?? "You must sign in first."}</Text>
      </View>
    );
  }

  // Logged-in content
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>clips, coming soon</Text>
    </View>
  );
}
