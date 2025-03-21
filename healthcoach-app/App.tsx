import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import providers
import { ThemeProvider } from './src/context/ThemeContext';
import { UserProvider } from './src/context/UserContext';

// Import navigation
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="auto" />
        <UserProvider>
          <AppNavigator />
        </UserProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
} 