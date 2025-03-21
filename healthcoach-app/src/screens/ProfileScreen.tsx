import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import Button from '../components/Button';
import TextInput from '../components/TextInput';

const ProfileScreen = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, logout, updateProfile } = useUser();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [height, setHeight] = useState(user?.height?.toString() || '');
  const [weight, setWeight] = useState(user?.weight?.toString() || '');
  const [age, setAge] = useState(user?.age?.toString() || '');
  
  const handleSave = async () => {
    if (!user) return;
    
    try {
      const success = await updateProfile({
        name,
        email,
        height: Number(height),
        weight: Number(weight),
        age: Number(age),
      });
      
      if (success) {
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };
  
  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: handleLogout, style: 'destructive' },
      ]
    );
  };
  
  const getActivityLevelLabel = (level: string) => {
    switch (level) {
      case 'sedentary': return 'Sedentary';
      case 'light': return 'Lightly Active';
      case 'moderate': return 'Moderately Active';
      case 'active': return 'Active';
      case 'very_active': return 'Very Active';
      default: return 'Not specified';
    }
  };
  
  // Calculate BMI
  const calculateBMI = () => {
    if (!user?.height || !user?.weight) return 'N/A';
    
    const heightInMeters = user.height / 100;
    const bmi = user.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };
  
  // Get BMI category
  const getBMICategory = () => {
    const bmi = parseFloat(calculateBMI());
    if (isNaN(bmi)) return 'Unknown';
    
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
        
        {!isEditing ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Icon name="pencil" size={24} color={theme.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(false)}
          >
            <Icon name="close" size={24} color={theme.error} />
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView style={styles.content}>
        <View style={[styles.profileHeader, { backgroundColor: theme.card }]}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=23' }}
              style={styles.profileImage}
            />
            
            {!isEditing && (
              <TouchableOpacity
                style={[styles.cameraButton, { backgroundColor: theme.primary }]}
              >
                <Icon name="camera" size={16} color="white" />
              </TouchableOpacity>
            )}
          </View>
          
          {isEditing ? (
            <TextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              variant="outlined"
              leftIcon="account"
            />
          ) : (
            <Text style={[styles.profileName, { color: theme.text }]}>
              {user?.name}
            </Text>
          )}
          
          {!isEditing && (
            <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>
              {user?.email}
            </Text>
          )}
        </View>
        
        {isEditing ? (
          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Personal Information
            </Text>
            
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              variant="outlined"
              leftIcon="email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <TextInput
                  label="Height (cm)"
                  value={height}
                  onChangeText={setHeight}
                  variant="outlined"
                  leftIcon="human-male-height"
                  keyboardType="number-pad"
                />
              </View>
              
              <View style={styles.halfInput}>
                <TextInput
                  label="Weight (kg)"
                  value={weight}
                  onChangeText={setWeight}
                  variant="outlined"
                  leftIcon="weight-kilogram"
                  keyboardType="number-pad"
                />
              </View>
            </View>
            
            <TextInput
              label="Age"
              value={age}
              onChangeText={setAge}
              variant="outlined"
              leftIcon="calendar"
              keyboardType="number-pad"
            />
            
            <View style={styles.buttonContainer}>
              <Button
                title="Save Changes"
                onPress={handleSave}
                variant="filled"
                leftIcon="content-save"
              />
            </View>
          </View>
        ) : (
          <>
            <View style={[styles.section, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Personal Information
              </Text>
              
              <View style={styles.infoItem}>
                <Icon name="human-male-height" size={24} color={theme.primary} />
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                  Height
                </Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {user?.height} cm
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Icon name="weight-kilogram" size={24} color={theme.primary} />
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                  Weight
                </Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {user?.weight} kg
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Icon name="calendar" size={24} color={theme.primary} />
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                  Age
                </Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {user?.age} years
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Icon name="run-fast" size={24} color={theme.primary} />
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                  Activity Level
                </Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {user?.activityLevel && getActivityLevelLabel(user.activityLevel)}
                </Text>
              </View>
            </View>
            
            <View style={[styles.section, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Health Metrics
              </Text>
              
              <View style={styles.infoItem}>
                <Icon name="calculator" size={24} color={theme.primary} />
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                  BMI
                </Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {calculateBMI()} ({getBMICategory()})
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Icon name="food-apple" size={24} color={theme.primary} />
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                  Daily Calorie Goal
                </Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {user?.goals.calories} kcal
                </Text>
              </View>
            </View>
            
            <View style={[styles.section, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Preferences
              </Text>
              
              <View style={styles.infoItem}>
                <Icon
                  name={isDark ? 'weather-night' : 'white-balance-sunny'}
                  size={24}
                  color={theme.primary}
                />
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                  Dark Mode
                </Text>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#767577', true: `${theme.primary}80` }}
                  thumbColor={isDark ? theme.primary : '#f4f3f4'}
                />
              </View>
              
              <View style={styles.infoItem}>
                <Icon name="bell" size={24} color={theme.primary} />
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                  Notifications
                </Text>
                <Switch
                  value={true}
                  trackColor={{ false: '#767577', true: `${theme.primary}80` }}
                  thumbColor={true ? theme.primary : '#f4f3f4'}
                />
              </View>
              
              <View style={styles.infoItem}>
                <Icon name="map-marker" size={24} color={theme.primary} />
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                  Location Services
                </Text>
                <Switch
                  value={false}
                  trackColor={{ false: '#767577', true: `${theme.primary}80` }}
                  thumbColor={false ? theme.primary : '#f4f3f4'}
                />
              </View>
            </View>
          </>
        )}
        
        <View style={styles.buttonContainer}>
          <Button
            title="Logout"
            onPress={confirmLogout}
            variant="outlined"
            leftIcon="logout"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  infoLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  buttonContainer: {
    marginVertical: 16,
  },
});

export default ProfileScreen; 