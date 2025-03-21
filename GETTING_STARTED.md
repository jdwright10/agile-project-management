# Getting Started with Health Coach App

This guide will help you set up your environment and run the Health Coach app.

## Installing Node.js and npm

Before you can run the app, you need to install Node.js and npm (Node Package Manager):

### On macOS:

1. **Using Homebrew (recommended):**
   
   If you don't have Homebrew installed, install it first:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
   
   Then install Node.js:
   ```bash
   brew install node
   ```

2. **Using the Installer:**
   
   Alternatively, download and install from the [Node.js website](https://nodejs.org/). 
   Choose the LTS (Long Term Support) version for better stability.

3. **Verify the installation:**
   ```bash
   node -v
   npm -v
   ```
   
   You should see version numbers displayed for both commands.

## Setting Up the Project

Once Node.js and npm are installed:

1. **Install Expo CLI globally:**
   ```bash
   npm install -g expo-cli
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```
   
   This will install all the required packages defined in package.json.

3. **Create placeholder asset files:**
   
   Make sure the assets directory exists with placeholder files:
   ```bash
   mkdir -p assets
   touch assets/icon.png assets/splash.png assets/adaptive-icon.png assets/favicon.png
   ```

## Running the App

Now you can start the app in different modes:

### Web Mode (Easiest for Preview)

```bash
npm run web
```

This should open a web browser with the app running. If it doesn't open automatically, navigate to http://localhost:19006.

### iOS Simulator (macOS only)

You need Xcode installed. Then run:
```bash
npm run ios
```

### Android Emulator

You need Android Studio installed with an emulator configured. Then run:
```bash
npm run android
```

## Troubleshooting

### Common Issues:

1. **"Command not found: expo"**
   
   Try reinstalling Expo CLI:
   ```bash
   npm install -g expo-cli
   ```
   
   If you're using macOS or Linux, you might need to use sudo:
   ```bash
   sudo npm install -g expo-cli
   ```

2. **Missing dependencies**
   
   If you get errors about missing modules:
   ```bash
   npm install
   ```

3. **Port already in use**
   
   If port 19006 is already in use, try:
   ```bash
   npx expo start --port 19007 --web
   ```

4. **Module resolution errors**
   
   Clear the Metro bundler cache:
   ```bash
   npx expo start -c
   ```

## Next Steps

After successfully running the app, you might want to:

1. Explore the different screens of the application
2. Check out the code structure in the src directory
3. Make modifications to customize the app for your needs 