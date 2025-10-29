import React, { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { globalStyles } from '@/styles/globalStyle';

export default function SearchScreen() {
  const [query, setQuery] = useState('');

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


