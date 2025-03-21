import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { UserGoal } from '../context/UserContext';
import Button from '../components/Button';
import TextInput from '../components/TextInput';

// Goal type icons
const GOAL_TYPE_ICONS: Record<string, string> = {
  weight: 'scale',
  nutrition: 'food-apple',
  fitness: 'run',
  sleep: 'sleep',
  hydration: 'cup-water',
};

const GoalItem = ({ goal, onEdit, onDelete }: { goal: UserGoal; onEdit: (goal: UserGoal) => void; onDelete: (goalId: string) => void }) => {
  const { theme } = useTheme();
  const progress = Math.min(100, (goal.current / goal.target) * 100);
  
  // Format date to display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  return (
    <View style={[styles.goalCard, { backgroundColor: theme.card }]}>
      <View style={styles.goalHeader}>
        <View style={styles.goalTypeContainer}>
          <View style={[styles.iconContainer, { backgroundColor: `${theme.primary}20` }]}>
            <Icon 
              name={GOAL_TYPE_ICONS[goal.type] || 'star'} 
              size={20} 
              color={theme.primary} 
            />
          </View>
          <Text style={[styles.goalType, { color: theme.text }]}>
            {goal.title || goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}
          </Text>
        </View>
        
        <View style={styles.goalActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(goal)}>
            <Icon name="pencil" size={18} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => onDelete(goal.id)}>
            <Icon name="delete" size={18} color={theme.error} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.goalContent}>
        <View style={styles.goalDetails}>
          <Text style={[styles.goalValueText, { color: theme.text }]}>
            {goal.current} / {goal.target} {goal.unit}
          </Text>
          <Text style={[styles.dateText, { color: theme.textSecondary }]}>
            By {formatDate(goal.targetDate)}
          </Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: goal.completed ? theme.success : theme.primary,
                  width: `${progress}%` 
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: theme.textSecondary }]}>
            {Math.round(progress)}% complete
          </Text>
        </View>
      </View>
    </View>
  );
};

