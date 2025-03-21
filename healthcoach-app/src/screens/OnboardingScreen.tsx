import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/MainNavigator';
import Button from '../components/Button';

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: any;
  icon: string;
}

// Sample onboarding slides
const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Welcome to HealthCoach',
    description: 'Your personal health and nutrition companion for a healthier lifestyle.',
    image: require('../assets/icon.png'),
    icon: 'heart-pulse',
  },
  {
    id: '2',
    title: 'Track Your Nutrition',
    description: 'Log meals, scan barcodes, and track your daily nutrient intake with ease.',
    image: require('../assets/icon.png'),
    icon: 'food-apple',
  },
  {
    id: '3',
    title: 'Personalized AI Coach',
    description: 'Get personalized recommendations and answers to your health questions.',
    image: require('../assets/icon.png'),
    icon: 'head-question',
  },
  {
    id: '4',
    title: 'Track Your Progress',
    description: 'Set goals and track your progress with detailed reports and insights.',
    image: require('../assets/icon.png'),
    icon: 'chart-line',
  },
];

const OnboardingScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate('Signup');
    }
  };

  const scrollToPrevious = () => {
    if (currentIndex > 0) {
      slidesRef.current?.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const renderItem = ({ item }: { item: OnboardingSlide }) => {
    return (
      <View style={[styles.slide, { width }]}>
        <View style={[styles.imageContainer, { backgroundColor: `${theme.primary}20` }]}>
          <Icon name={item.icon} size={80} color={theme.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.skipContainer}>
        {currentIndex > 0 && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={scrollToPrevious}
          >
            <Icon name="chevron-left" size={24} color={theme.text} />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={[styles.skipText, { color: theme.primary }]}>
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={ONBOARDING_SLIDES}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />

      <View style={styles.indicatorContainer}>
        {ONBOARDING_SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor:
                  index === currentIndex ? theme.primary : theme.border,
                width: index === currentIndex ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={currentIndex === ONBOARDING_SLIDES.length - 1 ? "Get Started" : "Next"}
          onPress={scrollToNext}
          variant="primary"
          size="large"
          style={styles.button}
        />
        
        {currentIndex === ONBOARDING_SLIDES.length - 1 && (
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: theme.textSecondary }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.loginLink, { color: theme.primary }]}> Sign In</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  backButton: {
    padding: 8,
  },
  skipButton: {
    padding: 8,
    marginLeft: 'auto',
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  image: {
    width: 120,
    height: 120,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 40,
  },
  indicator: {
    height: 8,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  button: {
    height: 56,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen; 