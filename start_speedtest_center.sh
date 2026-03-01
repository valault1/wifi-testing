#!/bin/bash

# Start the Speedtest Center Server and Frontend

# Get directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

echo "Starting Speedtest Center Backend..."
cd "$SCRIPT_DIR/src/speedtest_center/backend"
"$SCRIPT_DIR/venv/bin/python3" server.py &
BACKEND_PID=$!

echo "Starting Speedtest Center Frontend..."
cd "$SCRIPT_DIR/src/speedtest_center/frontend"
npm run dev &
FRONTEND_PID=$!

echo "Both backend and frontend are running."
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Press Ctrl+C to stop both."

# Trap Ctrl+C to kill both background processes
trap "echo 'Shutting down...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM

# Wait for both processes to finish
wait $BACKEND_PID $FRONTEND_PID
