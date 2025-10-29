import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { globalStyles } from '@/styles/globalStyle';

export default function SignInScreen() {
  const router = useRouter();

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Sign in to Whiskr</Text>

      {/* Replace with real auth later */}
      <Pressable
        onPress={() => router.replace('/home')}
        style={({ pressed }) => [
          globalStyles.button,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Text style={globalStyles.buttonText}>Continue</Text>
      </Pressable>

      <Text style={{ marginTop: 12, color: '#666' }}>
        You can still browse cats without signing in.
      </Text>
    </View>
  );
}



