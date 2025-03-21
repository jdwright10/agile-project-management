#!/bin/bash

# Preview script for the Health Coach app

echo "==============================================="
echo "       HEALTH COACH APP PREVIEW SETUP         "
echo "==============================================="

# We're already in the healthcoach-app directory, no need to change

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Check if Expo CLI is installed
if ! command -v expo &> /dev/null; then
    echo "Installing Expo CLI globally..."
    npm install -g expo-cli
fi

# Install dependencies
echo "Installing project dependencies..."
npm install

# Start the app in web mode
echo "Starting the app preview in web mode..."
echo "If a browser window doesn't open automatically, navigate to http://localhost:19006"
echo "==============================================="
npm run web

exit 0 