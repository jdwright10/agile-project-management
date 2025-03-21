import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps as RNTextInputProps,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Input types
export type InputVariant = 'outlined' | 'filled' | 'underlined';

// Input props interface
export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: InputVariant;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  helperTextStyle?: TextStyle;
  errorTextStyle?: TextStyle;
  secureTextEntry?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  helperText,
  variant = 'outlined',
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  labelStyle,
  inputStyle,
  helperTextStyle,
  errorTextStyle,
  secureTextEntry,
  ...rest
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  // Handle focus events
  const handleFocus = () => {
    setIsFocused(true);
    if (rest.onFocus) {
      rest.onFocus(undefined as any);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (rest.onBlur) {
      rest.onBlur(undefined as any);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Get container style based on variant
  const getContainerStyle = () => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: error
            ? `${theme.error}20`
            : isFocused
            ? `${theme.primary}10`
            : `${theme.textSecondary}10`,
          borderWidth: 0,
        };
      case 'underlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
          borderBottomWidth: 1,
          borderRadius: 0,
          borderColor: error
            ? theme.error
            : isFocused
            ? theme.primary
            : theme.border,
        };
      case 'outlined':
      default:
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: error
            ? theme.error
            : isFocused
            ? theme.primary
            : theme.border,
        };
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: error
                ? theme.error
                : isFocused
                ? theme.primary
                : theme.textSecondary,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          getContainerStyle(),
          {
            borderColor: error
              ? theme.error
              : isFocused
              ? theme.primary
              : theme.border,
          },
        ]}
      >
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={20}
            color={
              error
                ? theme.error
                : isFocused
                ? theme.primary
                : theme.textSecondary
            }
            style={styles.leftIcon}
          />
        )}

        <RNTextInput
          style={[
            styles.input,
            {
              color: theme.text,
            },
            inputStyle,
          ]}
          placeholderTextColor={theme.textSecondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...rest}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.rightIcon}
          >
            <Icon
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={styles.rightIcon}
          >
            <Icon
              name={rightIcon}
              size={20}
              color={
                error
                  ? theme.error
                  : isFocused
                  ? theme.primary
                  : theme.textSecondary
              }
            />
          </TouchableOpacity>
        )}
      </View>

      {(error || helperText) && (
        <Text
          style={[
            styles.helperText,
            {
              color: error ? theme.error : theme.textSecondary,
            },
            error ? errorTextStyle : helperTextStyle,
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  leftIcon: {
    marginLeft: 12,
  },
  rightIcon: {
    padding: 8,
    marginRight: 4,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default TextInput; 