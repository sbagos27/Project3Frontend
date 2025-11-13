// app/signIn.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Header from '@/components/signInHeader';
import { globalStyles } from '@/styles/globalStyle';
import { initDB, FindUserByUsername } from '@/scripts/database';

type User = { id: number; username: string; password: string } | null;

export default function SignInScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initDB().catch((e) => setError(e?.message ?? 'Failed to initialize database'));
  }, []);

  const handleSignIn = async () => {
    setError(null);
    const u = username.trim();
    const p = password;
    if (!u || !p) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    try {
      const user = (await FindUserByUsername(u)) as User;
      if (!user || user.password !== p) {
        setError('Invalid username or password.');
        return;
      }
      router.replace('/selectCat');
    } catch (err: any) {
      setError(err?.message ?? 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push('/');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />

      <KeyboardAvoidingView
        style={globalStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={globalStyles.title}>Sign in to Whiskr</Text>

        <View style={{ width: '100%', gap: 12 }}>
          <TextInput
            style={globalStyles.searchInput}
            placeholder="Username"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={globalStyles.searchInput}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {error && <Text style={globalStyles.subtitle}>{error}</Text>}

        <Pressable
          onPress={handleSignIn}
          disabled={loading}
          style={({ pressed }) => [
            globalStyles.button,
            { opacity: pressed || loading ? 0.7 : 1 },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={globalStyles.buttonText}>Sign in</Text>
          )}
        </Pressable>

        <Pressable
          onPress={handleSignUp}
          style={({ pressed }) => [
            globalStyles.button,
            { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', opacity: pressed ? 0.7 : 1, marginTop: 12 },
          ]}
        >
          <Text style={[globalStyles.buttonText, { color: '#000' }]}>
            Create an account
          </Text>
        </Pressable>

        <Text style={globalStyles.text}>You can still browse cats without signing in.</Text>
      </KeyboardAvoidingView>
    </>
  );
}



