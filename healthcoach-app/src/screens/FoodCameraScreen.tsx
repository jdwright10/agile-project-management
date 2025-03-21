import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../context/ThemeContext';

const FoodCameraScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<Camera>(null);

  // Request camera permissions
  useEffect(() => {
    const getPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission',
          'We need camera access to identify your food',
          [
            {
              text: 'Cancel',
              onPress: () => navigation.goBack(),
              style: 'cancel',
            },
            { 
              text: 'OK', 
              onPress: () => navigation.goBack() 
            },
          ]
        );
      }
    };
    
    getPermission();
  }, [navigation]);

  // Handle when the camera is ready
  const handleCameraReady = () => {
    setCameraReady(true);
  };

  // Take a picture
  const takePicture = async () => {
    if (!cameraReady || isCapturing || !cameraRef.current) return;
    
    setIsCapturing(true);
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });
      
      setCapturedImage(photo.uri);
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  // Analyze the captured food image
  const analyzeImage = () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    
    // In a real app, we would send the image to an API for analysis
    // For this demo, we'll simulate a delay and then navigate back with mock data
    setTimeout(() => {
      setIsAnalyzing(false);
      
      // Mock food detection result
      const detectedFood = {
        name: 'Grilled Chicken Salad',
        calories: 320,
        protein: 28,
        carbs: 12,
        fat: 16,
        servingSize: '1 bowl (250g)',
        confidence: 0.89,
      };
      
      navigation.navigate('FoodTrackingMain', { detectedFood });
    }, 2000);
  };

  // Retake picture
  const retakePicture = () => {
    setCapturedImage(null);
  };

  // Render loading state
  if (hasPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  // Render permission denied state
  if (hasPermission === false) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Icon name="camera-off" size={60} color={theme.error} />
        <Text style={[styles.permissionText, { color: theme.text }]}>
          Camera access is required to identify food
        </Text>
        <TouchableOpacity
          style={[styles.permissionButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.permissionButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {!capturedImage ? (
        // Camera view
        <>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={Camera.Constants.Type.back}
            onCameraReady={handleCameraReady}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.cameraGuide}>
                <View 
                  style={[
                    styles.cameraGuideOutline, 
                    { borderColor: theme.primary }
                  ]} 
                />
                <Text style={[styles.cameraGuideText, { color: '#FFFFFF' }]}>
                  Position food in the frame
                </Text>
              </View>
            </View>
          </Camera>
          
          <View style={styles.cameraControls}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Icon name="close" size={28} color={theme.text} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.captureButton,
                {
                  backgroundColor: theme.primary,
                  opacity: cameraReady ? 1 : 0.7,
                },
              ]}
              onPress={takePicture}
              disabled={!cameraReady || isCapturing}
            >
              {isCapturing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>
            
            <View style={styles.controlSpacer} />
          </View>
        </>
      ) : (
        // Image preview
        <>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          
          <View style={styles.previewControls}>
            <TouchableOpacity
              style={[styles.previewButton, { backgroundColor: theme.card }]}
              onPress={retakePicture}
            >
              <Icon name="camera-retake" size={22} color={theme.text} />
              <Text style={[styles.previewButtonText, { color: theme.text }]}>
                Retake
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.previewButton, 
                { 
                  backgroundColor: theme.primary,
                  opacity: isAnalyzing ? 0.7 : 1,
                }
              ]}
              onPress={analyzeImage}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Icon name="check" size={22} color="#FFFFFF" />
                  <Text style={styles.previewButtonText}>Use Photo</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 24,
    paddingHorizontal: 24,
  },
  permissionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraGuide: {
    alignItems: 'center',
  },
  cameraGuideOutline: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderRadius: 16,
    marginBottom: 16,
  },
  cameraGuideText: {
    fontSize: 16,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
  },
  controlSpacer: {
    width: 44,
  },
  previewImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'cover',
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
    width: '100%',
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '45%',
  },
  previewButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default FoodCameraScreen; 