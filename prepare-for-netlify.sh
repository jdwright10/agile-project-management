#!/bin/bash

# Script to prepare your Agile Project Management app for Netlify Drop

echo "Preparing your project for Netlify Drop..."
echo "----------------------------------------"

# Create a temporary directory for the files to include
mkdir -p netlify-upload

# Copy only the necessary files (excluding git, temp files, etc.)
echo "Copying essential files..."
cp -r index.html src netlify-upload/
cp .nojekyll netlify-upload/

# Create a zip file
echo "Creating zip file..."
cd netlify-upload
zip -r ../agile-project-management.zip .
cd ..

# Clean up
echo "Cleaning up..."
rm -rf netlify-upload

echo ""
echo "Success! Your project is ready for Netlify Drop."
echo ""
echo "To deploy your app:"
echo "1. Go to https://app.netlify.com/drop"
echo "2. Drag and drop the 'agile-project-management.zip' file onto the drop area"
echo "3. Wait a few seconds for deployment to complete"
echo "4. Your site will be live at the URL shown on the Netlify page!"
echo ""
echo "The zip file is located at: $(pwd)/agile-project-management.zip" 