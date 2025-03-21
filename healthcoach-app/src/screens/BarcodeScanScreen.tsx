import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Camera } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../context/ThemeContext';

// Mock food database for development
const FOOD_DATABASE = {
  '737628064502': {
    name: 'Organic Peanut Butter',
    brand: 'Natural Choice',
    servingSize: '2 tbsp (32g)',
    calories: 190,
    protein: 8,
    carbs: 6,
    fat: 16,
    fiber: 2,
    sugar: 1,
  },
  '012000161155': {
    name: 'Whole Grain Bread',
    brand: 'Healthy Grains',
    servingSize: '1 slice (28g)',
    calories: 80,
    protein: 4,
    carbs: 15,
    fat: 1,
    fiber: 3,
    sugar: 2,
  },
};

// Food detail modal
const FoodDetailModal = ({ visible, food, onClose, onAdd }) => {
  const { theme } = useTheme();
  
  if (!food) return null;
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{food.name}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.brandText, { color: theme.textSecondary }]}>{food.brand}</Text>
          <Text style={[styles.servingText, { color: theme.textSecondary }]}>Serving size: {food.servingSize}</Text>
          
          <View style={[styles.nutritionContainer, { borderColor: theme.border }]}>
            <View style={styles.nutritionRow}>
              <Text style={[styles.nutritionLabel, { color: theme.text }]}>Calories</Text>
              <Text style={[styles.nutritionValue, { color: theme.text }]}>{food.calories}</Text>
            </View>
            
            <View style={[styles.separator, { backgroundColor: theme.border }]} />
            
            <View style={styles.nutritionRow}>
              <Text style={[styles.nutritionLabel, { color: theme.text }]}>Protein</Text>
              <Text style={[styles.nutritionValue, { color: theme.text }]}>{food.protein}g</Text>
            </View>
            
            <View style={[styles.separator, { backgroundColor: theme.border }]} />
            
            <View style={styles.nutritionRow}>
              <Text style={[styles.nutritionLabel, { color: theme.text }]}>Carbs</Text>
              <Text style={[styles.nutritionValue, { color: theme.text }]}>{food.carbs}g</Text>
            </View>
            
            <View style={[styles.separator, { backgroundColor: theme.border }]} />
            
            <View style={styles.nutritionRow}>
              <Text style={[styles.nutritionLabel, { color: theme.text }]}>Fat</Text>
              <Text style={[styles.nutritionValue, { color: theme.text }]}>{food.fat}g</Text>
            </View>
            
            <View style={[styles.separator, { backgroundColor: theme.border }]} />
            
            <View style={styles.nutritionRow}>
              <Text style={[styles.nutritionLabel, { color: theme.text }]}>Fiber</Text>
              <Text style={[styles.nutritionValue, { color: theme.text }]}>{food.fiber}g</Text>
            </View>
            
            <View style={[styles.separator, { backgroundColor: theme.border }]} />
            
            <View style={styles.nutritionRow}>
              <Text style={[styles.nutritionLabel, { color: theme.text }]}>Sugar</Text>
              <Text style={[styles.nutritionValue, { color: theme.text }]}>{food.sugar}g</Text>
            </View>
          </View>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.cancelButton, { borderColor: theme.border }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: theme.primary }]}
              onPress={() => onAdd(food)}
            >
              <Text style={styles.addButtonText}>Add to Diary</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const BarcodeScanScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  // Camera and scanner state
  const [hasPermission, setHasPermission] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [scanEnabled, setScanEnabled] = useState(true);
  
  // Food modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [scannedFood, setScannedFood] = useState(null);
  
  // Request camera permissions
  useEffect(() => {
    const getPermission = async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      setHasPermission(cameraPermission === 'authorized');
    };
    
    getPermission();
  }, []);
  
  // Setup barcode scanner
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.EAN_13, BarcodeFormat.UPC_A], {
    checkInverted: true,
  });
  
  // Process barcode results
  useEffect(() => {
    if (barcodes.length > 0 && scanEnabled) {
      if (barcodes[0].displayValue) {
        // Pause scanning
        setScanEnabled(false);
        processBarcode(barcodes[0].displayValue);
      }
    }
  }, [barcodes, scanEnabled]);
  
  // Look up product in database and show modal
  const processBarcode = (barcode) => {
    const food = FOOD_DATABASE[barcode];
    
    if (food) {
      setScannedFood(food);
      setModalVisible(true);
    } else {
      Alert.alert(
        'Product Not Found',
        `No information found for barcode: ${barcode}`,
        [
          { text: 'OK', onPress: () => setScanEnabled(true) }
        ]
      );
    }
  };
  
  // Handle adding food to diary
  const handleAddFood = () => {
    // In a real app, save to food diary
    Alert.alert(
      'Success',
      `${scannedFood.name} added to your food diary`,
      [
        { text: 'OK', onPress: () => {
          setModalVisible(false);
          navigation.goBack();
        }}
      ]
    );
  };
  
  // Handle closing modal without adding
  const handleCloseModal = () => {
    setModalVisible(false);
    setScanEnabled(true);
  };
  
  // Toggle flashlight
  const toggleTorch = () => {
    setTorchOn(!torchOn);
  };
  
  if (!hasPermission) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.permissionContainer}>
          <Icon name="camera-off" size={60} color={theme.error} />
          <Text style={[styles.permissionText, { color: theme.text }]}>
            Camera permission is required to scan barcodes
          </Text>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.permissionButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Camera
        style={styles.camera}
        device={Camera.getAvailableCameraDevices()[0]}
        isActive={true}
        frameProcessor={frameProcessor}
        torch={torchOn ? 'on' : 'off'}
      />
      
      {/* Scan overlay */}
      <View style={styles.overlay}>
        <View style={styles.scannerTargetContainer}>
          <View style={styles.scannerTarget} />
        </View>
        
        <Text style={styles.instructionText}>
          Align the barcode within the frame
        </Text>
        
        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.card }]}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color={theme.text} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.card }]}
            onPress={toggleTorch}
          >
            <Icon 
              name={torchOn ? 'flashlight-off' : 'flashlight'} 
              size={24} 
              color={torchOn ? theme.warning : theme.text} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Food detail modal */}
      <FoodDetailModal
        visible={modalVisible}
        food={scannedFood}
        onClose={handleCloseModal}
        onAdd={handleAddFood}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerTargetContainer: {
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerTarget: {
    width: 200,
    height: 100,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 12,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 24,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  permissionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  brandText: {
    fontSize: 16,
    marginBottom: 8,
  },
  servingText: {
    fontSize: 14,
    marginBottom: 24,
  },
  nutritionContainer: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 24,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  nutritionLabel: {
    fontSize: 16,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: 1,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  addButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default BarcodeScanScreen; 