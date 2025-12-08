import Header from '@/components/activityHeader';
import ChatInterface from '@/components/ChatInterface';
import { getAllUsers, User } from '@/utils/api';
import { getUserId } from '@/utils/auth';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const WS_URL = 'https://group5project3-74e9cad2d6ba.herokuapp.com/ws';

export default function MessagesScreen() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const id = await getUserId();
      setCurrentUserId(id);

      if (id) {
        const allUsers = await getAllUsers();
        console.log('Fetched users:', allUsers);
        // Filter out self
        setUsers(allUsers.filter(u => u.id !== id));
      }
    } catch (error) {
      console.error("Error loading messages data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => setSelectedUser(item)}
    >
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>
          {(item.username || 'U').charAt(0).toUpperCase()}
        </Text>
      </View>
      <View>
        <Text style={styles.userName}>{item.username || `User ${item.id}`}</Text>
        {item.email && <Text style={styles.userEmail}>{item.email}</Text>}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!currentUserId) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <Header />
        <View style={styles.center}>
          <Text style={styles.messageText}>Please sign in to view messages.</Text>
          <TouchableOpacity style={styles.signInButton} onPress={() => router.push('/signIn')}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  if (selectedUser) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <Header />
        <View style={styles.chatContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedUser(null)}
          >
            <Text style={styles.backButtonText}>← Back to Users</Text>
          </TouchableOpacity>
          <ChatInterface
            userId={currentUserId}
            recipientId={selectedUser.id}
            recipientName={selectedUser.username}
            wsUrl={WS_URL}
          />
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <View style={styles.container}>
        <Text style={styles.title}>Messages</Text>
        <FlatList
          data={users}
          keyExtractor={(item, index) => item.id ? item.id.toString() : `user-${index}`}
          renderItem={renderUserItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No other users found.</Text>}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    padding: 20,
    color: '#333'
  },
  listContent: {
    paddingHorizontal: 20
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555'
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  userEmail: {
    fontSize: 14,
    color: '#888',
    marginTop: 2
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
    fontSize: 16
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  backButton: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500'
  },
  messageText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center'
  },
  signInButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});
