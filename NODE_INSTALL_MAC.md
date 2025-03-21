# Installing Node.js on macOS

This guide will walk you through installing Node.js on your Mac, which is required to run the Health Coach app.

## Option 1: Using the Official Installer (Simplest)

1. **Visit the Node.js website**:
   - Go to [https://nodejs.org/](https://nodejs.org/)
   - Click on the "LTS" (Long Term Support) version - this is the recommended version for most users

2. **Download and run the installer**:
   - After downloading, open the .pkg file
   - Follow the installation wizard instructions
   - The installer will install Node.js and npm (Node Package Manager)

3. **Verify the installation**:
   - Open Terminal (you can find it in Applications > Utilities > Terminal)
   - Type the following commands and press Enter after each:
     ```
     node -v
     npm -v
     ```
   - You should see version numbers displayed, confirming successful installation

## Option 2: Using Homebrew (For Advanced Users)

If you already have Homebrew installed:

1. Open Terminal
2. Run: `brew install node`
3. Verify with `node -v` and `npm -v`

## After Installing Node.js

Once Node.js is installed, you can run the Health Coach app:

1. Navigate to your project directory in Terminal:
   ```
   cd /path/to/healthcoach-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the app:
   ```
   npm run web
   ```

This should open the app in your default web browser. If it doesn't open automatically, go to http://localhost:19006 in your browser.

## Troubleshooting

- If you get "permission denied" errors when installing packages globally, you may need to use `sudo` before the commands, e.g., `sudo npm install -g expo-cli`
- If Terminal says "command not found: node" after installation, try closing and reopening Terminal, or restart your computer 