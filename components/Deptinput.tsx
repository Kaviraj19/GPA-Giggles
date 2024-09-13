import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Box, VStack, Select, Center, CheckIcon, Text, Input, Checkbox } from 'native-base';
import { useDept } from '../context/DeptContext'; // Adjust path as needed
import data from '../data/all_dept.json'; // Adjust path as needed

interface Department {
  dept: string;
  SEMS: Semester[];
}

interface Semester {
  semester: number;
  courses: Course[];
}

interface Course {
  'Course Code': string;
  'Course Name': string;
  Credit: number;
}

const Deptinput: React.FC = () => {
  const {
    setDept,
    setSemester,
    setRollNo,
    oec,
    hm,
    setOEC,
    setHM,
  } = useDept();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [rollNo, setRollNoState] = useState<string>(''); // Roll Number State
  const [selectedDept, setSelectedDept] = useState<string>(''); // Local state for department
  const [selectedSemester, setSelectedSemester] = useState<string>(''); // Local state for semester

  // Initialize departments from JSON
  useEffect(() => {
    setDepartments(data);
  }, []);

  // Update roll number in context whenever rollNo state changes
  useEffect(() => {
    setRollNo(rollNo);
    
    // Reset department and semester if roll number is cleared
    if (rollNo === '') {
      setSelectedDept(''); // Reset department
      setSelectedSemester(''); // Reset semester
      setSemesters([]); // Clear semesters list
      setDept(''); // Update in context
      setSemester(''); // Update in context
      setHM(false);
      setOEC(false);
    }
  }, [rollNo]);

  const handleDeptChange = (value: string) => {
    setSelectedDept(value); // Set the selected department locally
    setDept(value); // Update the department in context

    const deptData = departments.find((dept) => dept.dept === value);
    if (deptData) {
      setSemesters(deptData.SEMS); // Populate semesters based on department
    } else {
      setSemesters([]); // Clear semesters if no department is found
    }

    setSelectedSemester(''); // Reset semester when department changes
    setSemester(''); // Reset in context
  };

  const handleSemesterChange = (value: string) => {
    setSelectedSemester(value); // Set the selected semester locally
    setSemester(value); // Update in context
  };

  // Convert selectedSemester to a number and check if it's greater than 2
  const isHigherSemester = selectedSemester && Number(selectedSemester) > 2;

  return (
    <View>
      <Center>
        <Box mt={4}>
          <Text mb={2} color="#48CFCB">
            Enter your Details:
          </Text>
          <Input
            value={rollNo}
            minWidth="200"
            onChangeText={(text) => setRollNoState(text)} // Update roll number
            placeholder="Enter your roll number"
            keyboardType="numeric"
            borderColor="#48CFCB"
            _focus={{ borderColor: '#48CFCB' }}
            color="#48CFCB" // Set text color inside the Input to teal
            placeholderTextColor="#229799" // Set placeholder color to a lighter teal
          />
        </Box>
        <Box maxW="300">
          <VStack space={2}>
            <Select
              minWidth="200"
              accessibilityLabel="Choose Department"
              placeholder="Choose Department" // Ensure the placeholder is shown
              _selectedItem={{
                bg: "#48CFCB",
                endIcon: <CheckIcon size="5" />,
              }}
              _item={{
                bg: "#424242", // Set background color for the dropdown item
                _text: { color: "white" }, // Set text color for the dropdown item
              }}
              _actionSheetBody={{
                bg: "gray.700",
              }}
              _actionSheetContent={{
                bg: "#424242",
              }}
              mt={1}
              onValueChange={handleDeptChange}
              selectedValue={selectedDept} // Bind local selectedDept to allow reset
              borderColor="#48CFCB"
              _focus={{ borderColor: '#48CFCB' }}
              color="#48CFCB" // Set text color inside the Select to teal
              placeholderTextColor="#229799" // Set placeholder color to a lighter teal
            >
              {departments.map((item) => (
                <Select.Item key={item.dept} label={item.dept} value={item.dept} />
              ))}
            </Select>

            {selectedDept && (
              
              <Select
                minWidth="200"
                accessibilityLabel="Choose Semester"
                placeholder="Choose Semester"
                _selectedItem={{
                  bg: "#48CFCB",
                  endIcon: <CheckIcon size="5" />,
                }}
                _item={{
                  bg: "#424242", // Set background color for the dropdown item
                  _text: { color: "white" }, // Set text color for the dropdown item
                }}
                _actionSheetBody={{
                  bg: "gray.700",
                }}
                _actionSheetContent={{
                  bg: "#424242",
                }}
                mt={1}
                onValueChange={handleSemesterChange}
                selectedValue={selectedSemester} // Bind local selectedSemester to allow reset
                borderColor="#48CFCB"
                _focus={{ borderColor: '#48CFCB' }}
                color="#48CFCB" // Set text color inside the Select to teal
                placeholderTextColor="#229799" // Set placeholder color to a lighter teal
              >
                {semesters.map((item) => (
                  <Select.Item
                    key={item.semester}
                    label={`Semester ${item.semester}`}
                    value={item.semester.toString()}
                  />
                ))}
              </Select>
            )}

            {isHigherSemester && (
              <VStack space={2}>
                <Checkbox
                  isChecked={oec}
                  onChange={(isChecked) => setOEC(isChecked)}
                  value="OEC"
                  _text={{ color: '#48CFCB' }} // Set checkbox text to teal
                  borderColor="#48CFCB"
                  _checked={{ bg: '#48CFCB', borderColor: '#48CFCB' }} // Checked state in teal
                >
                  OEC
                </Checkbox>
                <Checkbox
                  isChecked={hm}
                  onChange={(isChecked) => setHM(isChecked)}
                  value="H&M"
                  _text={{ color: '#48CFCB' }} // Set checkbox text to teal
                  borderColor="#48CFCB"
                  _checked={{ bg: '#48CFCB', borderColor: '#48CFCB' }} // Checked state in teal
                >
                  H&M
                </Checkbox>
              </VStack>
            )}
          </VStack>
        </Box>
      </Center>
    </View>
  );
};

export default Deptinput;
