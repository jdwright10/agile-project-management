import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';

// Mock data for reports
const MOCK_NUTRITION_DATA = [
  { day: 'Mon', calories: 1850, goal: 2000 },
  { day: 'Tue', calories: 2100, goal: 2000 },
  { day: 'Wed', calories: 1920, goal: 2000 },
  { day: 'Thu', calories: 1750, goal: 2000 },
  { day: 'Fri', calories: 2200, goal: 2000 },
  { day: 'Sat', calories: 2300, goal: 2000 },
  { day: 'Sun', calories: 1950, goal: 2000 },
];

const MOCK_WEIGHT_DATA = [
  { date: '2023-06-01', weight: 85.5 },
  { date: '2023-06-08', weight: 84.8 },
  { date: '2023-06-15', weight: 84.2 },
  { date: '2023-06-22', weight: 83.7 },
  { date: '2023-06-29', weight: 83.0 },
  { date: '2023-07-06', weight: 82.5 },
  { date: '2023-07-13', weight: 82.0 },
];

const MOCK_NUTRIENT_BREAKDOWN = {
  protein: { value: 98, goal: 120, unit: 'g' },
  carbs: { value: 220, goal: 250, unit: 'g' },
  fat: { value: 65, goal: 70, unit: 'g' },
  fiber: { value: 22, goal: 30, unit: 'g' },
  sugar: { value: 45, goal: 50, unit: 'g' },
  sodium: { value: 2300, goal: 2300, unit: 'mg' },
};

type ReportPeriod = 'week' | 'month' | 'year';

