import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, Button } from 'native-base';
import { useRouter } from 'expo-router'; // Import the useRouter hook

interface GpaResultsProps {
  cgpa: number | null;
}

const GpaResults: React.FC<GpaResultsProps> = ({ cgpa }) => {
  const router = useRouter(); // Initialize the router

  // Animated values for rotation and scale
  const rotateValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Create rotation and squeeze animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(rotateValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [rotateValue, scaleValue]);

  const goBackToHome = () => {
    router.push('/'); // Navigate to the Home page
  };

  // Rotate and scale interpolation
  const rotate = rotateValue.interpolate({
    inputRange: [0, 50],
    outputRange: ['0deg', '360deg'],
  });

  const scale = scaleValue.interpolate({
    inputRange: [1, 1.2],
    outputRange: [1, 2.0],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.result, { transform: [{ rotate }, { scale }] }]}>
        <Text fontSize={24} color="#48CFCB" mb={4}>
          Your GPA is:
        </Text>
        <Text fontSize={36} color="#48CFCB" mb={6}>
          {cgpa !== null ? cgpa.toFixed(2) : 'Not Calculated'}
        </Text>
        <Button onPress={goBackToHome} bg="#48CFCB">
          <Text color="white">Go Back to Home</Text>
        </Button>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#424242',
  },
  result: {
    width: 250,
    height: 250,
    borderRadius: 125, // Half of width/height to make it round
    borderWidth: 2,
    borderColor: '#48CFCB',
    backgroundColor: '#424242',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default GpaResults;
