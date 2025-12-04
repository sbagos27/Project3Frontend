import React, { useEffect, useState } from "react";
import { TextInput, View, ActivityIndicator, Text } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { globalStyles } from "@/styles/globalStyle";
import { getJwt } from "@/utils/auth";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
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
      <ThemedView style={globalStyles.container}>
        <ActivityIndicator />
        <ThemedText style={{ marginTop: 8 }}>Checking your session…</ThemedText>
      </ThemedView>
    );
  }

  if (error || !token) {
    return (
      <ThemedView style={globalStyles.container}>
        <ThemedText>{error ?? "You must sign in first."}</ThemedText>
      </ThemedView>
    );
  }

  // Logged-in content
  return (
    <ThemedView style={globalStyles.container}>
      <View style={globalStyles.searchContainer}>
        <TextInput
          style={globalStyles.searchInput}
          placeholder="Search for friends..."
          placeholderTextColor="#000000ff"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ThemedView style={globalStyles.resultsContainer}>
        <ThemedText type="subtitle">Search Results</ThemedText>
        <ThemedText>No results yet — friend database coming soon!</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

