import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

// Button sizes
export type ButtonSize = 'small' | 'medium' | 'large';

// Button props interface
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}) => {
  const { theme } = useTheme();
  
  // Get background color based on variant and theme
  const getBackgroundColor = () => {
    if (disabled) return theme.border;
    
    switch (variant) {
      case 'primary':
        return theme.primary;
      case 'secondary':
        return theme.secondary;
      case 'outline':
      case 'ghost':
        return 'transparent';
      case 'danger':
        return theme.error;
      default:
        return theme.primary;
    }
  };
  
  // Get border configuration based on variant
  const getBorder = () => {
    if (variant === 'outline') {
      return {
        borderWidth: 1,
        borderColor: disabled ? theme.border : theme.primary,
      };
    }
    return {};
  };
  
  // Get text color based on variant and theme
  const getTextColor = () => {
    if (disabled) return theme.textSecondary;
    
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return '#FFFFFF';
      case 'outline':
        return theme.primary;
      case 'ghost':
        return theme.primary;
      default:
        return '#FFFFFF';
    }
  };
  
  // Get padding based on size
  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 6, paddingHorizontal: 12 };
      case 'large':
        return { paddingVertical: 14, paddingHorizontal: 24 };
      case 'medium':
      default:
        return { paddingVertical: 10, paddingHorizontal: 16 };
    }
  };
  
  // Get font size based on size
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 18;
      case 'medium':
      default:
        return 16;
    }
  };
  
  return (
    <TouchableOpacity
      onPress={loading ? undefined : onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getPadding(),
        getBorder(),
        {
          backgroundColor: getBackgroundColor(),
          opacity: disabled ? 0.7 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
          style={styles.loadingIndicator}
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: getFontSize(),
                marginLeft: leftIcon ? 8 : 0,
                marginRight: rightIcon ? 8 : 0,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingIndicator: {
    padding: 4,
  },
});

export default Button; 