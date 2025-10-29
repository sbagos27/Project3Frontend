import React, { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router'; // 👈 add this line

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import Footer from '@/components/Footer';
import { globalStyles } from '@/styles/globalStyle';

export default function SearchScreen() {
  const [query, setQuery] = useState('');

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


