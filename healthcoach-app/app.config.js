export default {
  name: 'Health Coach',
  slug: 'healthcoach-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#4CAF50'
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.yourcompany.healthcoach'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#4CAF50'
    },
    package: 'com.yourcompany.healthcoach'
  },
  web: {
    favicon: './assets/favicon.png'
  },
  extra: {
    eas: {
      projectId: 'your-project-id'
    }
  },
  permissions: [
    'CAMERA',
    'AUDIO_RECORDING',
    'LOCATION',
    'WRITE_EXTERNAL_STORAGE',
    'READ_EXTERNAL_STORAGE'
  ]
}; 