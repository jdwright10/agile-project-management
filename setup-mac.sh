#!/bin/bash

# Health Coach App Setup Script for macOS

echo "==============================================="
echo "       HEALTH COACH APP SETUP ASSISTANT       "
echo "==============================================="

# First, change to the correct directory
if [ -d "healthcoach-app" ]; then
    echo "✅ Found Health Coach app directory"
    cd healthcoach-app || exit 1
    echo "✅ Changed to app directory: $(pwd)"
else
    echo "❌ Could not find 'healthcoach-app' directory in the current location"
    echo "Please make sure you run this script from the project root directory"
    exit 1
fi

# Check if Node.js is installed
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js is already installed (version: $NODE_VERSION)"
else
    echo "❌ Node.js is not installed on your system"
    echo "Opening Node.js download page in your browser..."
    open "https://nodejs.org/"
    
    echo ""
    echo "Please follow these steps:"
    echo "1. Download the LTS version from the website"
    echo "2. Run the installer and follow the instructions"
    echo "3. After installation completes, close this terminal and run this script again"
    
    exit 1
fi

# Check if npm is installed
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "✅ npm is already installed (version: $NPM_VERSION)"
else
    echo "❌ npm is not installed correctly"
    echo "Please reinstall Node.js which should include npm"
    open "https://nodejs.org/"
    exit 1
fi

# Ask if user wants to continue with app setup
echo ""
echo "Would you like to set up and run the Health Coach app now? (y/n)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    # Create assets directory if it doesn't exist
    if [ ! -d "assets" ]; then
        echo "Creating assets directory with placeholder files..."
        mkdir -p assets
        touch assets/icon.png assets/splash.png assets/adaptive-icon.png assets/favicon.png
    fi
    
    # Install dependencies
    echo ""
    echo "Installing project dependencies (this may take a few minutes)..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Error installing dependencies. Please try running 'npm install' manually."
        exit 1
    fi
    
    echo ""
    echo "✅ Dependencies installed successfully!"
    
    # Install Expo CLI globally if not already installed
    if ! command -v expo &> /dev/null; then
        echo "Installing Expo CLI globally..."
        npm install -g expo-cli
    fi
    
    # Start the app
    echo ""
    echo "Starting the Health Coach app in web mode..."
    echo "If a browser doesn't open automatically, navigate to http://localhost:19006"
    echo "==============================================="
    npm run web
else
    echo ""
    echo "Setup canceled. Run this script again when you're ready to set up the app."
    exit 0
fi 