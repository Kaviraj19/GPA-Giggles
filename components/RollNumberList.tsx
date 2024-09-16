import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Modal, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure this is installed

interface RollNumberListProps {
  rollNumbers: string[];
  onSelectRollNumber: (rollNumber: string) => void;
  onDeleteRollNumber: (rollNumber: string) => void;
}

const RollNumberList: React.FC<RollNumberListProps> = ({ rollNumbers, onSelectRollNumber, onDeleteRollNumber }) => {
  const [selectedRollNumber, setSelectedRollNumber] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleDeletePress = (rollNumber: string) => {
    setSelectedRollNumber(rollNumber);
    setModalVisible(true); // Show the modal
  };

  const confirmDeletion = () => {
    if (selectedRollNumber) {
      onDeleteRollNumber(selectedRollNumber); // Call the delete function
    }
    setModalVisible(false); // Close the modal
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require('../assets/no_data_found.png')} // Update the path as needed
        style={styles.emptyImage}
      />
      <Text style={styles.emptyText}>No Roll Numbers Found</Text>
    </View>
  );

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.rollNumberContainer}>
      <TouchableOpacity style={styles.rollNumberTextContainer} onPress={() => onSelectRollNumber(item)}>
        <Text style={styles.rollNumberText}>{item}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeletePress(item)}>
        <Icon name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.TContainer}>
      <Text style={styles.title}>Select Roll Number:</Text>
      </View>
      <Image
        source={require('../assets/people.png')} // Ensure the image is in your assets folder
        style={styles.boy}
      />
      <View style={styles.rContainer}>
      <FlatList
        data={rollNumbers}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyComponent}
      />
      </View>

      {/* Custom Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete Roll Number: <Text style={styles.highlightText}>{selectedRollNumber}</Text>?
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmDeletion}>
                <Text style={styles.confirmButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rollNumberContainer: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#48CFCB',
    backgroundColor: '#424242',
  },
  rContainer:{
    padding:10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#48CFCB'
  },
  TContainer:{
    alignContent:'center',
    paddingHorizontal: 15,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#424242',
    backgroundColor: '#424242',

  },
  boy: {
    position: 'absolute',
    bottom:10,
    right: 10,
    width: Dimensions.get('window').width - 40,
    height: 400,
    resizeMode: 'contain',
    elevation: 4,
  },
  title: {
    fontSize: 24,
    padding:20,
    color: '#48CFCB',
    backgroundColor:"#424242",
  },
  rollNumberTextContainer: {
    flex: 1,
  },
  rollNumberText: {
    fontSize: 16,
    color: '#48CFCB',
  },
  listContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#424242',
    backgroundColor: '#424242',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#48CFCB',
    textAlign: 'center',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#424242', // Grey background for the modal
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#48CFCB', // Teal text color
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#48CFCB', // Teal text color
    textAlign: 'center',
    marginBottom: 20,
  },
  highlightText: {
    color: '#48CFCB', // Teal color for highlighting roll number
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#333', // Dark grey background for cancel button
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#48CFCB', // Teal color for cancel button text
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#48CFCB', // Teal color for confirm button
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff', // White text color for confirm button
    fontSize: 16,
  },
});

export default RollNumberList;
