// Navigation types for the app

// Root stack param list
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Signup: undefined;
  Onboarding: undefined;
  Home: undefined;
  FoodTracking: undefined;
  BarcodeScanner: undefined;
  FoodCamera: undefined;
  Coach: undefined;
  Reports: undefined;
  Profile: undefined;
  Goals: undefined;
  HealthDataUpdate: undefined;
  AccountSettings: undefined;
  PrivacySettings: undefined;
  About: undefined;
};

// Auth stack param list
export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
};

// Main tab param list
export type MainTabParamList = {
  Home: undefined;
  Food: undefined;
  Coach: undefined;
  Reports: undefined;
  Profile: undefined;
};

// Food stack param list
export type FoodStackParamList = {
  FoodTracking: undefined;
  BarcodeScanner: undefined;
  FoodCamera: undefined;
};

// Export for type inference
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 