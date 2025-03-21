#!/bin/bash

# Script to start a local HTTP server for the Agile Project Management app

echo "Starting HTTP server for Agile Project Management app..."
echo "-------------------------------------------------------"

# Find local IP address
if [[ "$(uname)" == "Darwin" ]]; then
    # macOS
    LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
elif [[ "$(uname)" == "Linux" ]]; then
    # Linux
    LOCAL_IP=$(hostname -I | awk '{print $1}')
else
    # Windows/Other - just use localhost
    LOCAL_IP="localhost"
fi

echo "Server starting at:"
echo "- Local URL: http://localhost:8000"
if [[ "$LOCAL_IP" != "localhost" ]]; then
    echo "- Network URL: http://$LOCAL_IP:8000 (share this with others on your network)"
fi
echo ""
echo "Press Ctrl+C to stop the server when you're done."
echo ""

# Start the Python HTTP server
python3 -m http.server

# If Python3 fails, try with Python
if [ $? -ne 0 ]; then
    echo "Python3 not found, trying with Python..."
    python -m http.server
fi 