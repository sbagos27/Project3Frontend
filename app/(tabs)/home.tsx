import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';              // ✅ IMPORTANT

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { globalStyles, brandColor } from '@/styles/globalStyle';
import { getJwt } from '@/utils/auth';

const BASE_URL = 'https://group5project3-74e9cad2d6ba.herokuapp.com';

type Post = {
  id: number;
  caption: string;
  imageUrl: string;
  authorId?: number;
  catId?: number;
  createdAt?: string;
};

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await getJwt();
        if (!token) {
          setError('You must sign in first.');
          setLoading(false);
          return;
        }

        const res = await fetch(`${BASE_URL}/api/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error ${res.status}: ${text}`);
        }

        const data = await res.json();
        setPosts(data);
      } catch (err: any) {
        console.error('Failed to load posts:', err);
        setError(err.message ?? 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: brandColor, dark: brandColor }}
      headerImage={<></>}  // ✅ no React logo
    >
      {/* Whiskr brand header */}
      <ThemedView style={globalStyles.headerBrandContainer}>
        <ThemedText style={globalStyles.headerBrandText}>Whiskr</ThemedText>
      </ThemedView>

      {loading && (
        <ThemedView style={globalStyles.centered}>
          <ActivityIndicator />
          <ThemedText style={{ marginTop: 8 }}>Loading cats…</ThemedText>
        </ThemedView>
      )}

      {error && !loading && (
        <ThemedView style={globalStyles.centered}>
          <ThemedText type="subtitle">Error</ThemedText>
          <ThemedText>{error}</ThemedText>
        </ThemedView>
      )}

      {!loading && !error && posts.length === 0 && (
        <ThemedView style={globalStyles.centered}>
          <ThemedText>No posts yet. Be the first to share a cat!</ThemedText>
        </ThemedView>
      )}

      {!loading &&
        !error &&
        posts.map((post) => (
          <ThemedView key={post.id} style={globalStyles.postCard}>
            {post.imageUrl && (
              <Image
                source={{ uri: post.imageUrl }}
                style={globalStyles.postImage}
                contentFit="cover"
              />
            )}

            <ThemedText type="subtitle" style={globalStyles.caption}>
              {post.caption || 'No caption'}
            </ThemedText>

            {post.createdAt && (
              <ThemedText style={globalStyles.metaText}>
                Posted on {new Date(post.createdAt).toLocaleString()}
              </ThemedText>
            )}
          </ThemedView>
        ))}
    </ParallaxScrollView>
  );
}
