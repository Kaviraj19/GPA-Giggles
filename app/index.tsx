import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

const HomeScreen = () => {
  const router = useRouter(); // Using useRouter for navigation

  return (
    <View style={styles.container}>
      <View style={styles.card}>
      <View style={styles.headercontainer}>
        <Text style={styles.headerText}>Welcome to GPA Tracker</Text>
        </View>
        <View style={styles.btncontainer}>
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
          onPress={() => router.push('/About')} // Navigate to Viewresults screen
        >
          <Text style={styles.buttonText}>About</Text>
        </TouchableOpacity>
      </View>
      </View>
      
      <Image
        source={require('../assets/girl.png')}
        style={styles.girl}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#424242',
    paddingTop: 140,
  },
  card: {
    padding: 30,
    margin:10,
    paddingBottom:150,
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
  headercontainer:{
    alignSelf: 'center',
    width:"100%"
  },
  btncontainer:{
    alignSelf: 'flex-end',
    width:"60%"
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#48CFCB',
    textAlign: 'center',
  },
  button: {
    borderWidth: 1,
    borderColor: '#48CFCB',
    backgroundColor: '#424242',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20, // Add space between buttons
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#48CFCB',
    fontWeight: 'bold',
  },
  girl: {
    position: 'absolute', // Position the image absolutely
    bottom: -10, // Position at the bottom
    left: 5, // Align to the right
    width: Dimensions.get('window').width - 40, // Adjust width as needed
    height: 450, // Adjust height as needed
    resizeMode: 'contain', // Ensure the image scales correctly
    elevation: 4, // Add elevation for Android shadow effect
  },
});

export default HomeScreen;
