import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, ScrollView, LogBox, Animated, ActivityIndicator } from 'react-native';
import { Text, Box, VStack, HStack, Button } from 'native-base';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDept } from '../context/DeptContext'; 
import data from '../data/all_dept.json'; 
import additionalData from '../data/hm_oec_data.json'; 
import GpaResults from '../components/GpaResult';

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
  const { selectedDept, selectedSemester, rollNo, oec, hm } = useDept();
  const [courses, setCourses] = useState<Course[]>([]);
  const [gradeSelections, setGradeSelections] = useState<{ [key: string]: string }>({});
  const [cgpa, setCgpa] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  // Track animated values for grade buttons
  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: Animated.Value }>({});

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']); // Ignore potential warnings

    const fetchData = async () => {
      if (selectedDept && selectedSemester !== null && rollNo) {
        const deptData = data.find((dept: Department) => dept.dept === selectedDept);
        if (deptData) {
          const semesterData = deptData.SEMS.find(sem => sem.semester === parseInt(selectedSemester));
          if (semesterData) {
            const mainCourses = semesterData.courses;
            const hmOecCourses = getHmOecCourses();
            const allCourses = [...mainCourses, ...hmOecCourses]; // Combine main and additional courses

            setCourses(allCourses);

            const initialGradeSelections = allCourses.reduce((acc, course) => {
              acc[course['Course Code']] = '';
              return acc;
            }, {} as { [key: string]: string });

            setGradeSelections(initialGradeSelections);

            // Initialize animated values for each course
            const initialAnimatedValues = allCourses.reduce((acc, course) => {
              acc[course['Course Code']] = new Animated.Value(0);
              return acc;
            }, {} as { [key: string]: Animated.Value });

            setAnimatedValues(initialAnimatedValues);
          }
        }
      }
      setLoading(false); // Set loading to false after fetching data
    };

    fetchData();
  }, [selectedDept, selectedSemester, rollNo, oec, hm]);

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

  const handleGradeChange = useCallback((courseCode: string, grade: string) => {
    // Trigger bounce animation for the selected button
    Animated.sequence([
      Animated.spring(animatedValues[courseCode], {
        toValue: -10, // Move up
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.spring(animatedValues[courseCode], {
        toValue: 0, // Move down
        friction: 2,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    setGradeSelections(prev => ({ ...prev, [courseCode]: grade }));
  }, [animatedValues]);

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
    setShowResults(true);

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
     // console.log('Data saved successfully');
    } catch (error) {
      // console.error('Failed to save data:', error);
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
  const handleGoBack = () => {
    setShowResults(false); // Go back to form view
  };

  return (
    <View style={styles.wrapper}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#48CFCB" />
        </View>
      ) : showResults ? (
        <GpaResults cgpa={cgpa} onGoBack={handleGoBack} /> // Render results page
      ) : (
        <FlatList
          contentContainerStyle={styles.container}
          data={courses}
          keyExtractor={(item) => item['Course Code']}
          renderItem={({ item }) => {
            const isSelected = gradeSelections[item['Course Code']] !== '';
            const animatedStyle = {
              transform: [
                {
                  translateY: animatedValues[item['Course Code']].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -5],
                  }),
                },
              ],
            };
  
            return (
              <Box
                borderWidth={1}
                borderColor="#48CFCB"
                borderRadius="md"
                p={5}
                mb={4}
                w="100%"
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
                        <Animated.View key={grade} style={animatedStyle}>
                          <Button
                            variant={isSelected && gradeSelections[item['Course Code']] === grade ? 'solid' : 'outline'}
                            onPress={() => handleGradeChange(item['Course Code'], grade)}
                            _text={{
                              color: isSelected && gradeSelections[item['Course Code']] === grade ? 'white' : '#48CFCB',
                            }}
                            _pressed={{
                              bg: "teal.600",
                            }}
                            style={{
                              marginRight: 10,
                              paddingHorizontal: 12,
                              backgroundColor: isSelected && gradeSelections[item['Course Code']] === grade ? '#48CFCB' : 'transparent',
                              borderColor: '#48CFCB',
                              borderWidth: 1,
                            }}
                          >
                            {grade}
                          </Button>
                        </Animated.View>
                      ))}
                    </HStack>
                  </ScrollView>
                </HStack>
              </Box>
            );
          }}
          ListFooterComponent={
            <Button mt={4} onPress={calculateCGPA} bg="#48CFCB">
              <Text color="white">Calculate GPA</Text>
            </Button>
          }
        />
      )}
    </View>
  );
  
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#424242',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#424242',
  },
});

export default Getcgpa;
