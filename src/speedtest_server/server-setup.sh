#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

# Ensure the script is run as root
if [ "$(id -u)" -ne 0 ]; then
  echo "Please run this script with sudo."
  exit 1
fi

echo "--- Setting up wifi user ---"
if ! id -u wifi >/dev/null 2>&1; then
  useradd -m wifi
  usermod -aG sudo wifi
  echo "wifi user created and added to sudo group."
else
  echo "wifi user already exists."
fi

echo "--- Updating apt and installing system dependencies ---"
apt-get update
# Added git for cloning
apt-get install -y git python3-pip python3-venv speedtest-cli avahi-daemon avahi-utils

BASE_DIR="/home/wifi/wifi-testing"
SRC_DIR="$BASE_DIR/src"
VENV_DIR="$BASE_DIR/venv"

echo "--- Setting up repository ---"
if [ ! -d "$BASE_DIR" ]; then
  # run as wifi user
  sudo -u wifi git clone https://github.com/valault1/wifi-testing "$BASE_DIR"
else
  echo "Repository already exists at $BASE_DIR, pulling latest changes."
  sudo -u wifi sh -c "cd $BASE_DIR && git pull"
fi

echo "--- Setting up Python virtual environment ---"
if [ ! -d "$VENV_DIR" ]; then
  sudo -u wifi python3 -m venv "$VENV_DIR"
fi

echo "--- Configuring systemd service ---"
cat << EOF > /etc/systemd/system/speedtest-api.service
[Unit]
Description=Speedtest API Server
After=network.target

[Service]
User=wifi
Group=wifi
WorkingDirectory=$BASE_DIR
# Use the python binary in the virtual environment to run the server
ExecStart=$VENV_DIR/bin/python src/speedtest_server/server.py
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
    <port>8081</port>
  </service>
</service-group>
EOF

echo "--- Reloading daemons and enabling services ---"
systemctl daemon-reload
systemctl enable --now speedtest-api
systemctl restart avahi-daemon

echo "================================================================"
echo "Setup Complete!"
echo "The API is now running on port 8081 from $BASE_DIR."
echo "Check the service status with: sudo systemctl status speedtest-api"
echo "================================================================"
