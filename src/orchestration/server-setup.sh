#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Ensure the script is run as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script with sudo."
  exit 1
fi

echo "--- Updating apt and installing system dependencies ---"
apt-get update
apt-get install -y python3-pip python3-venv speedtest-cli avahi-daemon avahi-utils

# Define our working directories based on the repo location
BASE_DIR="/home/wifi/wifi-testing"
SRC_DIR="$BASE_DIR/src"
VENV_DIR="$BASE_DIR/venv"

echo "--- Setting up Python virtual environment and installing packages ---"
# Create the virtual environment alongside the src directory
python3 -m venv "$VENV_DIR"

# Install FastAPI and Uvicorn inside the virtual environment
"$VENV_DIR/bin/pip" install fastapi uvicorn

echo "--- Setting permissions for the wifi user ---"
# Ensure the wifi user owns the newly created venv
chown -R wifi:wifi "$VENV_DIR"

echo "--- Configuring systemd service ---"
cat << EOF > /etc/systemd/system/speedtest-api.service
[Unit]
Description=Speedtest API Server
After=network.target

[Service]
User=wifi
Group=wifi
WorkingDirectory=$SRC_DIR
# Use the uvicorn installed in the virtual environment
ExecStart=$VENV_DIR/bin/uvicorn server:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

echo "--- Configuring mDNS (Avahi) discovery ---"
cat << 'EOF' > /etc/avahi/services/speedtest.service
<?xml version="1.0" standalone='no'?>
<!DOCTYPE service-group SYSTEM "avahi-service.dtd">
<service-group>
  <name replace-wildcards="yes">Speedtest Node on %h</name>
  <service>
    <type>_speedtest._tcp</type>
    <port>8000</port>
  </service>
</service-group>
EOF

echo "--- Reloading daemons and enabling services ---"
systemctl daemon-reload
systemctl enable --now speedtest-api
systemctl restart avahi-daemon

echo "================================================================"
echo "Setup Complete!"
echo "The API is now running on port 8000 from your repo."
echo "Check the service status with: sudo systemctl status speedtest-api"
echo "================================================================"