const BarChart = ({ data }: { data: typeof MOCK_NUTRITION_DATA }) => {
  const { theme } = useTheme();
  const maxValue = Math.max(...data.map(item => Math.max(item.calories, item.goal)));
  
  return (
    <View style={styles.chartContainer}>
      <View style={styles.yAxisLabels}>
        <Text style={[styles.yAxisLabel, { color: theme.textSecondary }]}>
          {maxValue}
        </Text>
        <Text style={[styles.yAxisLabel, { color: theme.textSecondary }]}>
          {Math.round(maxValue / 2)}
        </Text>
        <Text style={[styles.yAxisLabel, { color: theme.textSecondary }]}>0</Text>
      </View>
      
      <View style={styles.chart}>
        <View style={[styles.horizontalLine, { backgroundColor: theme.border }]} />
        <View 
          style={[
            styles.horizontalLine, 
            { backgroundColor: theme.border, top: '50%' }
          ]} 
        />
        
        <View style={styles.barsContainer}>
          {data.map((item, index) => {
            const barHeight = (item.calories / maxValue) * 100;
            const goalLinePosition = (item.goal / maxValue) * 100;
            
            return (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.barLabelsContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: `${barHeight}%`, 
                        backgroundColor: item.calories > item.goal 
                          ? theme.warning 
                          : theme.primary,
                      }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.goalLine, 
                      { 
                        bottom: `${goalLinePosition}%`, 
                        backgroundColor: theme.error,
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.barLabel, { color: theme.textSecondary }]}>
                  {item.day}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const LineChart = ({ data }: { data: typeof MOCK_WEIGHT_DATA }) => {
  const { theme } = useTheme();
  const minWeight = Math.min(...data.map(item => item.weight));
  const maxWeight = Math.max(...data.map(item => item.weight));
  const range = maxWeight - minWeight;
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };
  
  return (
    <View style={styles.chartContainer}>
      <View style={styles.yAxisLabels}>
        <Text style={[styles.yAxisLabel, { color: theme.textSecondary }]}>
          {maxWeight.toFixed(1)}
        </Text>
        <Text style={[styles.yAxisLabel, { color: theme.textSecondary }]}>
          {((maxWeight + minWeight) / 2).toFixed(1)}
        </Text>
        <Text style={[styles.yAxisLabel, { color: theme.textSecondary }]}>
          {minWeight.toFixed(1)}
        </Text>
      </View>
      
      <View style={styles.chart}>
        <View style={[styles.horizontalLine, { backgroundColor: theme.border }]} />
        <View 
          style={[
            styles.horizontalLine, 
            { backgroundColor: theme.border, top: '50%' }
          ]} 
        />
        
        <View style={styles.lineChartContainer}>
          <View style={styles.lineChart}>
            {data.map((item, index) => {
              const normalizedValue = (item.weight - minWeight) / (range || 1);
              const yPosition = 100 - (normalizedValue * 100);
              
              // Skip first point for line drawing
              if (index === 0) return null;
              
              const prevItem = data[index - 1];
              const prevNormalizedValue = (prevItem.weight - minWeight) / (range || 1);
              const prevYPosition = 100 - (prevNormalizedValue * 100);
              
              return (
                <View 
                  key={index}
                  style={[
                    styles.lineSegment,
                    {
                      left: `${((index - 1) / (data.length - 1)) * 100}%`,
                      width: `${(1 / (data.length - 1)) * 100}%`,
                      top: `${prevYPosition}%`,
                      height: `${Math.abs(yPosition - prevYPosition)}%`,
                      backgroundColor: 'transparent',
                      borderTopWidth: yPosition >= prevYPosition ? 0 : 2,
                      borderBottomWidth: yPosition >= prevYPosition ? 2 : 0,
                      borderColor: theme.primary,
                    }
                  ]}
                />
              );
            })}
          </View>
          
          {data.map((item, index) => {
            const normalizedValue = (item.weight - minWeight) / (range || 1);
            const yPosition = 100 - (normalizedValue * 100);
            
            return (
              <View 
                key={`point-${index}`}
                style={[
                  styles.dataPoint,
                  {
                    left: `${(index / (data.length - 1)) * 100}%`,
                    top: `${yPosition}%`,
                    backgroundColor: theme.primary,
                    borderColor: theme.background,
                  }
                ]}
              />
            );
          })}
        </View>
        
        <View style={styles.xAxisLabels}>
          {data.map((item, index) => {
            // Only show some labels to avoid overcrowding
            if (index % 2 !== 0 && index !== data.length - 1) return null;
            
            return (
              <Text 
                key={index}
                style={[
                  styles.xAxisLabel, 
                  { 
                    color: theme.textSecondary,
                    left: `${(index / (data.length - 1)) * 100}%`,
                  }
                ]}
              >
                {formatDate(item.date)}
              </Text>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const NutrientProgressBar = ({ 
  label, 
  value, 
  goal, 
  unit, 
  color 
}: { 
  label: string; 
  value: number; 
  goal: number; 
  unit: string; 
  color: string;
}) => {
  const { theme } = useTheme();
  const progress = Math.min(100, (value / goal) * 100);
  
  return (
    <View style={styles.nutrientProgressBar}>
      <View style={styles.nutrientLabelContainer}>
        <Text style={[styles.nutrientLabel, { color: theme.text }]}>{label}</Text>
        <Text style={[styles.nutrientValues, { color: theme.textSecondary }]}>
          {value} / {goal} {unit}
        </Text>
      </View>
      
      <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
        <View 
          style={[
            styles.progressBarFill, 
            { 
              width: `${progress}%`, 
              backgroundColor: color 
            }
          ]} 
        />
      </View>
    </View>
  );
};

const ReportsScreen = () => {
  const { theme } = useTheme();
  const { user } = useUser();
  const [activePeriod, setActivePeriod] = useState<ReportPeriod>('week');
  const [activeTab, setActiveTab] = useState('nutrition');
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get readable period text
  const getPeriodText = () => {
    const now = new Date();
    
    switch (activePeriod) {
      case 'week':
        return 'Last 7 days';
      case 'month':
        return 'Last 30 days';
      case 'year':
        return 'Last 12 months';
      default:
        return 'Last 7 days';
    }
  };
  
  // Get color for nutrient
  const getNutrientColor = (nutrient: string) => {
    switch (nutrient) {
      case 'protein':
        return theme.primary;
      case 'carbs':
        return theme.warning;
      case 'fat':
        return theme.error;
      case 'fiber':
        return theme.success;
      case 'sugar':
        return '#9C27B0'; // Purple
      case 'sodium':
        return '#FF5722'; // Deep Orange
      default:
        return theme.secondary;
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Reports</Text>
      </View>
      
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'nutrition' && [
              styles.activeTab,
              { borderColor: theme.primary },
            ],
          ]}
          onPress={() => setActiveTab('nutrition')}
        >
          <Icon 
            name="food-apple" 
            size={18} 
            color={activeTab === 'nutrition' ? theme.primary : theme.textSecondary} 
          />
          <Text 
            style={[
              styles.tabText, 
              { 
                color: activeTab === 'nutrition' 
                  ? theme.primary 
                  : theme.textSecondary,
              },
            ]}
          >
            Nutrition
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'weight' && [
              styles.activeTab,
              { borderColor: theme.primary },
            ],
          ]}
          onPress={() => setActiveTab('weight')}
        >
          <Icon 
            name="scale" 
            size={18} 
            color={activeTab === 'weight' ? theme.primary : theme.textSecondary} 
          />
          <Text 
            style={[
              styles.tabText, 
              { 
                color: activeTab === 'weight' 
                  ? theme.primary 
                  : theme.textSecondary,
              },
            ]}
          >
            Weight
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'activity' && [
              styles.activeTab,
              { borderColor: theme.primary },
            ],
          ]}
          onPress={() => setActiveTab('activity')}
        >
          <Icon 
            name="run" 
            size={18} 
            color={activeTab === 'activity' ? theme.primary : theme.textSecondary} 
          />
          <Text 
            style={[
              styles.tabText, 
              { 
                color: activeTab === 'activity' 
                  ? theme.primary 
                  : theme.textSecondary,
              },
            ]}
          >
            Activity
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.periodSelector}>
        <Text style={[styles.periodText, { color: theme.text }]}>
          {getPeriodText()}
        </Text>
        
        <View style={styles.periodButtons}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              activePeriod === 'week' && [
                styles.activePeriodButton,
                { backgroundColor: `${theme.primary}20` },
              ],
            ]}
            onPress={() => setActivePeriod('week')}
          >
            <Text 
              style={[
                styles.periodButtonText,
                { 
                  color: activePeriod === 'week' 
                    ? theme.primary 
                    : theme.textSecondary,
                },
              ]}
            >
              W
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.periodButton,
              activePeriod === 'month' && [
                styles.activePeriodButton,
                { backgroundColor: `${theme.primary}20` },
              ],
            ]}
            onPress={() => setActivePeriod('month')}
          >
            <Text 
              style={[
                styles.periodButtonText,
                { 
                  color: activePeriod === 'month' 
                    ? theme.primary 
                    : theme.textSecondary,
                },
              ]}
            >
              M
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.periodButton,
              activePeriod === 'year' && [
                styles.activePeriodButton,
                { backgroundColor: `${theme.primary}20` },
              ],
            ]}
            onPress={() => setActivePeriod('year')}
          >
            <Text 
              style={[
                styles.periodButtonText,
                { 
                  color: activePeriod === 'year' 
                    ? theme.primary 
                    : theme.textSecondary,
                },
              ]}
            >
              Y
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        {activeTab === 'nutrition' && (
          <>
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Daily Calories
              </Text>
              <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                Average: {
                  Math.round(
                    MOCK_NUTRITION_DATA.reduce((sum, item) => sum + item.calories, 0) / 
                    MOCK_NUTRITION_DATA.length
                  )
                } kcal
              </Text>
              
              <BarChart data={MOCK_NUTRITION_DATA} />
            </View>
            
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Nutrient Breakdown
              </Text>
              <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                Average daily consumption
              </Text>
              
              {Object.entries(MOCK_NUTRIENT_BREAKDOWN).map(([nutrient, data]) => (
                <NutrientProgressBar
                  key={nutrient}
                  label={nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}
                  value={data.value}
                  goal={data.goal}
                  unit={data.unit}
                  color={getNutrientColor(nutrient)}
                />
              ))}
            </View>
          </>
        )}
        
        {activeTab === 'weight' && (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Weight Trend
            </Text>
            <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
              Starting: {MOCK_WEIGHT_DATA[0].weight} kg • 
              Current: {MOCK_WEIGHT_DATA[MOCK_WEIGHT_DATA.length - 1].weight} kg
            </Text>
            
            <LineChart data={MOCK_WEIGHT_DATA} />
            
            <View style={styles.weightSummary}>
              <View style={styles.weightSummaryItem}>
                <Text style={[styles.weightChangeValue, { color: theme.success }]}>
                  -3.5 kg
                </Text>
                <Text style={[styles.weightChangeLabel, { color: theme.textSecondary }]}>
                  Total Change
                </Text>
              </View>
              
              <View style={styles.weightSummaryItem}>
                <Text style={[styles.weightChangeValue, { color: theme.success }]}>
                  -0.5 kg
                </Text>
                <Text style={[styles.weightChangeLabel, { color: theme.textSecondary }]}>
                  Weekly Avg
                </Text>
              </View>
              
              <View style={styles.weightSummaryItem}>
                <Text style={[styles.weightChangeValue, { color: theme.text }]}>
                  24.9
                </Text>
                <Text style={[styles.weightChangeLabel, { color: theme.textSecondary }]}>
                  Current BMI
                </Text>
              </View>
            </View>
          </View>
        )}
        
        {activeTab === 'activity' && (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Activity data is coming soon
            </Text>
            <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
              We're working on activity tracking features
            </Text>
            
            <View style={styles.emptyStateContainer}>
              <Icon name="run" size={80} color={theme.border} />
              <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
                Activity tracking will be available in the next update
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeTab: {
    borderWidth: 1,
  },
  tabText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  periodText: {
    fontSize: 16,
    fontWeight: '500',
  },
  periodButtons: {
    flexDirection: 'row',
  },
  periodButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginLeft: 8,
  },
  activePeriodButton: {
    borderWidth: 1,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    borderRadius: 12,
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
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 200,
    marginTop: 8,
  },
  yAxisLabels: {
    width: 40,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  yAxisLabel: {
    fontSize: 12,
  },
  chart: {
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  horizontalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    paddingTop: 16,
    paddingBottom: 24,
  },
  barWrapper: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
  },
  barLabelsContainer: {
    flex: 1,
    width: '50%',
    position: 'relative',
  },
  bar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
  },
  barLabel: {
    fontSize: 12,
    marginTop: 8,
  },
  lineChartContainer: {
    flex: 1,
    height: '100%',
    position: 'relative',
    paddingTop: 16,
    paddingBottom: 24,
  },
  lineChart: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 16,
    bottom: 24,
  },
  lineSegment: {
    position: 'absolute',
  },
  dataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: -4,
    marginTop: -4,
    borderWidth: 1,
  },
  xAxisLabels: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 20,
  },
  xAxisLabel: {
    position: 'absolute',
    fontSize: 12,
    transform: [{ translateX: -20 }],
  },
  nutrientProgressBar: {
    marginBottom: 16,
  },
  nutrientLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nutrientLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  nutrientValues: {
    fontSize: 14,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  weightSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  weightSummaryItem: {
    alignItems: 'center',
  },
  weightChangeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  weightChangeLabel: {
    fontSize: 12,
  },
  emptyStateContainer: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
  },
});

export default ReportsScreen; 