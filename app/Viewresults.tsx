import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import RollNumberList from '../components/RollNumberList';
import RollNumberDetails from '../components/RollNumberDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewResults: React.FC = () => {
  const [rollNumbers, setRollNumbers] = useState<string[]>([]);
  const [selectedRollNumber, setSelectedRollNumber] = useState<string | null>(null);
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const fetchRollNumbers = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const rollNumberKeys = keys.filter(key => key.startsWith('cgpa_data_'));
        const rollNumbers = rollNumberKeys.map(key => key.replace('cgpa_data_', ''));
        setRollNumbers(rollNumbers);
      } catch (error) {
        console.error('Failed to fetch roll numbers:', error);
      }
    };

    fetchRollNumbers();
  }, []);

  // Conditionally hide the header when a roll number is selected
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: !selectedRollNumber,
    });
  }, [selectedRollNumber, navigation]);

  // Function to remove a roll number from AsyncStorage and update the state
  const removeRollNumber = async (rollNumber: string) => {
    try {
      await AsyncStorage.removeItem(`cgpa_data_${rollNumber}`);
      setRollNumbers((prevRollNumbers) =>
        prevRollNumbers.filter((rn) => rn !== rollNumber)
      );
      setSelectedRollNumber(null); // Go back to the roll number list
    } catch (error) {
      console.error('Failed to remove roll number:', error);
    }
  };

  // Handle when there is no semester data for the selected roll number
  const handleNoSemesterData = (rollNumber: string) => {
    Alert.alert(
      "No Data",
      `No semester data found for Roll Number: ${rollNumber}`,
      [
        {
          text: "OK",
          onPress: () => {
            removeRollNumber(rollNumber);
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      {selectedRollNumber ? (
        <View style={styles.detailsContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedRollNumber(null)}>
            <Text style={styles.backButtonText}>Back to Roll Numbers</Text>
          </TouchableOpacity>
          <RollNumberDetails rollNumber={selectedRollNumber} onNoSemesterData={handleNoSemesterData} />
        </View>
      ) : (
        <View style={styles.listContainer}>
          <RollNumberList
            rollNumbers={rollNumbers}
            onSelectRollNumber={setSelectedRollNumber}
            onDeleteRollNumber={removeRollNumber} // Pass delete handler here
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#424242',
  },
 
  backButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop:5,
    marginBottom: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default ViewResults;
