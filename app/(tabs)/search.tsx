import React, { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  return (
    <ThemedView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for friends..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ThemedView style={styles.resultsContainer}>
        <ThemedText type="subtitle">Search Results</ThemedText>
        <ThemedText>No results yet — friend database coming soon!</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  searchContainer: {
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  searchInput: {
    fontSize: 16,
    color: '#333',
  },
  resultsContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
});
