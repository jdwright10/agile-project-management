import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import screens (we'll create these next)
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FoodTrackingScreen from '../screens/FoodTrackingScreen';
import BarcodeScanScreen from '../screens/BarcodeScanScreen';
import FoodCameraScreen from '../screens/FoodCameraScreen';
import ReportsScreen from '../screens/ReportsScreen';
import CoachScreen from '../screens/CoachScreen';
import GoalsScreen from '../screens/GoalsScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

// Import context
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';

// Define navigation types
export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  FoodTracking: undefined;
  Coach: undefined;
  Reports: undefined;
  Profile: undefined;
};

export type FoodTrackingStackParamList = {
  FoodTrackingMain: undefined;
  BarcodeScanner: undefined;
  FoodCamera: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Goals: undefined;
};

// Create navigators
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const FoodTrackingStack = createStackNavigator<FoodTrackingStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();

// Food Tracking Navigator
const FoodTrackingNavigator = () => {
  return (
    <FoodTrackingStack.Navigator>
      <FoodTrackingStack.Screen 
        name="FoodTrackingMain" 
        component={FoodTrackingScreen} 
        options={{
          title: 'Food Tracking',
          headerShown: false,
        }}
      />
      <FoodTrackingStack.Screen 
        name="BarcodeScanner" 
        component={BarcodeScanScreen} 
        options={{
          title: 'Scan Barcode',
        }}
      />
      <FoodTrackingStack.Screen 
        name="FoodCamera" 
        component={FoodCameraScreen} 
        options={{
          title: 'Food Recognition',
        }}
      />
    </FoodTrackingStack.Navigator>
  );
};

// Profile Navigator
const ProfileNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{
          title: 'Profile',
          headerShown: false,
        }}
      />
      <ProfileStack.Screen 
        name="Goals" 
        component={GoalsScreen} 
        options={{
          title: 'My Goals',
        }}
      />
    </ProfileStack.Navigator>
  );
};

// Main Tab Navigator
const MainTabNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.text,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="FoodTracking" 
        component={FoodTrackingNavigator} 
        options={{
          title: 'Food',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="food-apple" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Coach" 
        component={CoachScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="head-question" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Reports" 
        component={ReportsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-bar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileNavigator} 
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Root Stack Navigator
const MainNavigator = () => {
  const { isAuthenticated, isLoading } = useUser();
  
  if (isLoading) {
    // We could return a splash screen here
    return null;
  }
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Auth screens
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        // Main app
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator; 