// app/(tabs)/add.tsx
// npm install expo-image-picker
// use above if errors
import { globalStyles } from '@/styles/globalStyle';
import { getJwt, getUserId, logout } from '@/utils/auth';
import * as ImagePicker from "expo-image-picker";
import { router } from 'expo-router';

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const BASE_URL = 'https://group5project3-74e9cad2d6ba.herokuapp.com';

const uriToBlob = async (uri: string) => {
  const res = await fetch(uri);
  return await res.blob();
};

export default function AddScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [caption, setCaption] = useState('');
  const [catId, setCatId] = useState('');
  const [imageFile, setImageFile] = useState<any>(null);

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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageFile(result.assets[0]);
    }
  };

  const handleCreatePost = async () => {
    try {
      setPosting(true);
      setMessage(null);

      const userId = await getUserId();
      if (!userId) throw new Error("User ID missing");
      if (!imageFile) {
        setMessage("Please select an image first.");
        return;
      }

      const formData = new FormData();

      formData.append("caption", caption);
      formData.append("authorId", String(userId));
      formData.append("catId", String(catId));

      const fileBlob = await uriToBlob(imageFile.uri);
      formData.append("file", fileBlob, "upload.jpg");

      const res = await fetch(`${BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t);
      }

      setMessage("Post created successfully!");
      setCaption("");
      setCatId("");
      setImageFile(null);

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

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>Select Image</Text>
      </TouchableOpacity>

      {imageFile && (
        <Image
          source={{ uri: imageFile.uri }}
          style={{ width: 200, height: 200, marginTop: 10, borderRadius: 10 }}
        />
      )}

      <TextInput
        placeholder="Caption"
        value={caption}
        onChangeText={setCaption}
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
  imageButton: {
    marginTop: 20,
    backgroundColor: "#888",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  imageButtonText: {
    color: "white",
    fontWeight: "bold",
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
