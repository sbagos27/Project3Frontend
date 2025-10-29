import React, { useCallback, useEffect, useState } from "react";
import { View, FlatList, RefreshControl, ActivityIndicator, SafeAreaView } from "react-native";
import PostCard from "@/components/post-card";

type Post = {
  id: string;
  imageUrl: string;
  creator: { name: string; handle?: string; avatarUrl?: string };
  liked?: boolean;
  likes?: number;
  comments?: Array<{ id: string; author: { name: string; avatarUrl?: string }; text: string; createdAt?: string }>;
};

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  
  const fetchPage = async (pageNum: number): Promise<{ items: Post[]; hasMore: boolean }> => {
    //this is just for testing for now but will use api/database for full functionality once implemented.
    await new Promise((r) => setTimeout(r, 400));
    const start = (pageNum - 1) * 8;
    const items: Post[] = Array.from({ length: 8 }).map((_, i) => {
      const id = `p_${start + i + 1}`;
      return {
        id,
        imageUrl: `https://m.media-amazon.com/images/I/517i1zjTFNL._AC_UF1000,1000_QL80_.jpg`,
        creator: { name: ["Andrew", "Keith", "Gabriel", "Senen"][i % 4], handle: "user" + ((i % 4) + 1), avatarUrl : "https://i.kym-cdn.com/editorials/icons/mobile/000/013/069/guy-pointing-at-himself.jpg"},
        liked: Math.random() > 0.5,
        likes: Math.floor(Math.random() * 200),
        comments: [
          { id: `${id}_c1`, author: { name: "MrComments" }, text: "What a cool cat!", createdAt: new Date(Date.now() - 3600_000).toISOString() },
        ],
      };
    });
    return { items, hasMore: pageNum < 5 }; 
  };

  const loadInitial = useCallback(async () => {
    const res = await fetchPage(1);
    setPosts(res.items);
    setPage(1);
    setHasMore(res.hasMore);
  }, []);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetchPage(1);
      setPosts(res.items);
      setPage(1);
      setHasMore(res.hasMore);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const onEndReached = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const next = page + 1;
      const res = await fetchPage(next);
      setPosts((p) => [...p, ...res.items]);
      setPage(next);
      setHasMore(res.hasMore);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            id={item.id}
            imageUrl={item.imageUrl}
            creator={item.creator}
            initialLiked={item.liked}
            initialLikeCount={item.likes}
            initialComments={item.comments}
            style={{
              width: "100%",
              maxWidth: 680,         
              alignSelf: "center",
              marginVertical: 10,
            }}
            onLikeToggle={({ id, liked }) => {
              
            }}
            onSubmitComment={async ({ id, text }) => {
            
            }}
          />
        )}
        contentContainerStyle={{
          paddingVertical: 8,
          
          paddingHorizontal: 12,
          gap: 0,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.35}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator />
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={4}
        windowSize={8}
      />
    </SafeAreaView>
  );
}