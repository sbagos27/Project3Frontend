// app/(tabs)/add.tsx
import { globalStyles } from '@/styles/globalStyle';
import { getJwt, getUserId, logout } from '@/utils/auth';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const BASE_URL = 'https://group5project3-74e9cad2d6ba.herokuapp.com';

export default function AddScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // form fields
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [catId, setCatId] = useState('');

  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const t = await getJwt();
      setToken(t);
      setLoading(false);
    };

    loadToken();
  }, []);

 const handleCreatePost = async () => {
  try {
    setPosting(true);
    setMessage(null);

    const userId = await getUserId();

    // EXACT format expected by your backend
    const body = {
      authorId: userId,
      caption: caption,
      imageUrl: imageUrl,
      likesCount: 0,
      commentCount: 0,
      catId: Number(catId),
    };

    const res = await fetch(`${BASE_URL}/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    setMessage("Post created successfully!");
    setCaption("");
    setImageUrl("");
    setCatId("");
  } catch (err) {
    console.error("Failed to post:", err);
    setMessage("Error creating post.");
  } finally {
    setPosting(false);
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

  if (!token) {
    return (
      <View style={globalStyles.container}>
        <Text>You must sign in first.</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Create New Post</Text>

      <TextInput
        placeholder="Caption"
        value={caption}
        onChangeText={setCaption}
        style={styles.input}
      />

      <TextInput
        placeholder="Image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
        style={styles.input}
      />

      <TextInput
        placeholder="Category ID"
        value={catId}
        onChangeText={setCatId}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.postButton}
        onPress={handleCreatePost}
        disabled={posting}
      >
        <Text style={styles.postButtonText}>
          {posting ? "Posting..." : "Create Post"}
        </Text>
      </TouchableOpacity>

      {message && <Text style={{ marginTop: 10 }}>{message}</Text>}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const handleLogout = async () => {
  await logout();
  router.replace('/signIn');
};

const styles = StyleSheet.create({
  input: {
    width: "90%",
    padding: 12,
    marginTop: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  postButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#ff3b30",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
});
