// app/selectCat.tsx
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
import { router } from 'expo-router';
import { getJwt, getSelectedCatId, setSelectedCatId } from '@/utils/auth';

const BASE_URL = 'https://group5project3-74e9cad2d6ba.herokuapp.com';

type Cat = {
  id: number;
  name: string;
  bio?: string | null;
  avatarUrl?: string | null;
  birthdate?: string | null;
};

export default function SelectCatScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newBio, setNewBio] = useState('');

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

        // (Optional) if a cat is already selected, highlight it visually later
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
    if (!newName.trim()) {
      Alert.alert('Name required', 'Please give your cat a name.');
      return;
    }

    try {
      const body = JSON.stringify({
        name: newName.trim(),
        bio: newBio.trim() || null,
      });

      const res = await fetch(`${BASE_URL}/api/cats`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body,
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
    paddingTop: 24,
    paddingBottom: 32,
    backgroundColor: '#fff',
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
