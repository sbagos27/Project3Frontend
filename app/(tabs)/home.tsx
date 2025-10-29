import { Image } from 'expo-image';
import { Platform} from 'react-native';
import Header from '@/components/Header';
import { StyleSheet, Text, View, Button } from 'react-native';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { globalStyles } from '@/styles/globalStyle';

export default function HomeScreen() {
  return (
    <>
      <Header />
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Home Screen, coming soon</Text>
      </View>
    </>
  );
}


