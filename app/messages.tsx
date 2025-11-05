import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { globalStyles } from '@/styles/globalStyle';
import Header from '@/components/activityHeader';
import { Stack } from 'expo-router'; 

export default function activityScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>messages, coming soon</Text>
      </View>
    </>
  );
}

