# Health Coach App Preview Guide

This guide will help you set up and preview the Health Coach app on your computer.

## Prerequisites

Before you can run the app, make sure you have the following installed:

1. **Node.js** (version 14 or higher)
2. **npm** or **yarn** package manager
3. **Expo CLI** - Install it globally using:
   ```
   npm install -g expo-cli
   ```

## Setting Up the Project

1. First, install all dependencies:
   ```
   npm install
   ```
   or if you use yarn:
   ```
   yarn install
   ```

2. Prepare the assets:
   - Make sure the `assets` directory contains the required files:
     - `icon.png` (App icon)
     - `splash.png` (Splash screen)
     - `adaptive-icon.png` (Android adaptive icon)
     - `favicon.png` (Web favicon)

   If these files are missing, you can temporarily add placeholder images.

## Previewing the App

### Web Preview (Fastest Method)

To preview the app in your web browser:

```
npm run preview
```
or
```
yarn preview
```

This will start the Expo development server and open a web browser with your app running. This is the fastest way to see your app in action.

### Mobile Preview

To preview on a physical device:

1. Install the Expo Go app on your mobile device:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

3. Scan the QR code that appears in your terminal with:
   - iOS: Camera app
   - Android: Expo Go app

### Simulator/Emulator

To run on iOS Simulator (macOS only):
```
npm run ios
```

To run on Android Emulator:
```
npm run android
```

## Troubleshooting

If you encounter any issues:

1. **Missing Modules**: Run `npm install` or `yarn install` again
2. **Type Errors**: These are typically resolved during the build process
3. **Asset Errors**: Create placeholder files in the assets directory
4. **Metro Bundler Issues**: Try clearing the cache with `expo start -c`

## Next Steps

The app is currently using mock data and context providers. To make it fully functional, you would need to:

1. Connect to a backend API or implement a local storage solution
2. Set up proper authentication
3. Implement any missing screens
4. Add actual functionality for food tracking, goals tracking, etc.

Happy coding! 