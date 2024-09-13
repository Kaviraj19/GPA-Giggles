import React, { createContext, useContext, useState } from 'react';

interface DeptContextType {
  selectedDept: string | null;
  selectedSemester: string | null;
  rollNo: string;
  oec: boolean;
  hm: boolean;
  setDept: (dept: string) => void;
  setSemester: (semester: string) => void;
  setRollNo: (rollNo: string) => void;
  setOEC: (value: boolean) => void;
  setHM: (value: boolean) => void;
}

const DeptContext = createContext<DeptContextType | undefined>(undefined);

export const DeptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [rollNo, setRollNoState] = useState<string>('');
  const [oec, setOECState] = useState<boolean>(false); // State for OEC checkbox
  const [hm, setHMState] = useState<boolean>(false); // State for H&M checkbox

  const setDept = (dept: string) => setSelectedDept(dept);
  const setSemester = (semester: string) => setSelectedSemester(semester);
  const setRollNo = (rollNo: string) => setRollNoState(rollNo);
  const setOEC = (value: boolean) => setOECState(value); // Function to update OEC state
  const setHM = (value: boolean) => setHMState(value); // Function to update H&M state

  return (
    <DeptContext.Provider
      value={{
        selectedDept,
        selectedSemester,
        rollNo,
        oec,
        hm,
        setDept,
        setSemester,
        setRollNo,
        setOEC,
        setHM,
      }}
    >
      {children}
    </DeptContext.Provider>
  );
};

export const useDept = () => {
  const context = useContext(DeptContext);
  if (context === undefined) {
    throw new Error('useDept must be used within a DeptProvider');
  }
  return context;
};
