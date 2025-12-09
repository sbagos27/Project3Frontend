// app/(tabs)/home.tsx
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import Header from '@/components/Header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { globalStyles } from '@/styles/globalStyle';
import { getJwt } from '@/utils/auth';

const BASE_URL = 'https://group5project3-74e9cad2d6ba.herokuapp.com';

type Post = {
  id: number;
  caption: string;
  imageUrl: string;
  authorId: number;
  createdAt?: string;
  catId?: number;

  // added on frontend after fetching username
  username?: string;
};

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user info for each authorId
  const fetchUsers = async (authorIds: number[], token: string) => {
    const uniqueIds = [...new Set(authorIds)];
    const userMap: Record<number, string> = {};

    for (const id of uniqueIds) {
      try {
        const res = await fetch(`${BASE_URL}/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const user = await res.json();
          userMap[id] = user.username;
        } else {
          userMap[id] = "Unknown User";
        }
      } catch (err) {
        userMap[id] = "Unknown User";
      }
    }

    return userMap;
  };

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await getJwt();
        if (!token) {
          setError('You must sign in first.');
          setLoading(false);
          return;
        }

        // 1️⃣ Fetch Posts
        const res = await fetch(`${BASE_URL}/api/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${await res.text()}`);
        }

        const postsData: Post[] = await res.json();

        // 2️⃣ Fetch usernames for all authorIds
        const authorIds = postsData.map((p) => p.authorId);
        const userMap = await fetchUsers(authorIds, token);

        // 3️⃣ Attach usernames to posts
        const postsWithUsernames = postsData.map((post) => ({
          ...post,
          username: userMap[post.authorId] || "Unknown User",
        }));

        setPosts(postsWithUsernames);
      } catch (err: any) {
        console.error('Failed to load posts:', err);
        setError(err.message ?? 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPostsAndUsers();
  }, []);

  return (
    <>
      <Header />

      <ScrollView>
        <ThemedView style={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 32 }}>

          <ThemedView style={globalStyles.titleContainer}>
            <ThemedText type="title">Whiskr Feed</ThemedText>
          </ThemedView>

          {/* Loading */}
          {loading && (
            <ThemedView style={globalStyles.centered}>
              <ActivityIndicator />
              <ThemedText style={{ marginTop: 8 }}>Loading cats…</ThemedText>
            </ThemedView>
          )}

          {/* Error */}
          {error && !loading && (
            <ThemedView style={globalStyles.centered}>
              <ThemedText type="subtitle">Error</ThemedText>
              <ThemedText>{error}</ThemedText>
            </ThemedView>
          )}

          {/* No posts */}
          {!loading && !error && posts.length === 0 && (
            <ThemedView style={globalStyles.centered}>
              <ThemedText>No posts yet. Be the first to share a cat!</ThemedText>
            </ThemedView>
          )}

          {/* Posts */}
          {!loading && !error &&
            posts.map((post) => (
              <ThemedView key={post.id} style={globalStyles.postCard}>

                {/* Header: Username only */}
                <View style={globalStyles.postHeader}>
                  <ThemedText style={globalStyles.usernameText}>
                    {post.username || 'Unknown User'}
                  </ThemedText>
                </View>

                {/* Main Media: Full width image */}
                {post.imageUrl && (
                  <Image
                    source={{ uri: post.imageUrl }}
                    style={globalStyles.postImage}
                    contentFit="cover"
                  />
                )}

                {/* Footer: Actions (placeholder), Caption, Date */}
                <View style={globalStyles.postFooter}>

                  {/* Action Icons (Heart, Comment, Share) - Placeholders for visual fidelity */}
                  <View style={globalStyles.actionIconsFn}>
                    {/* Using simple text or placeholders since we might not have icons imported yet, 
                        but relying on globalStyles.actionIconsFn to layout them out if we did. 
                        For now, just keeping clean spacing. */}
                  </View>

                  {/* Caption Row */}
                  <ThemedText style={globalStyles.caption}>
                    <ThemedText style={{ fontWeight: '700', color: '#000' }}>{post.username} </ThemedText>
                    {post.caption}
                  </ThemedText>

                  {/* Date */}
                  {post.createdAt && (
                    <ThemedText style={globalStyles.metaText}>
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        month: 'long',
                        day: 'numeric',
                      })}
                    </ThemedText>
                  )}
                </View>

              </ThemedView>
            ))}

        </ThemedView>
      </ScrollView>
    </>
  );
}