const GoalFormModal = ({ 
  visible, 
  onClose, 
  onSave, 
  editingGoal 
}: { 
  visible: boolean; 
  onClose: () => void; 
  onSave: (goal: Omit<UserGoal, 'id'>) => void; 
  editingGoal: UserGoal | null;
}) => {
  const { theme } = useTheme();
  const [title, setTitle] = useState(editingGoal?.title || '');
  const [type, setType] = useState<'weight' | 'nutrition' | 'fitness' | 'sleep' | 'hydration'>(
    editingGoal?.type || 'weight'
  );
  const [target, setTarget] = useState(editingGoal?.target.toString() || '');
  const [current, setCurrent] = useState(editingGoal?.current.toString() || '');
  const [unit, setUnit] = useState(editingGoal?.unit || 'kg');
  const [targetDate, setTargetDate] = useState(editingGoal?.targetDate || new Date().toISOString().split('T')[0]);
  
  const types = [
    { label: 'Weight', value: 'weight', icon: 'scale' },
    { label: 'Nutrition', value: 'nutrition', icon: 'food-apple' },
    { label: 'Fitness', value: 'fitness', icon: 'run' },
    { label: 'Sleep', value: 'sleep', icon: 'sleep' },
    { label: 'Hydration', value: 'hydration', icon: 'cup-water' },
  ];
  
  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a goal title');
      return;
    }
    
    if (!target || !current) {
      Alert.alert('Error', 'Please enter target and current values');
      return;
    }
    
    const goalData = {
      title,
      type,
      target: parseFloat(target),
      current: parseFloat(current),
      unit,
      startDate: editingGoal?.startDate || new Date().toISOString(),
      targetDate,
      completed: parseFloat(current) >= parseFloat(target),
    };
    
    onSave(goalData);
    resetForm();
  };
  
  const resetForm = () => {
    setTitle('');
    setType('weight');
    setTarget('');
    setCurrent('');
    setUnit('kg');
    setTargetDate(new Date().toISOString().split('T')[0]);
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {editingGoal ? 'Edit Goal' : 'Add New Goal'}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.formContainer}>
            <TextInput
              label="Goal Title"
              value={title}
              onChangeText={setTitle}
              leftIcon="trophy"
            />
            
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Goal Type</Text>
            <View style={styles.typeSelector}>
              {types.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.typeItem,
                    {
                      backgroundColor: type === item.value 
                        ? `${theme.primary}20` 
                        : theme.card,
                      borderColor: type === item.value 
                        ? theme.primary 
                        : theme.border,
                    },
                  ]}
                  onPress={() => setType(item.value as any)}
                >
                  <Icon 
                    name={item.icon} 
                    size={20} 
                    color={type === item.value ? theme.primary : theme.textSecondary} 
                  />
                  <Text 
                    style={[
                      styles.typeText, 
                      { 
                        color: type === item.value 
                          ? theme.primary 
                          : theme.text 
                      }
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <TextInput
                  label="Target"
                  value={target}
                  onChangeText={setTarget}
                  keyboardType="numeric"
                  leftIcon="target"
                />
              </View>
              <View style={styles.inputHalf}>
                <TextInput
                  label="Current"
                  value={current}
                  onChangeText={setCurrent}
                  keyboardType="numeric"
                  leftIcon="arrow-right"
                />
              </View>
            </View>
            
            <TextInput
              label="Unit"
              value={unit}
              onChangeText={setUnit}
              leftIcon="scale"
            />
            
            <TextInput
              label="Target Date"
              value={targetDate}
              onChangeText={setTargetDate}
              leftIcon="calendar"
              placeholder="YYYY-MM-DD"
            />
            
            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={onClose}
                variant="outline"
                style={styles.buttonCancel}
              />
              <Button
                title="Save"
                onPress={handleSave}
                variant="primary"
                style={styles.buttonSave}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const GoalsScreen = () => {
  const { theme } = useTheme();
  const { user, addGoal, updateGoal, deleteGoal } = useUser();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<UserGoal | null>(null);
  
  const handleAddGoal = () => {
    setEditingGoal(null);
    setModalVisible(true);
  };
  
  const handleEditGoal = (goal: UserGoal) => {
    setEditingGoal(goal);
    setModalVisible(true);
  };
  
  const handleDeleteGoal = (goalId: string) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteGoal(goalId);
          },
        },
      ],
    );
  };
  
  const handleSaveGoal = async (goalData: Omit<UserGoal, 'id'>) => {
    try {
      if (editingGoal) {
        await updateGoal(editingGoal.id, goalData);
      } else {
        await addGoal(goalData);
      }
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save goal');
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Goals</Text>
        <View style={styles.headerRight} />
      </View>
      
      {user?.goals && user.goals.length > 0 ? (
        <ScrollView style={styles.content}>
          {user.goals.map((goal) => (
            <GoalItem
              key={goal.id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
            />
          ))}
          <View style={styles.spacer} />
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="trophy-outline" size={80} color={theme.border} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No Goals Yet
          </Text>
          <Text style={[styles.emptyDescription, { color: theme.textSecondary }]}>
            Set your first health goal to start tracking your progress
          </Text>
        </View>
      )}
      
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.primary }]}
          onPress={handleAddGoal}
        >
          <Icon name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <GoalFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveGoal}
        editingGoal={editingGoal}
      />
    </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  goalCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  goalType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  goalContent: {
    marginTop: 8,
  },
  goalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalValueText: {
    fontSize: 18,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 14,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  fabContainer: {
    position: 'absolute',
    right: 24,
    bottom: 24,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingBottom: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  formContainer: {
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  typeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  typeText: {
    marginLeft: 8,
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  buttonCancel: {
    flex: 1,
    marginRight: 8,
  },
  buttonSave: {
    flex: 1,
    marginLeft: 8,
  },
  spacer: {
    height: 80,
  },
});

export default GoalsScreen; 