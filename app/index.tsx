import { Link } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';

const HomeScreen = () => {
  // Menu items data
  const menuItems = [
    { title: 'Calculate GPA', link: '/Getdept' },
    { title: 'View CGPA', link: '/Viewresults' },
  ];

  // Render each item in the FlatList
  const renderItem = ({ item }: { item: { title: string; link: string } }) => (
    <TouchableOpacity style={styles.menuItem}>
      <Link href={item.link}>
        <Text style={styles.menuText}>{item.title}</Text>
      </Link>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headerText}>Welcome to GPA Tracker</Text>
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.title}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      </View>
      <Image
        source={require('../assets/girl.png')} // Ensure the image is in your assets folder
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
    padding: 20,
    margin: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#48CFCB', // Light grey border
    backgroundColor: '#424242', // Card background color
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 4, // Shadow radius
    elevation: 2,
    width: '90%', // Adjusted for proper spacing
    alignSelf: 'center', // Center card horizontally
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#48CFCB',
    textAlign: 'center', // Center text
  },
  listContainer: {
    alignItems: 'center',
    paddingBottom: 200,
  },
  menuItem: {
    backgroundColor: '#229799',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%', // Full width of the container
    alignItems: 'center',
  },
  menuText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  girl: {
    position: 'absolute', // Position the image absolutely
    top:410, // Position at the bottom
    right: 40, // Align to the right
    width: Dimensions.get('window').width - 40, // Adjust width as needed
    height: 500, // Adjust height as needed
    resizeMode: 'contain', // Ensure the image scales correctly
     // Ensure the image appears on top of other elements
    elevation: 4, // Add elevation for Android shadow effect
  },
});

export default HomeScreen;
