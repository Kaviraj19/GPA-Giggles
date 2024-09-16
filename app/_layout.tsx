// RootLayout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { NativeBaseProvider } from 'native-base';
import { DeptProvider } from '../context/DeptContext';

export default function RootLayout() {
  return (
    <NativeBaseProvider>
      <DeptProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#424242',
            },
            headerTintColor: '#48CFCB',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{ headerTitle: 'Home', headerShown: false }}
          />
          <Stack.Screen
            name="Getdept"
            options={{ headerTitle: 'Details' }}
          />
          <Stack.Screen
            name="Viewresults"
            options={{ headerTitle: 'Profile',headerShown: false }}
          />
          <Stack.Screen
            name="Getcgpa"
            options={{ headerTitle: 'Get Your GPA' }}
          />
          <Stack.Screen
            name="About"
            options={{ headerTitle: 'About' }}
          />

        </Stack>
      </DeptProvider>
    </NativeBaseProvider>
  );
}
