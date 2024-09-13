// SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const SplashScreen: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/'); // Navigate to HomeScreen
    }, 3000); // Adjust time as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.splashText}>Welcome to GPA Giggles!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#424242', // Match splash background color with app
  },
  splashText: {
    fontSize: 24,
    color: '#48CFCB', // Ensure this color contrasts well with the background
    fontWeight: 'bold',
  },
});

export default SplashScreen;
