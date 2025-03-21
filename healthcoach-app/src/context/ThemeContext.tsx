import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the theme types
export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  switchThumb: string;
  switchTrackOn: string;
  switchTrackOff: string;
}

// Light theme colors
const lightTheme: ThemeColors = {
  primary: '#4CAF50',
  primaryLight: '#E8F5E9',
  primaryDark: '#388E3C',
  secondary: '#2196F3',
  accent: '#FF9800',
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  error: '#D32F2F',
  success: '#388E3C',
  warning: '#FFA000',
  info: '#1976D2',
  switchThumb: '#F1F1F1',
  switchTrackOn: '#A5D6A7',
  switchTrackOff: '#BDBDBD',
};

// Dark theme colors
const darkTheme: ThemeColors = {
  primary: '#81C784',
  primaryLight: '#1B5E20',
  primaryDark: '#2E7D32',
  secondary: '#64B5F6',
  accent: '#FFB74D',
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#333333',
  error: '#EF5350',
  success: '#66BB6A',
  warning: '#FFD54F',
  info: '#42A5F5',
  switchThumb: '#F1F1F1',
  switchTrackOn: '#519657',
  switchTrackOff: '#5D5D5D',
};

// Define the context type
export interface ThemeContextType {
  theme: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (scheme: 'light' | 'dark' | 'system') => void;
  themePreference: 'light' | 'dark' | 'system';
}

// Create the context with a default value
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme storage key
const THEME_STORAGE_KEY = 'healthcoach-theme-preference';

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useColorScheme(); // Get device color scheme
  const [themePreference, setThemePreference] = useState<'light' | 'dark' | 'system'>('system');
  const [isDark, setIsDark] = useState<boolean>(deviceTheme === 'dark');

  // Effect to load the saved theme preference from storage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedPreference = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedPreference) {
          setThemePreference(savedPreference as 'light' | 'dark' | 'system');
          
          // Set isDark based on preference or system
          if (savedPreference === 'system') {
            setIsDark(deviceTheme === 'dark');
          } else {
            setIsDark(savedPreference === 'dark');
          }
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };

    loadThemePreference();
  }, [deviceTheme]);

  // Effect to update isDark when deviceTheme changes if using system preference
  useEffect(() => {
    if (themePreference === 'system') {
      setIsDark(deviceTheme === 'dark');
    }
  }, [deviceTheme, themePreference]);

  // Function to toggle the theme
  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    // Save the new theme preference
    const newPreference = newIsDark ? 'dark' : 'light';
    setThemePreference(newPreference);
    AsyncStorage.setItem(THEME_STORAGE_KEY, newPreference);
  };

  // Function to set the theme explicitly
  const setTheme = (scheme: 'light' | 'dark' | 'system') => {
    setThemePreference(scheme);
    AsyncStorage.setItem(THEME_STORAGE_KEY, scheme);
    
    if (scheme === 'system') {
      setIsDark(deviceTheme === 'dark');
    } else {
      setIsDark(scheme === 'dark');
    }
  };

  // Get the active theme based on isDark
  const theme = isDark ? darkTheme : lightTheme;

  // Context value
  const contextValue: ThemeContextType = {
    theme,
    isDark,
    toggleTheme,
    setTheme,
    themePreference,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 