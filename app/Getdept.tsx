import React, { useState } from 'react';
import { View, StyleSheet, Image, Dimensions, Text } from 'react-native';
import { NativeBaseProvider, Button } from 'native-base';
import Deptinput from '@/components/Deptinput'; // Adjust path as needed
import { useRouter } from 'expo-router'; // Use useRouter from expo-router
import { useDept } from '../context/DeptContext'; // Adjust import path

const HomeScreenContent: React.FC = () => {
  const { rollNo, selectedDept, selectedSemester } = useDept(); // Accessing roll number, department, and semester
  const router = useRouter(); // Using the router for navigation

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleNavigation = () => {
    if (rollNo.trim() === '') {
      showAlert('Please provide your Roll Number.');
    } else if (!selectedDept) {
      showAlert('Please select a department.');
    } else if (!selectedSemester) {
      showAlert('Please select a semester.');
    } else {
      router.push('/Getcgpa'); // Proceed to the next page if all checks pass
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/boy.png')} // Ensure the image is in your assets folder
        style={styles.boy}
      />
      <View style={styles.card}>
        <Deptinput />
        <Button onPress={handleNavigation} colorScheme="teal" mt={4}>
          Get Courses
        </Button>
      </View>

      {alertVisible && (
        <View style={styles.alertContainer}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>Incomplete Input</Text>
            <Text style={styles.alertMessage}>{alertMessage}</Text>
            <Button
              onPress={() => setAlertVisible(false)}
              colorScheme="teal"
              style={styles.alertButton}
            >
              OK
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

const HomeScreen: React.FC = () => {
  return (
    <NativeBaseProvider>
      <HomeScreenContent />
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#424242',
    paddingTop: 90,
  },
  card: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#48CFCB',
    backgroundColor: '#424242',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '90%',
    alignSelf: 'center',
  },
  boy: {
    position: 'absolute',
    bottom: 10,
    right: 40,
    width: Dimensions.get('window').width - 40,
    height: 300,
    resizeMode: 'contain',
    elevation: 4,
  },
  alertContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  alertBox: {
    backgroundColor: '#424242', // Grey background for the alert
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 18,
    color: '#48CFCB',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    color: '#48CFCB',
    marginBottom: 20,
    textAlign: 'center',
  },
  alertButton: {
    backgroundColor: '#48CFCB', // Teal color for the OK button
    width: '100%',
  },
});

export default HomeScreen;
