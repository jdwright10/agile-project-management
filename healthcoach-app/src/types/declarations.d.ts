// Module declarations for packages without TypeScript types
declare module 'react' {
  import * as React from 'react';
  export = React;
  export as namespace React;
}

declare module 'react-native' {
  export * from 'react-native';
  export as namespace ReactNative;
}

declare module 'react-native-vector-icons/MaterialCommunityIcons' {
  import { Component } from 'react';
  export default class MaterialCommunityIcons extends Component<any> {
    static getImageSource(name: string, size: number, color: string): Promise<any>;
  }
}

declare module 'react-native-vector-icons/MaterialIcons' {
  import { Component } from 'react';
  export default class MaterialIcons extends Component<any> {
    static getImageSource(name: string, size: number, color: string): Promise<any>;
  }
}

declare module 'react-native-vector-icons/Ionicons' {
  import { Component } from 'react';
  export default class Ionicons extends Component<any> {
    static getImageSource(name: string, size: number, color: string): Promise<any>;
  }
}

declare module 'expo-camera' {
  export * from 'expo-camera';
}

declare module 'vision-camera-code-scanner' {
  export * from 'vision-camera-code-scanner';
}

declare module 'react-native-vision-camera' {
  export * from 'react-native-vision-camera';
}

declare module '@react-navigation/native' {
  export * from '@react-navigation/native';
}

declare module '@react-navigation/stack' {
  export * from '@react-navigation/stack';
}

declare module '@react-navigation/bottom-tabs' {
  export * from '@react-navigation/bottom-tabs';
}

declare module '@react-native-async-storage/async-storage' {
  export * from '@react-native-async-storage/async-storage';
}

declare module 'react/jsx-runtime' {
  export * from 'react/jsx-runtime';
}

// For JSX
declare namespace JSX {
  interface IntrinsicElements {
    // Add any missing elements here
    [elemName: string]: any;
  }
}

// Type declarations for ReactNode
declare namespace React {
  type ReactNode = 
    | React.ReactElement
    | string
    | number
    | boolean
    | null
    | undefined
    | Iterable<React.ReactNode>;
}

// Declare require for asset imports
declare function require(path: string): any;

// Add any other modules that are showing type errors 

// For image assets
declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

declare module '*.jpeg' {
  const content: any;
  export default content;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module 'react-native-safe-area-context' {
  export * from 'react-native-safe-area-context';
}

declare module 'expo-status-bar' {
  import React from 'react';
  export interface StatusBarProps {
    style?: 'auto' | 'inverted' | 'light' | 'dark';
    hidden?: boolean;
  }
  export const StatusBar: React.FC<StatusBarProps>;
} 