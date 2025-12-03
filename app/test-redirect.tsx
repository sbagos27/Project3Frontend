import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

export default function TestRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/loginSuccess?token=eyJhbGciOiJIUzI1NiJ9.eyJwcm92aWRlciI6ImdpdGh1YiIsInVzZXJJZCI6NSwiZW1haWwiOiJrZWl0aC1ydXh0b25AZ2l0aHViLnVzZXIiLCJ1c2VybmFtZSI6ImtlaXRoLXJ1eHRvbiIsImlhdCI6MTc2NDcwODY4NywiZXhwIjoxNzY0Nzk1MDg3fQ.CtD12qlJ4nqYxxqUQ_FzcI43Oy_Zw5OlWZCchb9mjGs");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 12 }}>Simulating OAuth redirect…</Text>
    </View>
  );
}
