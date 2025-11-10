import React, { useEffect, useState, useMemo } from "react";
import { TextInput, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router'; 

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import Footer from '@/components/Footer';
import { globalStyles } from '@/styles/globalStyle';
import {
  initDB,
  insertUser,
  getAllUsers,
  FindUserByUsername,
} from "../scripts/database";

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  useEffect(() => {
    let cancelled = false;

    const setup = async () => {
      try {
        await initDB(); // ✅ make sure DB is ready first
        await insertUser('testuser', 'password123');
        await insertUser('keith', 'test');
        await insertUser('Admin', 'AdminPass');

        const users = await getAllUsers();
        if (!cancelled) {
          console.log("📋 All Users:");
          users.forEach((u: { id: number; username: string; password: string }) => {
            console.log(`👤 Username: ${u.username}, Password: ${u.password}`);
          });
        }
      } catch (err: any) {
        console.log("❌ Setup error:", err?.message ?? String(err));
      }
    };

    setup();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      {/* 👇 this line hides the back arrow and default header */}
      <Stack.Screen options={{ headerShown: false }} />

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
          <ThemedText>No results yet — cat database coming soon!</ThemedText>
        </ThemedView>
      </ThemedView>

      <Footer />
    </>
  );
}


