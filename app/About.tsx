import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

const About = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to GPA GIGGLES !</Text>
        <Text style={styles.description}>
        {'\t\t\t\t\t\t\t\t'}Track your CGPA throughout the semesters and calculate your GPA for each term effortlessly. {'\n\n'}
           If you encounter any errors or issues, please reach out to us at:
        </Text>
          <Text style={styles.email}>gpagiggles19@gmail.com</Text>
          <Text style={styles.description}>
          {'\n'}Your feedback is valuable to us, and we’re here to help!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#424242',
  },
  card: {
    width: '100%',
    padding: 20,
    paddingVertical:100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0fffff',
    backgroundColor: '#424242',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#0fffff',
  },
  description: {
    fontSize: 20,
    marginBottom: 20,
    color: '#48CFCB',
  },
  email:{
    color: '#0fffff',
    fontSize: 19,
  }
});

export default About;
