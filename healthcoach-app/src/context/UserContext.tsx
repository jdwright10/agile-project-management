import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define user types
export type UserGoals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  steps: number;
  weight?: number;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  height: number; // in cm
  weight: number; // in kg
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goals: UserGoals;
  dietaryPreferences: string[];
  allergies: string[];
  startDate: string; // ISO date string
};

// Mock user data
const MOCK_USER: UserProfile = {
  id: '1',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  height: 165,
  weight: 68,
  age: 32,
  gender: 'female',
  activityLevel: 'moderate',
  goals: {
    calories: 2000,
    protein: 120,
    carbs: 250,
    fat: 70,
    water: 2500, // ml
    steps: 10000,
    weight: 65, // target weight
  },
  dietaryPreferences: ['vegetarian'],
  allergies: ['peanuts', 'shellfish'],
  startDate: '2023-05-01T00:00:00.000Z',
};

// Context types
type UserContextType = {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Partial<UserProfile>, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updateGoals: (goals: Partial<UserGoals>) => Promise<boolean>;
};

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Load mock user for development
          setUser(MOCK_USER);
        }
      } catch (err) {
        setError('Failed to load user data');
        // Use mock user as fallback
        setUser(MOCK_USER);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, you would have an API call here
      // This is just a mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'jane.doe@example.com' && password === 'password') {
        setUser(MOCK_USER);
        await AsyncStorage.setItem('user', JSON.stringify(MOCK_USER));
        return true;
      } else {
        setError('Invalid email or password');
        return false;
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (userData: Partial<UserProfile>, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, you would have an API call here
      // This is just a mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: UserProfile = {
        ...MOCK_USER,
        ...userData,
        id: `user_${Date.now()}`,
        startDate: new Date().toISOString(),
      };
      
      setUser(newUser);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch (err) {
      setError('Signup failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (err) {
      setError('Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    try {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      return true;
    } catch (err) {
      setError('Failed to update profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update goals function
  const updateGoals = async (goals: Partial<UserGoals>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    try {
      const updatedUser = { 
        ...user, 
        goals: { ...user.goals, ...goals } 
      };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      return true;
    } catch (err) {
      setError('Failed to update goals');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        signup,
        logout,
        updateProfile,
        updateGoals,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext; 