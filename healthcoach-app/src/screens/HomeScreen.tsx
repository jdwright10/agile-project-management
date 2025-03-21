import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { MainTabParamList } from '../navigation/MainNavigator';

type HomeScreenNavigationProp = StackNavigationProp<MainTabParamList, 'Home'>;

// Mock data for daily summary
const dailySummary = {
  calories: {
    consumed: 1250,
    goal: 2000,
    remaining: 750,
  },
  protein: {
    consumed: 65,
    goal: 100,
    unit: 'g',
  },
  carbs: {
    consumed: 130,
    goal: 200,
    unit: 'g',
  },
  fat: {
    consumed: 40,
    goal: 60,
    unit: 'g',
  },
  water: {
    consumed: 1200,
    goal: 2000,
    unit: 'ml',
  },
  steps: {
    count: 6500,
    goal: 10000,
  },
};

const ProgressCircle = ({ progress, size, color, backgroundColor, textColor }) => {
  const { theme } = useTheme();
  
  // Calculate circle properties
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          stroke={backgroundColor || theme.border}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={color || theme.primary}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{ color: textColor || theme.text, fontSize: size * 0.22, fontWeight: 'bold' }}>
          {Math.round(progress)}%
        </Text>
      </View>
    </View>
  );
};

const QuickActions = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity 
          style={styles.quickActionItem}
          onPress={() => navigation.navigate('FoodTracking')}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: theme.primary + '20' }]}>
            <Icon name="food-fork-drink" size={24} color={theme.primary} />
          </View>
          <Text style={[styles.actionText, { color: theme.text }]}>Log Food</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionItem}
          onPress={() => navigation.navigate('FoodTracking')}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: theme.warning + '20' }]}>
            <Icon name="barcode-scan" size={24} color={theme.warning} />
          </View>
          <Text style={[styles.actionText, { color: theme.text }]}>Scan Barcode</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionItem}
          onPress={() => navigation.navigate('Coach')}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: theme.info + '20' }]}>
            <Icon name="robot" size={24} color={theme.info} />
          </View>
          <Text style={[styles.actionText, { color: theme.text }]}>AI Coach</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionItem}
          onPress={() => navigation.navigate('Reports')}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: theme.success + '20' }]}>
            <Icon name="chart-line" size={24} color={theme.success} />
          </View>
          <Text style={[styles.actionText, { color: theme.text }]}>Reports</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const NutrientSummary = () => {
  const { theme } = useTheme();
  
  const renderNutrient = (label, consumed, goal, unit, color) => {
    const progress = Math.min(100, (consumed / goal) * 100);
    
    return (
      <View style={styles.nutrientItem}>
        <View style={styles.nutrientHeader}>
          <Text style={[styles.nutrientLabel, { color: theme.text }]}>{label}</Text>
          <Text style={[styles.nutrientValue, { color: theme.textSecondary }]}>
            {consumed}/{goal}{unit}
          </Text>
        </View>
        <View style={[styles.progressBarContainer, { backgroundColor: theme.border }]}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${progress}%`, backgroundColor: color || theme.primary }
            ]} 
          />
        </View>
      </View>
    );
  };
  
  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Nutrient Summary</Text>
      <View style={styles.nutrientsList}>
        {renderNutrient('Proteins', dailySummary.protein.consumed, dailySummary.protein.goal, dailySummary.protein.unit, '#FF6B6B')}
        {renderNutrient('Carbs', dailySummary.carbs.consumed, dailySummary.carbs.goal, dailySummary.carbs.unit, '#4ECDC4')}
        {renderNutrient('Fats', dailySummary.fat.consumed, dailySummary.fat.goal, dailySummary.fat.unit, '#FFD166')}
        {renderNutrient('Water', dailySummary.water.consumed, dailySummary.water.goal, dailySummary.water.unit, '#118AB2')}
      </View>
    </View>
  );
};

const AIRecommendations = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>AI Recommendations</Text>
      <TouchableOpacity 
        style={[styles.recommendationItem, { borderColor: theme.border }]} 
        onPress={() => navigation.navigate('Coach')}
      >
        <Icon name="food-apple" size={24} color={theme.primary} style={styles.recommendationIcon} />
        <View style={styles.recommendationContent}>
          <Text style={[styles.recommendationTitle, { color: theme.text }]}>
            Increase protein intake
          </Text>
          <Text style={[styles.recommendationText, { color: theme.textSecondary }]}>
            You're consistently below your protein goals. Try adding more lean meats, eggs, or plant-based proteins.
          </Text>
        </View>
        <Icon name="chevron-right" size={20} color={theme.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

const HomeScreen = () => {
  const { theme } = useTheme();
  const { user } = useUser();
  const { width } = useWindowDimensions();
  const [greeting, setGreeting] = useState('Good morning');
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);
  
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>Loading...</Text>
      </View>
    );
  }
  
  // Calculate calorie progress percentage
  const calorieProgress = (dailySummary.calories.consumed / dailySummary.calories.goal) * 100;
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with greeting */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.text }]}>{greeting},</Text>
          <Text style={[styles.userName, { color: theme.text }]}>{user.name}</Text>
        </View>
        <TouchableOpacity>
          <Image 
            source={{ uri: user.photoURL || 'https://i.pravatar.cc/150?img=68' }}
            style={styles.userAvatar}
          />
        </TouchableOpacity>
      </View>
      
      {/* Daily summary */}
      <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
        <View style={styles.summaryContent}>
          <ProgressCircle 
            progress={calorieProgress} 
            size={width * 0.25} 
            color={theme.primary} 
            backgroundColor={theme.primaryLight}
            textColor={theme.text}
          />
          <View style={styles.summaryDetails}>
            <Text style={[styles.summaryTitle, { color: theme.text }]}>Daily Summary</Text>
            <View style={styles.calorieInfo}>
              <Text style={[styles.calorieText, { color: theme.textSecondary }]}>
                <Text style={[styles.calorieValue, { color: theme.text }]}>{dailySummary.calories.consumed}</Text> kcal consumed
              </Text>
              <Text style={[styles.calorieText, { color: theme.textSecondary }]}>
                <Text style={[styles.calorieValue, { color: theme.success }]}>{dailySummary.calories.remaining}</Text> kcal remaining
              </Text>
            </View>
            <View style={styles.additionalInfo}>
              <View style={styles.infoItem}>
                <Icon name="shoe-print" size={16} color={theme.text} />
                <Text style={[styles.infoText, { color: theme.text }]}>
                  {dailySummary.steps.count} steps
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="water" size={16} color={theme.info} />
                <Text style={[styles.infoText, { color: theme.text }]}>
                  {dailySummary.water.consumed} ml
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      
      {/* Quick Actions */}
      <QuickActions />
      
      {/* Nutrient Summary */}
      <NutrientSummary />
      
      {/* AI Recommendations */}
      <AIRecommendations />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryDetails: {
    flex: 1,
    marginLeft: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  calorieInfo: {
    marginBottom: 8,
  },
  calorieText: {
    fontSize: 14,
    marginBottom: 4,
  },
  calorieValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  additionalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 4,
    fontSize: 14,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    textAlign: 'center',
  },
  nutrientsList: {
    marginTop: 8,
  },
  nutrientItem: {
    marginBottom: 12,
  },
  nutrientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nutrientLabel: {
    fontSize: 14,
  },
  nutrientValue: {
    fontSize: 14,
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  recommendationIcon: {
    marginRight: 12,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  recommendationText: {
    fontSize: 14,
  },
});

export default HomeScreen; 