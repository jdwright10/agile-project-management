#!/bin/bash

# Script to set up git configuration for deployment

# Set git user email
echo "Enter your GitHub email address:"
read email
git config --global user.email "$email"

# Set git user name
echo "Enter your GitHub username:"
read username
git config --global user.name "$username"

echo "Git identity configured successfully!"
echo "Now you can run the following commands to push your code to GitHub:"
echo ""
echo "1. Create a new repository on GitHub at https://github.com/new"
echo "2. Run these commands (replace YOUR_USERNAME and REPO_NAME with your GitHub username and repository name):"
echo ""
echo "   git add ."
echo "   git commit -m \"Initial commit of Agile Project Management app\""
echo "   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git"
echo "   git push -u origin main"
echo ""
echo "3. Configure GitHub Pages in your repository settings to deploy from the main branch" 