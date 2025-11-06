import React, { useCallback, useState } from "react";
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
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const COLS = 3;
const GAP = 1;
const SCREEN_W = Dimensions.get("window").width;
const IMG_SIZE = Math.floor((SCREEN_W - GAP * (COLS - 1)) / COLS);

export default function ProfileScreen(){
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  //This will change to pull from user database/api in the future.
  const user = {
    username: "aUser",
    name: "John Cena",
    avatar: "data:image/jpeg;base64,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",
    bio: "I love cats LOL",
    stats: {posts: 3, followers: 123, following: 123},
  };

  const onRefresh = useCallback(async() => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 350));
    setItems(
      Array.from({length: 18}).map((_, i) => ({
        id: `p_${i + 1}`,
        image:`https://picsum.photos/seed/refresh_${i + 1}/900/900`,
      }))
    );
    setPage(1);
    setRefreshing(false);
  }, []);

  const onEndReached = useCallback(async () => {
    if(loadingMore) return;
    setLoadingMore(true);
    await new Promise((r) => setTimeout(r, 350));
    const next = page + 1;
    setItems((prev) => [
      ...prev,
      ...Array.from({length: 12}).map((_, i) => ({
        id: `p_${prev.length + i + 1}`,
        image: `https://picsum.photos/seed/more_${prev.length + i + 1}/900/900`,
      })),
    ]);
    setPage(next);
    setLoadingMore(false);
  }, [loadingMore, page]);

    const renderHeader = () => (
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

      
      <View style={styles.bioBlock}>
        <Text style={styles.name}>{user.name}</Text>
        {!!user.bio && <Text style={styles.bioText}>{user.bio}</Text>}
        {!!user.link && <Text style={styles.linkText}>{user.link}</Text>}
      </View>

      
      <View style={styles.buttonsRow}>
        <Button text="Edit Profile" />
        <Button text="Share Profile" />
        <View style={styles.buttonIcon}>
          <MaterialIcons name="person-add-alt-1" size={18} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={COLS}
        columnWrapperStyle={{ gap: GAP }}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.85} onPress={() => { /* open post detail */ }}>
            <Image source={{ uri: item.image }} style={styles.gridImg} />
          </TouchableOpacity>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReachedThreshold={0.35}
        onEndReached={onEndReached}
        showsVerticalScrollIndicator={false}
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


