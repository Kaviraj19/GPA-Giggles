import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon component

const RollNumberDetails: React.FC<RollNumberDetailsProps> = ({ rollNumber }) => {
  const [data, setData] = useState<StoredData | null>(null);
  const [loading, setLoading] = useState(true); // Loading state to manage data fetching
  const [hasData, setHasData] = useState(false); // State to check if data exists

  useEffect(() => {
    const fetchData = async () => {
      try {
        const key = `cgpa_data_${rollNumber}`;
        const storedData = await AsyncStorage.getItem(key);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setData(parsedData);
          setHasData(true); // Set to true if data is found
        } else {
          setHasData(false); // No data found
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false); // Always end loading state after data is fetched
      }
    };

    fetchData();
  }, [rollNumber]);

  const handleDeleteSemester = async (department: string, semester: string) => {
    try {
      const updatedData = { ...data };
      if (updatedData[department]) {
        const { [semester]: removedSemester, ...rest } = updatedData[department];
        updatedData[department] = rest;

        // Update the state
        setData(updatedData);

        // Update AsyncStorage
        await AsyncStorage.setItem(`cgpa_data_${rollNumber}`, JSON.stringify(updatedData));

        Alert.alert('Success', 'Semester deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete semester:', error);
      Alert.alert('Error', 'Failed to delete semester');
    }
  };

  const renderCourse = ({ item }: { item: Course }) => (
    <View key={item['Course Code']} style={styles.courseContainer}>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Course Name: {item['Course Name']}</Text>
        <Text style={styles.detailText}>Course Code: {item['Course Code']}</Text>
        <Text style={styles.detailText}>Credit: {item.Credit}</Text>
      </View>
      <Text style={[styles.gradeText, item.Grade === 'F' && styles.gradeFail,item.Grade === 'S' && styles.gradeS]}>
        {item.Grade}
      </Text>
    </View>
  );

  const renderSemester = ({ item }: { item: { semester: string; data: SemesterData; department: string } }) => {
    const { courses, cgpa } = item.data;

    if (courses && courses.length > 0) {
      return (
        <View style={styles.semesterCard}>
          <View style={styles.deleteIconContainer}>
            <TouchableOpacity
              onPress={() => handleDeleteSemester(item.department, item.semester)}
            >
              <Icon name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
          <View style={styles.semesterContent}>
            <Text style={styles.semesterTitle}>Semester: {item.semester}</Text>
            <View style={styles.cgpaConatiner}>
              <Text style={styles.cgpaText}>CGPA:</Text>
              <Text style={styles.cgpaGrade}> {cgpa !== undefined ? cgpa.toFixed(2) : 'N/A'}</Text>
            </View>
            <FlatList
              data={courses}
              keyExtractor={(course) => course['Course Code']}
              renderItem={renderCourse}
            />
          </View>
        </View>
      );
    }
    return null; // Render nothing if no valid courses
  };

  const renderDepartment = ({ item }: { item: { department: string; data: any } }) => {
    const semesters = Object.keys(item.data).map(semester => ({
      semester,
      data: item.data[semester],
      department: item.department,
    }));
  
    return (
      <View style={styles.departmentContainer}>
        <FlatList
          data={semesters}
          keyExtractor={(semesterItem) => semesterItem.semester}
          renderItem={renderSemester}
        />
      </View>
    );
  };

  const aggregateCGPABySemester = (storedData: StoredData) => {
    const semesterCGPA: { [semester: string]: number[] } = {};

    // Collect CGPA data for each semester
    Object.values(storedData).forEach(department => {
      Object.entries(department).forEach(([semester, data]) => {
        if (!semesterCGPA[semester]) {
          semesterCGPA[semester] = [];
        }
        semesterCGPA[semester].push(data.cgpa);
      });
    });

    // Calculate average CGPA for each semester
    const averageCGPA: { [semester: string]: number } = {};
    Object.keys(semesterCGPA).forEach(semester => {
      const cgpas = semesterCGPA[semester];
      const totalCGPA = cgpas.reduce((sum, cgpa) => sum + cgpa, 0);
      averageCGPA[semester] = totalCGPA / cgpas.length;
    });

    return averageCGPA;
  };

  const calculateOverallAverageCGPA = (averageCGPABySemester: { [semester: string]: number }) => {
    const totalCGPA = Object.values(averageCGPABySemester).reduce((sum, cgpa) => sum + cgpa, 0);
    return totalCGPA / Object.values(averageCGPABySemester).length;
  };

  const filteredDepartments = data 
    ? Object.keys(data)
        .map(department => ({
          department,
          data: data[department],
        }))
        .filter(department => {
          const hasValidSemesters = Object.keys(department.data).some(semester => {
            const semesterData = department.data[semester];
            return semesterData.courses && semesterData.courses.length > 0;
          });

          return hasValidSemesters;
        })
    : [];

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#48CFCB" />
      </View>
    );
  }

  if (!hasData || filteredDepartments.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No department data available.</Text>
        <Image
          source={require('../assets/no_data_found.png')} // Ensure this path is correct
          style={styles.noDataImage}
        />
      </View>
    );
  }

  const averageCGPABySemester = aggregateCGPABySemester(data);
  const overallAverageCGPA = calculateOverallAverageCGPA(averageCGPABySemester);

  const chartData = {
    labels: Object.keys(averageCGPABySemester),
    datasets: [
      {
        data: Object.values(averageCGPABySemester),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.graphContainer}>
        <Text style={styles.averageCGPAText}>
          Overall Average CGPA: {overallAverageCGPA.toFixed(2)}
        </Text>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#48CFCB',
            backgroundGradientFrom: '#229799',
            backgroundGradientTo: '#48CFCB',
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            strokeWidth: 2,
            barPercentage: 0.5,
          }}
          style={styles.chart}
        />
      </View>
      <FlatList
        data={filteredDepartments}
        keyExtractor={(departmentItem) => departmentItem.department}
        renderItem={renderDepartment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    backgroundColor: 'transparent',
  },
  graphContainer: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#48CFCB',
    backgroundColor: '#424242',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    justifyContents: "center",
    alignItems: 'center',
  },
  averageCGPAText: {

   color:"#48CFCB",
  },
  departmentContainer: {
    paddingTop: 10,
    marginBottom: 20,
  },
  departmentTitle: {
    color:"#229799",
    fontSize: 18,
    marginBottom: 10,
  },
  semesterCard: {
    alignSelf: 'center',
    padding: 15,
    width:"90%",
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#48CFCB', // Light grey border
    backgroundColor: '#424242', // White background
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 4, // Shadow radius
    elevation: 2, // For Android shadow
    position: 'relative',
  },
  deleteIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1, // Ensure the icon is above other content
  },
  semesterContent: {
    marginTop: 10, // Adjust margin to ensure content is below the delete icon
  },
  semesterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color:"#48CFCB"

  },
  courseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#48CFCB',
  },
  detailsContainer: {
    flex: 1,
   
  },
  detailText: {
    fontSize: 16,
    color: '#48CFCB',
    marginBottom: 2,
  },
  cgpaConatiner
:{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  gradeText: {
    fontSize: 16,
    paddingBottom:20,
    color: '#F5F5F5',
  },
  cgpaText: {
    fontSize: 16,
    color: '#48CFCB',
  },
  cgpaGrade: {
    fontSize: 16,
    color: '#F5F5F5',
  },
  gradeFail: {
    color: 'red',
  },
  gradeS:{
    color: "#EBF400",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});


export default RollNumberDetails;
