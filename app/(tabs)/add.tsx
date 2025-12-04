// app/(tabs)/add.tsx
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { globalStyles } from '@/styles/globalStyle';
import { getJwt, logout } from '@/utils/auth';

export default function AddScreen() {
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
          setError('You must sign in first.');
        } else {
          setToken(t);
        }
      } catch (err) {
        console.error('Failed to load auth token:', err);
        setError('Failed to load auth token.');
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/signIn'); // path of app/signIn.tsx
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

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
        <Text>{error ?? 'You must sign in first.'}</Text>
      </View>
    );
  }

  // Logged-in content
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>add posttt, coming soon</Text>

      {/* Temporary logout button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#ff3b30',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
});

