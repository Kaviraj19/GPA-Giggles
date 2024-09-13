import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ScrollView, LogBox } from 'react-native';
import { Text, Box, VStack, HStack, Button } from 'native-base';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDept } from '../context/DeptContext'; // Adjust import path
import data from '../data/all_dept.json'; // Adjust the path based on where you place your JSON file
import additionalData from '../data/hm_oec_data.json'; // Load additional H&M and OEC courses

interface Course {
  'Course Code': string;
  'Course Name': string;
  Credit: number;
}

interface Semester {
  semester: number;
  courses: Course[];
}

interface Department {
  dept: string;
  SEMS: Semester[];
}

const grades = ['S', 'A', 'B', 'C', 'D', 'E', 'F'];

const Getcgpa: React.FC = () => {
  const { selectedDept, selectedSemester, rollNo, oec, hm } = useDept(); // Ensure rollNo and H&M/OEC are available
  const [courses, setCourses] = useState<Course[]>([]);
  const [gradeSelections, setGradeSelections] = useState<{ [key: string]: string }>({});
  const [cgpa, setCgpa] = useState<number | null>(null);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']); // Ignore potential warnings

    if (selectedDept && selectedSemester !== null && rollNo) {
      const deptData = data.find((dept: Department) => dept.dept === selectedDept);
      if (deptData) {
        const semesterData = deptData.SEMS.find(sem => sem.semester === parseInt(selectedSemester));
        if (semesterData) {
          const mainCourses = semesterData.courses;
          const hmOecCourses = getHmOecCourses(); // Get additional H&M and OEC courses
          const allCourses = [...mainCourses, ...hmOecCourses]; // Combine main and additional courses

          setCourses(allCourses);

          const initialGradeSelections = allCourses.reduce((acc, course) => {
            acc[course['Course Code']] = '';
            return acc;
          }, {} as { [key: string]: string });

          setGradeSelections(initialGradeSelections);
        }
      }
    }
  }, [selectedDept, selectedSemester, rollNo, oec, hm]);

  // Function to retrieve selected H&M and OEC courses
  const getHmOecCourses = (): Course[] => {
    let additionalCourses: Course[] = [];

    if (oec) {
      const oecCourses = additionalData.find(item => item.type === 'OEC')?.courses || [];
      additionalCourses = additionalCourses.concat(oecCourses);
    }

    if (hm) {
      const hmCourses = additionalData.find(item => item.type === 'H&M')?.courses || [];
      additionalCourses = additionalCourses.concat(hmCourses);
    }

    return additionalCourses;
  };

  const handleGradeChange = (courseCode: string, grade: string) => {
    setGradeSelections(prev => ({ ...prev, [courseCode]: grade }));
  };

  const calculateCGPA = async () => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    courses.forEach(course => {
      const grade = gradeSelections[course['Course Code']];
      if (grade) {
        const gradePoint = getGradePoint(grade);
        totalCredits += course.Credit;
        totalGradePoints += gradePoint * course.Credit;
      }
    });

    const cgpaValue = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    setCgpa(cgpaValue);

    // Save data to AsyncStorage
    await saveData({
      rollNo,
      department: selectedDept,
      semester: selectedSemester,
      courses: courses.map(course => ({
        'Course Code': course['Course Code'],
        'Course Name': course['Course Name'],
        Credit: course.Credit,
        Grade: gradeSelections[course['Course Code']],
      })),
      cgpa: cgpaValue,
    });
  };

  const saveData = async (data: any) => {
    try {
      const key = `cgpa_data_${data.rollNo}`;
      let existingData = await AsyncStorage.getItem(key);
      existingData = existingData ? JSON.parse(existingData) : {};

      if (!existingData.semesters) {
        existingData.semesters = {};
      }

      if (!existingData.semesters[data.semester]) {
        existingData.semesters[data.semester] = {};
      }

      existingData.semesters[data.semester] = {
        courses: data.courses,
        cgpa: data.cgpa,
      };

      await AsyncStorage.setItem(key, JSON.stringify(existingData));
      console.log('Data saved successfully');
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  const getGradePoint = (grade: string): number => {
    switch (grade) {
      case 'S': return 10.0;
      case 'A': return 9.0;
      case 'B': return 8.0;
      case 'C': return 7.0;
      case 'D': return 6.0;
      case 'E': return 5.0;
      case 'F': return 0.0;
      default: return 0.0;
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <VStack space={4} alignItems="center" w="100%" px={4}>
          <FlatList
            data={courses}
            keyExtractor={(item) => item['Course Code']}
            renderItem={({ item }) => (
              <Box
                borderWidth={1}
                borderColor="#48CFCB"
                borderRadius="md"
                p={5}
                mb={4}
                w="100%" // Adjusted to fit within the container
                bg="#424242"
              >
                <Text fontSize={18} mb={2} color="#48CFCB">
                  {item['Course Name']}
                </Text>
                <Text fontSize={16} mb={2} color="#48CFCB">
                  Course Code: {item['Course Code']}
                </Text>
                <Text fontSize={16} mb={2} color="#48CFCB">
                  Credit: {item.Credit}
                </Text>
                <HStack space={3} alignItems="center">
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <HStack space={2} alignItems="center">
                      {grades.map((grade) => (
                        <Button
                          key={grade}
                          variant={gradeSelections[item['Course Code']] === grade ? 'solid' : 'outline'}
                          onPress={() => handleGradeChange(item['Course Code'], grade)}
                          _text={{
                            color: gradeSelections[item['Course Code']] === grade ? 'white' : '#48CFCB',
                          }}
                          _pressed={{
                            bg: "teal.600",
                          }}
                          style={{
                            marginRight: 8,
                            paddingHorizontal: 12,
                            backgroundColor: gradeSelections[item['Course Code']] === grade ? '#48CFCB' : 'transparent',
                            borderColor: '#48CFCB',
                            borderWidth: 1,
                          }}
                        >
                          {grade}
                        </Button>
                      ))}
                    </HStack>
                  </ScrollView>
                </HStack>
              </Box>
            )}
          />
          <Button mt={4} onPress={calculateCGPA} bg="#48CFCB">
            <Text color="white">Calculate CGPA</Text>
          </Button>
          <Text mt={4} fontSize={16} color="#48CFCB">
            {cgpa !== null ? `CGPA: ${cgpa.toFixed(2)}` : 'CGPA: Not Calculated'}
          </Text>
        </VStack>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#424242', // Set background color to gray
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 40, // Add extra padding to ensure content isn't cut off
  },
});

export default Getcgpa;
