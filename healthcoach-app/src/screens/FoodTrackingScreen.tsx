import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTheme } from '../context/ThemeContext';
import { FoodTrackingStackParamList } from '../navigation/MainNavigator';

type FoodTrackingNavigationProp = StackNavigationProp<FoodTrackingStackParamList>;

// Mock data for food entries
const mockFoodEntries = [
  {
    id: '1',
    name: 'Oatmeal with Berries',
    calories: 320,
    protein: 12,
    carbs: 52,
    fat: 6,
    mealType: 'breakfast',
    time: '08:30',
    date: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1567154878592-37917421b320?w=200&q=80',
  },
  {
    id: '2',
    name: 'Grilled Chicken Salad',
    calories: 450,
    protein: 40,
    carbs: 15,
    fat: 22,
    mealType: 'lunch',
    time: '13:15',
    date: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80',
  },
  {
    id: '3',
    name: 'Protein Shake',
    calories: 180,
    protein: 25,
    carbs: 9,
    fat: 2,
    mealType: 'snack',
    time: '16:45',
    date: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80',
  },
];

// Meal type buttons component
const MealTypeSelector = ({ selectedMeal, onSelectMeal }) => {
  const { theme } = useTheme();
  
  const mealTypes = [
    { id: 'all', label: 'All', icon: 'food-variant' },
    { id: 'breakfast', label: 'Breakfast', icon: 'food-croissant' },
    { id: 'lunch', label: 'Lunch', icon: 'food' },
    { id: 'dinner', label: 'Dinner', icon: 'food-turkey' },
    { id: 'snack', label: 'Snack', icon: 'food-apple' },
  ];
  
  return (
    <View style={styles.mealTypeContainer}>
      <FlatList
        data={mealTypes}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.mealTypeItem,
              selectedMeal === item.id && { 
                backgroundColor: theme.primary + '20',
                borderColor: theme.primary,
              },
              selectedMeal !== item.id && { borderColor: theme.border },
            ]}
            onPress={() => onSelectMeal(item.id)}
          >
            <Icon 
              name={item.icon} 
              size={20} 
              color={selectedMeal === item.id ? theme.primary : theme.textSecondary} 
            />
            <Text 
              style={[
                styles.mealTypeText,
                { color: selectedMeal === item.id ? theme.primary : theme.text }
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

// Quick add options component
const QuickAddOptions = ({ onNavigate }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<FoodTrackingNavigationProp>();
  
  const options = [
    { 
      id: 'scan', 
      label: 'Scan Barcode', 
      icon: 'barcode-scan', 
      background: theme.warning + '20',
      color: theme.warning,
      onPress: () => navigation.navigate('BarcodeScanner'),
    },
    { 
      id: 'camera', 
      label: 'Take Photo', 
      icon: 'camera', 
      background: theme.info + '20',
      color: theme.info,
      onPress: () => navigation.navigate('FoodCamera'),
    },
    { 
      id: 'search', 
      label: 'Search Food', 
      icon: 'magnify', 
      background: theme.primary + '20',
      color: theme.primary,
      onPress: () => onNavigate?.('search'),
    },
  ];
  
  return (
    <View style={styles.quickAddContainer}>
      <FlatList
        data={options}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.quickAddItem}
            onPress={item.onPress}
          >
            <View style={[styles.quickAddIconContainer, { backgroundColor: item.background }]}>
              <Icon name={item.icon} size={22} color={item.color} />
            </View>
            <Text style={[styles.quickAddText, { color: theme.text }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

// Food entry item component
const FoodEntryItem = ({ item }) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.foodEntryItem, { backgroundColor: theme.card }]}>
      <View style={styles.foodImageContainer}>
        <Image source={{ uri: item.image }} style={styles.foodImage} />
      </View>
      
      <View style={styles.foodInfoContainer}>
        <Text style={[styles.foodName, { color: theme.text }]}>{item.name}</Text>
        <View style={styles.macroContainer}>
          <Text style={[styles.calories, { color: theme.text }]}>{item.calories} cal</Text>
          <Text style={[styles.macros, { color: theme.text }]}>
            P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
          </Text>
        </View>
      </View>
      
      <View style={styles.timeContainer}>
        <Text style={[styles.timeText, { color: theme.text }]}>{item.time}</Text>
        <Icon name="dots-vertical" size={20} color={theme.text} />
      </View>
    </View>
  );
};

// Main component
const FoodTrackingScreen = () => {
  const { theme } = useTheme();
  const [selectedMeal, setSelectedMeal] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState(new Date());

  // Filter food entries based on selected meal
  const filteredEntries = selectedMeal === 'all'
    ? mockFoodEntries
    : mockFoodEntries.filter(entry => entry.mealType === selectedMeal);
    
  // Format date for display
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header with date selector */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.dateSelector}>
          <Icon name="chevron-left" size={24} color={theme.text} />
        </TouchableOpacity>
        
        <Text style={[styles.dateText, { color: theme.text }]}>{formattedDate}</Text>
        
        <TouchableOpacity style={styles.dateSelector}>
          <Icon name="chevron-right" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      
      {/* Daily nutrition summary */}
      <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.summaryTitle, { color: theme.text }]}>Daily Summary</Text>
        
        <View style={styles.nutritionRow}>
          <View style={styles.nutritionItem}>
            <Text style={[styles.nutritionValue, { color: theme.primary }]}>1,250</Text>
            <Text style={[styles.nutritionLabel, { color: theme.text }]}>Consumed</Text>
          </View>
          
          <View style={styles.nutritionSeparator} />
          
          <View style={styles.nutritionItem}>
            <Text style={[styles.nutritionValue, { color: theme.text }]}>2,000</Text>
            <Text style={[styles.nutritionLabel, { color: theme.text }]}>Goal</Text>
          </View>
          
          <View style={styles.nutritionSeparator} />
          
          <View style={styles.nutritionItem}>
            <Text style={[styles.nutritionValue, { color: theme.success }]}>750</Text>
            <Text style={[styles.nutritionLabel, { color: theme.text }]}>Remaining</Text>
          </View>
        </View>
      </View>
      
      {/* Meal type selector */}
      <MealTypeSelector selectedMeal={selectedMeal} onSelectMeal={setSelectedMeal} />
      
      {/* Quick add options */}
      <QuickAddOptions />
      
      {/* Food entries list */}
      <View style={styles.foodListContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Food</Text>
        
        {filteredEntries.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Icon name="food-off" size={48} color={theme.border} />
            <Text style={[styles.emptyStateText, { color: theme.text }]}>
              No {selectedMeal !== 'all' ? selectedMeal : 'food'} entries for today
            </Text>
            <TouchableOpacity style={[styles.addFoodButton, { backgroundColor: theme.primary }]}>
              <Text style={styles.addFoodButtonText}>Add Food</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredEntries}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <FoodEntryItem item={item} />}
            contentContainerStyle={styles.foodList}
          />
        )}
      </View>
      
      {/* Add food button */}
      {filteredEntries.length > 0 && (
        <TouchableOpacity style={[styles.floatingButton, { backgroundColor: theme.primary }]}>
          <Icon name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  dateSelector: {
    padding: 4,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nutritionItem: {
    flex: 1,
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  nutritionLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  nutritionSeparator: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  mealTypesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  mealTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  mealTypeText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  quickAddContainer: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  optionTitle: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
  },
  foodListContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  foodList: {
    paddingBottom: 80,
  },
  foodEntryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  foodImageContainer: {
    marginRight: 12,
  },
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  foodInfoContainer: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  macroContainer: {
    flexDirection: 'column',
  },
  calories: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  macros: {
    fontSize: 12,
    opacity: 0.7,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    marginRight: 4,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  addFoodButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addFoodButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default FoodTrackingScreen; 