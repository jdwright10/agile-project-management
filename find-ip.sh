#!/bin/bash

# Script to find your local IP address for sharing with others on the same network

echo "Finding your local IP address..."
echo "---------------------------------------"

# For macOS
if [[ "$(uname)" == "Darwin" ]]; then
    echo "Your local IP addresses:"
    ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}'
    
    echo ""
    echo "To share your app on the local network:"
    echo "1. Run the HTTP server with: python3 -m http.server"
    echo "2. Share this URL with others on your network: http://YOUR_IP:8000"
    echo "   (Replace YOUR_IP with one of the addresses above)"
    
# For Linux
elif [[ "$(uname)" == "Linux" ]]; then
    echo "Your local IP addresses:"
    hostname -I
    
    echo ""
    echo "To share your app on the local network:"
    echo "1. Run the HTTP server with: python3 -m http.server"
    echo "2. Share this URL with others on your network: http://YOUR_IP:8000"
    echo "   (Replace YOUR_IP with one of the addresses above)"

# For Windows
else
    echo "On Windows, you can find your IP address by running:"
    echo "ipconfig in Command Prompt or PowerShell"
    
    echo ""
    echo "To share your app on the local network:"
    echo "1. Run the HTTP server with: python -m http.server"
    echo "2. Share this URL with others on your network: http://YOUR_IP:8000"
    echo "   (Replace YOUR_IP with your IPv4 address)"
fi

echo ""
echo "Note: Both your device and others' devices must be on the same network"
echo "for local network sharing to work." 