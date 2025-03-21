/**
 * Nutrition calculation utilities for the Health Coach app.
 * These functions help calculate various health and nutrition metrics.
 */

/**
 * Calculate Basal Metabolic Rate (BMR) using the Mifflin-St Jeor Equation
 * BMR represents the calories your body needs at complete rest
 * 
 * @param weight Weight in kilograms
 * @param height Height in centimeters
 * @param age Age in years
 * @param gender 'male' or 'female'
 * @returns BMR in calories per day
 */
export const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female'
): number => {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

/**
 * Activity level multipliers for Total Daily Energy Expenditure (TDEE) calculation
 */
export enum ActivityLevel {
  Sedentary = 1.2, // Little or no exercise
  LightlyActive = 1.375, // Light exercise/sports 1-3 days/week
  ModeratelyActive = 1.55, // Moderate exercise/sports 3-5 days/week
  VeryActive = 1.725, // Hard exercise/sports 6-7 days/week
  ExtremelyActive = 1.9, // Very hard exercise, physical job or training twice a day
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 * TDEE represents the total calories burned in a day including activity
 * 
 * @param bmr Basal Metabolic Rate in calories
 * @param activityLevel Activity level multiplier
 * @returns TDEE in calories per day
 */
export const calculateTDEE = (bmr: number, activityLevel: ActivityLevel): number => {
  return Math.round(bmr * activityLevel);
};

/**
 * Calculate daily calorie target based on goals
 * 
 * @param tdee Total Daily Energy Expenditure
 * @param goal 'lose', 'maintain', or 'gain' weight
 * @param intensity 'mild', 'moderate', or 'aggressive' (determines deficit/surplus)
 * @returns Daily calorie target
 */
export const calculateCalorieTarget = (
  tdee: number,
  goal: 'lose' | 'maintain' | 'gain',
  intensity: 'mild' | 'moderate' | 'aggressive' = 'moderate'
): number => {
  // No adjustment for maintenance
  if (goal === 'maintain') {
    return tdee;
  }
  
  // Define deficits/surpluses for different intensities (calories per day)
  let adjustment: number;
  
  if (goal === 'lose') {
    switch (intensity) {
      case 'mild':
        adjustment = -250;
        break;
      case 'moderate':
        adjustment = -500;
        break;
      case 'aggressive':
        adjustment = -750;
        break;
      default:
        adjustment = -500;
    }
  } else { // gain
    switch (intensity) {
      case 'mild':
        adjustment = 250;
        break;
      case 'moderate':
        adjustment = 500;
        break;
      case 'aggressive':
        adjustment = 750;
        break;
      default:
        adjustment = 500;
    }
  }
  
  // Apply adjustment and ensure we don't go below safe minimum
  const target = tdee + adjustment;
  
  // Safety minimums to ensure nutritional adequacy
  const safetyMinimum = 1200; // Most nutritionists don't recommend below this
  
  return Math.max(safetyMinimum, target);
};

/**
 * Calculate recommended macronutrient breakdown based on calorie target
 * 
 * @param calorieTarget Daily calorie target
 * @param dietType Type of diet that influences macro ratios
 * @param customRatio Optional custom protein/carbs/fat ratio (must sum to 100)
 * @returns Object with daily grams of protein, carbs, and fat
 */
export const calculateMacros = (
  calorieTarget: number,
  dietType: 'balanced' | 'lowCarb' | 'highProtein' | 'keto' | 'custom',
  customRatio?: { protein: number; carbs: number; fat: number }
): { protein: number; carbs: number; fat: number } => {
  // Macronutrient ratios by diet type (protein/carbs/fat percentages)
  let proteinPct: number;
  let carbsPct: number;
  let fatPct: number;
  
  switch (dietType) {
    case 'balanced':
      proteinPct = 30;
      carbsPct = 40;
      fatPct = 30;
      break;
    case 'lowCarb':
      proteinPct = 40;
      carbsPct = 20;
      fatPct = 40;
      break;
    case 'highProtein':
      proteinPct = 40;
      carbsPct = 30;
      fatPct = 30;
      break;
    case 'keto':
      proteinPct = 25;
      carbsPct = 5;
      fatPct = 70;
      break;
    case 'custom':
      if (customRatio) {
        // Ensure custom ratios sum to 100%
        const sum = customRatio.protein + customRatio.carbs + customRatio.fat;
        if (Math.abs(sum - 100) > 0.01) {
          throw new Error('Custom macronutrient ratios must sum to 100%');
        }
        proteinPct = customRatio.protein;
        carbsPct = customRatio.carbs;
        fatPct = customRatio.fat;
      } else {
        // Default to balanced if custom was selected but no ratio provided
        proteinPct = 30;
        carbsPct = 40;
        fatPct = 30;
      }
      break;
    default:
      proteinPct = 30;
      carbsPct = 40;
      fatPct = 30;
  }
  
  // Calculate grams based on percentages and calorie target
  // Protein and carbs have 4 calories per gram, fat has 9 calories per gram
  const proteinCals = calorieTarget * (proteinPct / 100);
  const carbsCals = calorieTarget * (carbsPct / 100);
  const fatCals = calorieTarget * (fatPct / 100);
  
  const proteinGrams = Math.round(proteinCals / 4);
  const carbsGrams = Math.round(carbsCals / 4);
  const fatGrams = Math.round(fatCals / 9);
  
  return {
    protein: proteinGrams,
    carbs: carbsGrams,
    fat: fatGrams,
  };
};

/**
 * Calculate Body Mass Index (BMI)
 * 
 * @param weight Weight in kilograms
 * @param height Height in centimeters
 * @returns BMI value
 */
export const calculateBMI = (weight: number, height: number): number => {
  // Convert height from cm to meters
  const heightInMeters = height / 100;
  
  // BMI formula: weight (kg) / height^2 (m^2)
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

/**
 * Get BMI category description based on BMI value
 * 
 * @param bmi Body Mass Index value
 * @returns String description of BMI category
 */
export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi >= 18.5 && bmi < 25) {
    return 'Normal weight';
  } else if (bmi >= 25 && bmi < 30) {
    return 'Overweight';
  } else if (bmi >= 30 && bmi < 35) {
    return 'Class I Obesity';
  } else if (bmi >= 35 && bmi < 40) {
    return 'Class II Obesity';
  } else {
    return 'Class III Obesity';
  }
};

/**
 * Calculate ideal body weight using the Hamwi formula
 * 
 * @param height Height in centimeters
 * @param gender 'male' or 'female'
 * @returns Ideal body weight in kilograms
 */
export const calculateIdealBodyWeight = (
  height: number,
  gender: 'male' | 'female'
): number => {
  // Convert height from cm to inches for the Hamwi formula
  const heightInInches = height / 2.54;
  
  // Base height is 5 feet (60 inches)
  const inchesOver5Feet = Math.max(0, heightInInches - 60);
  
  let baseWeight: number;
  let weightPerInch: number;
  
  if (gender === 'male') {
    baseWeight = 48; // 48 kg for 5 feet
    weightPerInch = 1.1; // 1.1 kg for each inch over 5 feet
  } else {
    baseWeight = 45.5; // 45.5 kg for 5 feet
    weightPerInch = 0.9; // 0.9 kg for each inch over 5 feet
  }
  
  // Calculate ideal weight
  const idealWeight = baseWeight + (inchesOver5Feet * weightPerInch);
  
  // Round to one decimal place
  return Number(idealWeight.toFixed(1));
};

/**
 * Convert height between different units
 * 
 * @param value Height value to convert
 * @param from Source unit ('cm', 'm', 'ft-in', 'in')
 * @param to Target unit ('cm', 'm', 'ft-in', 'in')
 * @returns Converted height value
 */
export const convertHeight = (
  value: number | string,
  from: 'cm' | 'm' | 'ft-in' | 'in',
  to: 'cm' | 'm' | 'ft-in' | 'in'
): number | string => {
  // Helper function to convert feet-inches string to inches
  const ftInToInches = (ftIn: string): number => {
    const parts = ftIn.split("'").map(part => part.trim());
    const feet = parseFloat(parts[0]);
    const inches = parts[1] ? parseFloat(parts[1]) : 0;
    return feet * 12 + inches;
  };
  
  // Convert input to centimeters first (our base unit)
  let cm: number;
  
  if (from === 'cm') {
    cm = typeof value === 'string' ? parseFloat(value) : value;
  } else if (from === 'm') {
    cm = (typeof value === 'string' ? parseFloat(value) : value) * 100;
  } else if (from === 'ft-in') {
    const inches = ftInToInches(value as string);
    cm = inches * 2.54;
  } else { // inches
    cm = (typeof value === 'string' ? parseFloat(value) : value) * 2.54;
  }
  
  // Convert from cm to target unit
  if (to === 'cm') {
    return Math.round(cm);
  } else if (to === 'm') {
    return Number((cm / 100).toFixed(2));
  } else if (to === 'in') {
    return Math.round(cm / 2.54);
  } else { // ft-in
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  }
};

/**
 * Convert weight between kilograms and pounds
 * 
 * @param value Weight value to convert
 * @param from Source unit ('kg' or 'lb')
 * @param to Target unit ('kg' or 'lb')
 * @returns Converted weight value
 */
export const convertWeight = (
  value: number,
  from: 'kg' | 'lb',
  to: 'kg' | 'lb'
): number => {
  if (from === to) {
    return value;
  }
  
  if (from === 'kg' && to === 'lb') {
    // Convert kg to lb (1 kg = 2.20462 lb)
    return Number((value * 2.20462).toFixed(1));
  } else {
    // Convert lb to kg (1 lb = 0.453592 kg)
    return Number((value * 0.453592).toFixed(1));
  }
}; 