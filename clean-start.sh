#!/bin/bash

# Clean Start Script for Health Coach App

echo "==============================================="
echo "       HEALTH COACH APP CLEAN START           "
echo "==============================================="

# Kill any running Node.js processes
echo "Stopping any running Node.js processes..."
killall node 2>/dev/null || true
sleep 2

# Change to the app directory
echo "Navigating to the Health Coach app directory..."
cd /Users/jasonwright/project-management/healthcoach-app || exit 1

# Fix package versions
echo "Installing correct package versions..."
npx expo install @react-native-async-storage/async-storage@1.18.2 react-native@0.72.10

# Install web dependencies if needed
echo "Ensuring web dependencies are installed..."
npx expo install react-native-web@~0.19.6 react-dom@18.2.0 @expo/webpack-config@^19.0.0

# Clear the cache and start with a fresh build
echo "Starting the app with a clean cache..."
echo "If a browser doesn't open automatically, please navigate to http://localhost:19006"
echo "==============================================="

# Start with a clean cache
npx expo start --clear --web

exit 0 