import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';

// Import theme context
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';

// Import navigation types
import { RootStackParamList, AuthStackParamList, MainTabParamList, FoodStackParamList } from './types';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import GoalsScreen from '../screens/GoalsScreen';
import FoodTrackingScreen from '../screens/FoodTrackingScreen';
import BarcodeScanScreen from '../screens/BarcodeScanScreen';
import FoodCameraScreen from '../screens/FoodCameraScreen';
import CoachScreen from '../screens/CoachScreen';
import ReportsScreen from '../screens/ReportsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Stack navigators
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();
const FoodStack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth navigator for login, signup, onboarding
const AuthNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.background },
      }}
    >
      <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

// Food tracking navigator
const FoodNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <FoodStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.background },
      }}
    >
      <FoodStack.Screen name="FoodTracking" component={FoodTrackingScreen} />
      <FoodStack.Screen name="BarcodeScanner" component={BarcodeScanScreen} />
      <FoodStack.Screen name="FoodCamera" component={FoodCameraScreen} />
    </FoodStack.Navigator>
  );
};

// Main tab navigator
const MainTabNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          paddingTop: 5,
          paddingBottom: 8,
          height: 60,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarLabel: () => null, // Remove labels
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Food') {
            iconName = 'food-apple';
          } else if (route.name === 'Coach') {
            iconName = 'robot';
          } else if (route.name === 'Reports') {
            iconName = 'chart-bar';
          } else if (route.name === 'Profile') {
            iconName = 'account';
          }
          
          return <Icon name={iconName} size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Food" component={FoodNavigator} />
      <Tab.Screen name="Coach" component={CoachScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// App navigator with authentication flow
const AppNavigator = () => {
  const { theme } = useTheme();
  const { user, isLoading } = useUser();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Check if user has seen onboarding
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('hasSeenOnboarding');
        setHasSeenOnboarding(value === 'true');
      } catch (error) {
        console.error('Failed to get onboarding status:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    checkOnboarding();
  }, []);

  // If still loading or initializing, you might want to show a splash screen
  if (isLoading || isInitializing) {
    return <View />; // Return an empty view instead of null
  }

  return (
    <NavigationContainer theme={{ colors: { background: theme.background } } as any}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // Auth flow
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          // Main app
          <Stack.Screen name="Main" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 