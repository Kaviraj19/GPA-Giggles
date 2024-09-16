import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

const HomeScreen = () => {
  const router = useRouter(); // Using useRouter for navigation

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image
        source={require('../assets/girl.png')}
        style={styles.girl}
      />
      
      {/* Title and Card */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
        <Text style={styles.headerText}>Welcome to GPA Tracker</Text>
          {/* Card content */}
        </View>
      </View>
      
      {/* Buttons */}
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/Getdept')} 
        >
          <Text style={styles.buttonText}>Calculate GPA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/Viewresults')} // Navigate to Viewresults screen
        >
          <Text style={styles.buttonText}>View CGPA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/About')} // Navigate to About screen
        >
          <Text style={styles.buttonText}>About</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#424242',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-start', // Position card container at the top
    width: '100%',
    paddingTop: 40, // Space from the top
  },
  card: {
    padding: 30,
    margin: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#48CFCB',
    backgroundColor: '#424242',
    shadowColor: '#48CFCB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '90%',
    alignSelf: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#48CFCB',
    textAlign: 'center',
  },
  btnContainer: {
    position: 'absolute',
    bottom: 0, // Stick buttons to the bottom
    width: '100%',
    alignItems: 'center',
    paddingBottom: 30, // Add some padding to the bottom
  },
  button: {
    borderWidth: 1,
    borderColor: '#48CFCB',
    backgroundColor: '#424242',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#48CFCB',
    fontWeight: 'bold',
  },
  girl: {
    position: 'absolute',
    top: '25%', // Center image vertically
    left: '15%',
    width: Dimensions.get('window').width - 40,
    height: '50%',
    resizeMode: 'contain',
  },
});

export default HomeScreen;
