// app/selectCat.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Cat, getCurrentUser } from '@/utils/api';
import { getJwt, getSelectedCatId, setSelectedCatId } from '@/utils/auth';

const BASE_URL = 'https://group5project3-74e9cad2d6ba.herokuapp.com';

export default function SelectCatScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newBio, setNewBio] = useState('');

  // Load token + cats
  useEffect(() => {
    const init = async () => {
      try {
        const t = await getJwt();
        if (!t) {
          setError('You must sign in first.');
          setLoading(false);
          return;
        }
        setToken(t);

        const res = await fetch(`${BASE_URL}/api/cats`, {
          headers: {
            Authorization: `Bearer ${t}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error ${res.status}: ${text}`);
        }

        const data: Cat[] = await res.json();
        setCats(data);

        // Keep selection consistent if one was already stored
        await getSelectedCatId();
      } catch (err: any) {
        console.error('Failed to load cats:', err);
        setError(err.message ?? 'Failed to load cats.');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleSelectCat = async (catId: number) => {
    try {
      await setSelectedCatId(catId);
      router.replace('/(tabs)/account');
    } catch (err) {
      console.error('Failed to set selected cat:', err);
      Alert.alert('Error', 'Could not select this cat. Please try again.');
    }
  };

  const handleCreateCat = async () => {
    if (!token) return;

    const trimmedName = newName.trim();
    const trimmedBio = newBio.trim();

    if (!trimmedName) {
      Alert.alert('Name required', 'Please give your cat a name.');
      return;
    }

    try {
      // We need userId for the backend -> get it from /api/users/me
      const user = await getCurrentUser();
      if (!user) {
        Alert.alert(
          'Error',
          'Could not load your user info. Please sign in again.',
        );
        return;
      }

      const payload: any = {
        name: trimmedName,
        userId: user.id, // fixes 500 on /api/cats
      };
      if (trimmedBio) {
        payload.bio = trimmedBio;
      }

      const res = await fetch(`${BASE_URL}/api/cats`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // <-- fixed
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${res.status}: ${text}`);
      }

      const created: Cat = await res.json();
      setCats((prev) => [...prev, created]);

      // Immediately select the new cat.
      await setSelectedCatId(created.id);
      router.replace('/(tabs)/account');
    } catch (err: any) {
      console.error('Failed to create cat:', err);
      Alert.alert('Error', err.message ?? 'Could not create cat.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading your cats…</Text>
      </SafeAreaView>
    );
  }

  if (error || !token) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>{error ?? 'You must sign in first.'}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.replace('/(tabs)/account')}
        >
          <MaterialIcons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Select a cat</Text>

        {/* Spacer to balance the back button */}
        <View style={{ width: 22 }} />
      </View>

      {/* Main content */}
      <Text style={styles.title}>Choose your cat</Text>

      {cats.length === 0 ? (
        <Text style={styles.subtitle}>No cats yet — add your first cat below!</Text>
      ) : (
        <>
          <Text style={styles.subtitle}>Tap a cat to use it on your profile.</Text>
          <FlatList
            data={cats}
            keyExtractor={(cat) => String(cat.id)}
            style={{ marginTop: 8, maxHeight: 260 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.catRow}
                onPress={() => handleSelectCat(item.id)}
              >
                <View style={styles.catAvatarPlaceholder} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.catName}>{item.name}</Text>
                  {!!item.bio && <Text style={styles.catBio}>{item.bio}</Text>}
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      <View style={styles.divider} />

      <Text style={styles.title}>Add a new cat</Text>
      <TextInput
        style={styles.input}
        placeholder="Cat name"
        value={newName}
        onChangeText={setNewName}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Short bio (optional)"
        value={newBio}
        onChangeText={setNewBio}
        multiline
      />

      <TouchableOpacity style={styles.primaryButton} onPress={handleCreateCat}>
        <Text style={styles.primaryButtonText}>Save cat</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 32,
    backgroundColor: '#fff',
  },
  header: {
    height: 56,
    backgroundColor: '#000',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  headerBackButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    color: '#555',
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  catAvatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eee',
  },
  catName: {
    fontWeight: '600',
  },
  catBio: {
    color: '#666',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
  },
  primaryButton: {
    marginTop: 16,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});


