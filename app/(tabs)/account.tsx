import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Dimensions,
  ListRenderItem,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Item = { id: string; image: string };

const COLS = 3;
const GAP = 1;
const SCREEN_W = Dimensions.get("window").width;
const IMG_SIZE = Math.floor((SCREEN_W - GAP * (COLS - 1)) / COLS);

export default function ProfileScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const hasMounted = useRef(false);

  // This will change to pull from user database/api in the future.
  const user = {
    username: "aUser",
    name: "John Cena",
    avatar:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTEhIVFhUVFRUXFxUYFhcXFRUVFxUXFhgWFRUYHSggGBolHRYXITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0mHSYtLS8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/...", // shortened for brevity
    bio: "I love cats LOL",
    stats: { posts: 3, followers: 67, following: 67 },
  } as const;

  // Initial load
  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;
    setItems(
      Array.from({ length: 18 }).map((_, i) => ({
        id: `p_${i + 1}`,
        image: `https://picsum.photos/seed/initial_${i + 1}/900/900`,
      }))
    );
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 350));
    setItems(
      Array.from({ length: 18 }).map((_, i) => ({
        id: `p_${i + 1}`,
        image: `https://picsum.photos/seed/refresh_${i + 1}/900/900`,
      }))
    );
    setPage(1);
    setRefreshing(false);
  }, []);

  const onEndReached = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    await new Promise((r) => setTimeout(r, 350));
    const next = page + 1;

    setItems((prev) => [
      ...prev,
      ...Array.from({ length: 12 }).map((_, i) => ({
        id: `p_${prev.length + i + 1}`,
        image: `https://picsum.photos/seed/more_${prev.length + i + 1}/900/900`,
      })),
    ]);
    setPage(next);
    setLoadingMore(false);
  }, [loadingMore, page]);

  const renderHeader = useCallback(
    () => (
      <View>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Text style={styles.username}>@{user.username}</Text>
          <MaterialIcons name="menu" size={22} />
        </View>

        {/* Profile row */}
        <View style={styles.profileRow}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.statsRow}>
            <Stat num={user.stats.posts} label="Posts" />
            <Stat num={user.stats.followers} label="Followers" />
            <Stat num={user.stats.following} label="Following" />
          </View>
        </View>

        {/* Bio */}
        <View style={styles.bioBlock}>
          <Text style={styles.name}>{user.name}</Text>
          {!!user.bio && <Text style={styles.bioText}>{user.bio}</Text>}
          {/* If you add user.link later, this will show it */}
          {/* {!!user.link && <Text style={styles.linkText}>{user.link}</Text>} */}
        </View>

        {/* Buttons */}
        <View style={styles.buttonsRow}>
          <Button text="Edit Profile" />
          <Button text="Share Profile" />
          <View style={styles.buttonIcon}>
            <MaterialIcons name="person-add-alt-1" size={18} />
          </View>
        </View>
      </View>
    ),
    [user]
  );

  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          /* TODO: open post detail */
        }}
      >
        <Image source={{ uri: item.image }} style={styles.gridImg} />
      </TouchableOpacity>
    ),
    []
  );

  const keyExtractor = useCallback((it: Item) => it.id, []);

  // Extra spacing between columns
  const columnWrapperStyle = useMemo(() => ({ gap: GAP }), []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        data={items}
        keyExtractor={keyExtractor}
        numColumns={COLS}
        columnWrapperStyle={columnWrapperStyle}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReachedThreshold={0.35}
        onEndReached={onEndReached}
        showsVerticalScrollIndicator={false}
        initialNumToRender={18}
        removeClippedSubviews
      />
    </SafeAreaView>
  );
}

function Stat({ num, label }: { num: number; label: string }) {
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontWeight: "700", fontSize: 18 }}>{formatNum(num)}</Text>
      <Text style={{ color: "#666" }}>{label}</Text>
    </View>
  );
}

function Button({ text }: { text: string }) {
  return (
    <View style={styles.btn}>
      <Text style={styles.btnText}>{text}</Text>
    </View>
  );
}

function formatNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1) + "k";
  return String(n);
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
    justifyContent: "space-between",
  },
  username: { fontWeight: "700", fontSize: 18 },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 16,
  },
  avatar: { width: 86, height: 86, borderRadius: 43, backgroundColor: "#eee" },
  statsRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  bioBlock: { paddingHorizontal: 12 },
  name: { fontWeight: "700", marginBottom: 2 },
  bioText: { color: "#222", marginBottom: 2 },
  linkText: { color: "#0a84ff", marginBottom: 8 },
  buttonsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    marginTop: 6,
    alignItems: "center",
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
  },
  btnText: { fontWeight: "600" },
  buttonIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  gridImg: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    marginBottom: GAP,
    backgroundColor: "#eee",
  },
});