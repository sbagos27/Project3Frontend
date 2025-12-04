// app/(tabs)/account.tsx
// app/(tabs)/account.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  Modal,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import PostCard from '@/components/post-card';
import { getJwt, getSelectedCatId } from '@/utils/auth';

type Item = { id: string; image: string };

const COLS = 3;
const GAP = 3;
const SCREEN_W = Dimensions.get('window').width;
const IMG_SIZE = Math.floor((SCREEN_W - GAP * (COLS - 1)) / COLS);

export default function ProfileScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [selectedCatId, setSelectedCatIdState] = useState<number | null>(null);
  const [catLoading, setCatLoading] = useState(true);

  const [items, setItems] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Item | null>(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    const loadToken = async () => {
      try {
        setAuthLoading(true);
        setAuthError(null);
        const t = await getJwt();
        if (!t) {
          setAuthError('You must sign in first.');
        } else {
          setToken(t);
        }
      } catch (err) {
        console.error('Failed to load auth token:', err);
        setAuthError('Failed to load auth token.');
      } finally {
        setAuthLoading(false);
      }
    };

    loadToken();
  }, []);

  // 🔹 Load selected cat ID from storage once we know the user is signed in
  useEffect(() => {
    if (!token) return;

    const loadSelectedCat = async () => {
      try {
        setCatLoading(true);
        const id = await getSelectedCatId();
        setSelectedCatIdState(id);
      } catch (err) {
        console.error('Failed to load selected cat:', err);
      } finally {
        setCatLoading(false);
      }
    };

    loadSelectedCat();
  }, [token]);

  // This will change to pull from user database/api in the future.
  const user = {
    username: 'aUser',
    name: 'John Cena',
    avatar:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTEhIVFhUVFRUXFxUYFhcXFRUVFxUXFhgWFRUYHSggGBolHRYXITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0mHSYtLS8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/...', // shortened
    bio: 'I love cats LOL',
    stats: { posts: 67, followers: 67, following: 67 },
  } as const;

  // Initial load of grid images (dummy data for now)
  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;
    setItems(
      Array.from({ length: 18 }).map((_, i) => ({
        id: `p_${i + 1}`,
        image:
          'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxASEhUSExMVFhUXFhcXGRcXFxoXFRgXFRUWFhUYGhkYHSggGholHRYYIjEhJSkrLi4uFx8zODUtNygtLisBCgoKDg0OGxAQGy0mHyUtLTUtLS8vLzUrMC0tLS0tNS0tKy0tKy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAL4BCQMBIgACEQEDEQH/...',
      })),
    );
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 350));
    setItems(
      Array.from({ length: 18 }).map((_, i) => ({
        id: `p_${i + 1}`,
        image:
          'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxASEhUSExMVFhUXFhcXGRcXFxoXFRgXFRUWFhUYGhkYHSggGholHRYYIjEhJSkrLi4uFx8zODUtNygtLisBCgoKDg0OGxAQGy0mHyUtLTUtLS8vLzUrMC0tLS0tNS0tKy0tKy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAL4BCQMBIgACEQEDEQH/...',
      })),
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
        image:
          'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxASEhUSExMVFhUXFhcXGRcXFxoXFRgXFRUWFhUYGhkYHSggGholHRYYIjEhJSkrLi4uFx8zODUtNygtLisBCgoKDg0OGxAQGy0mHyUtLTUtLS8vLzUrMC0tLS0tNS0tKy0tKy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAL4BCQMBIgACEQEDEQH/...',
      })),
    ]);
    setPage(next);
    setLoadingMore(false);
  }, [loadingMore, page]);

  const renderHeader = useCallback(
    () => (
      <View>
        {/* Active cat bar */}
        <View style={styles.catBar}>
          <Text style={styles.catBarText}>
            Active cat:{' '}
            {selectedCatId != null ? `#${selectedCatId}` : 'none selected'}
          </Text>
          <TouchableOpacity
            style={styles.changeCatButton}
            onPress={() => router.push('/selectCat')}
          >
            <Text style={styles.changeCatButtonText}>
              {selectedCatId ? 'Change' : 'Choose cat'}
            </Text>
          </TouchableOpacity>
        </View>

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
        </View>

        {/* Buttons */}
        <View style={styles.buttonsRow}>
          <Button text="Edit Profile" />
          <Button text="Share Profile" />
        </View>
      </View>
    ),
    [user, selectedCatId],
  );

  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item }) => (
      <TouchableOpacity activeOpacity={0.85} onPress={() => setSelected(item)}>
        <Image source={{ uri: item.image }} style={styles.gridImg} />
      </TouchableOpacity>
    ),
    [],
  );

  const keyExtractor = useCallback((it: Item) => it.id, []);
  const columnWrapperStyle = useMemo(() => ({ gap: GAP }), []);

  // 🔐 Auth + cat gating
  if (authLoading || catLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading your profile…</Text>
      </SafeAreaView>
    );
  }

  if (authError || !token) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>{authError ?? 'You must sign in first.'}</Text>
      </SafeAreaView>
    );
  }

  // Signed in but no cat yet: go to selectCat screen
  if (!selectedCatId) {
    router.replace('/selectCat');
    return null;
  }

  // 🔓 Logged-in + cat selected
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        data={items}
        keyExtractor={keyExtractor}
        numColumns={COLS}
        columnWrapperStyle={columnWrapperStyle}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReachedThreshold={0.35}
        onEndReached={onEndReached}
        showsVerticalScrollIndicator={false}
        initialNumToRender={18}
        removeClippedSubviews
      />
      <Modal
        visible={!!selected}
        animationType="slide"
        transparent
        onRequestClose={() => setSelected(null)}
        statusBarTranslucent
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdrop}
          onPress={() => setSelected(null)}
        />

        <SafeAreaView style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelected(null)}
            >
              <MaterialIcons name="close" size={22} />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            {selected && (
              <PostCard
                id="1"
                image="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..." // shortened
                creator="Shane Dawson"
              />
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function Stat({ num, label }: { num: number; label: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontWeight: '700', fontSize: 18 }}>{formatNum(num)}</Text>
      <Text style={{ color: '#666' }}>{label}</Text>
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
  if (n >= 1_000_000)
    return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1) + 'k';
  return String(n);
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  catBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
    justifyContent: 'space-between',
  },
  catBarText: {
    fontSize: 14,
    color: '#555',
  },
  changeCatButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#f2f2f2',
  },
  changeCatButtonText: {
    fontWeight: '600',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
    justifyContent: 'space-between',
  },
  username: {
    fontWeight: '700',
    fontSize: 18,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 16,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#eee',
  },
  statsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bioBlock: {
    paddingHorizontal: 12,
  },
  name: {
    fontWeight: '700',
    marginBottom: 2,
  },
  bioText: {
    color: '#222',
    marginBottom: 2,
  },
  linkText: {
    color: '#0a84ff',
    marginBottom: 8,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    marginTop: 6,
    alignItems: 'center',
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    marginBottom: 20,
  },
  btnText: {
    fontWeight: '600',
  },
  buttonIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridImg: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    marginBottom: GAP,
    backgroundColor: '#eee',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgb(0,0,0,0.35)',
  },
  modalCard: {
    flex: 1,
    marginTop: '18%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    alignItems: 'flex-end',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
