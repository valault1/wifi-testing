#!/bin/bash

# ==========================================
# CONFIGURATION
# ==========================================
PING_TARGET="8.8.8.8" 
REPORT_FILE="wifi_speedtest_report.txt"
# ==========================================

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Initialize variables
SPEED_24="0"
SPEED_5="0"
SPEED_6="0"
FREQ_24="N/A"
FREQ_5="N/A"
FREQ_6="N/A"

# --- Cleanup Function ---
cleanup() {
    printf "\n${BLUE}--- Restoration & Cleanup ---${NC}\n"
    if [ ! -z "$CONN_NAME" ]; then
        echo "Resetting '$CONN_NAME' to auto-select bands..."
        nmcli connection modify "$CONN_NAME" wifi.band ""
        nmcli connection up "$CONN_NAME" > /dev/null 2>&1
        printf "${GREEN}✓ Connection restored.${NC}\n"
    fi
}

trap cleanup EXIT INT TERM

# --- Setup ---
printf "${BLUE}--- Detecting Network ---${NC}\n"
INTERFACE=$(nmcli -t -f DEVICE,TYPE device | grep :wifi | cut -d: -f1 | head -n 1)
CONN_NAME=$(nmcli -t -f NAME,DEVICE connection show --active | grep ":$INTERFACE" | cut -d: -f1)

if [ -z "$CONN_NAME" ]; then
    printf "${RED}Error: No active Wi-Fi connection found.${NC}\n"
    exit 1
fi

echo "Interface: $INTERFACE"
echo "Connection Profile: $CONN_NAME"
echo "Checking Speedtest version..."

# --- Improved Tool Detection ---
if command -v speedtest &> /dev/null; then
    # Run version check to see if it is Ookla or Python
    VERSION_OUT=$(speedtest --version 2>&1)
    if echo "$VERSION_OUT" | grep -q "Ookla"; then
        # Official Ookla Binary
        ST_CMD="speedtest --accept-license --accept-gdpr"
        echo "Tool Detected: Official Ookla Speedtest"
    else
        # Python speedtest-cli (installed as 'speedtest')
        ST_CMD="speedtest --simple"
        echo "Tool Detected: Python speedtest-cli"
    fi
elif command -v speedtest-cli &> /dev/null; then
    # Python speedtest-cli (explicit command)
    ST_CMD="speedtest-cli --simple"
    echo "Tool Detected: Python speedtest-cli"
else
    printf "${RED}Error: Neither 'speedtest' nor 'speedtest-cli' found. Please install one.${NC}\n"
    exit 1
fi

# Prepare Report File
echo "Wi-Fi Internet Speed Report" > "$REPORT_FILE"
echo "Date: $(date)" >> "$REPORT_FILE"
echo "Ping Target: $PING_TARGET" >> "$REPORT_FILE"
echo "Tool Used: $ST_CMD" >> "$REPORT_FILE"
echo "---------------------------------------------------" >> "$REPORT_FILE"

# --- Benchmark Function ---
run_test() {
    BAND_CODE=$1
    BAND_LABEL=$2
    
    printf "\n${BLUE}--- Testing $BAND_LABEL ($BAND_CODE) ---${NC}\n"
    
    # 1. Configure Band
    echo "Switching to $BAND_LABEL..."
    nmcli connection modify "$CONN_NAME" wifi.band "$BAND_CODE"
    nmcli connection up "$CONN_NAME" > /dev/null 2>&1
    echo "Waiting 5s for driver to stabilize..."
    sleep 5

    # 2. CAPTURE & VALIDATE:
    BITRATE=$(iw dev "$INTERFACE" link | grep -oP 'tx bitrate: \K[0-9.]+')
    echo "Initial Link Speed: $BITRATE MBit/s"
    
    echo "Waiting for internet connection ($PING_TARGET)..."
    MAX_RETRIES=30
    COUNT=0
    
    while ! ping -c 1 -W 1 "$PING_TARGET" > /dev/null 2>&1; do
        sleep 1
        COUNT=$((COUNT+1))
        if [ $COUNT -ge $MAX_RETRIES ]; then
            printf "${RED}Timed out waiting for internet access.${NC}\n"
            break
        fi
        printf "."
    done
    echo "" 

    # 3. Get Frequency Details & Run Test
    if [ $COUNT -lt $MAX_RETRIES ]; then
        LINK_DATA=$(iw dev "$INTERFACE" link)
        
        # Extract Frequency
        CURRENT_FREQ=$(echo "$LINK_DATA" | grep freq | awk '{print $2}')
        
        # Extract Protocol (Looking for EHT, HE, VHT, or MCS)
        RAW_PROTO=$(echo "$LINK_DATA" | grep -oP '(EHT|HE|VHT|MCS)' | head -n 1)
        
        # MAP RAW PROTOCOL TO LETTER
        case "$RAW_PROTO" in
            "EHT") WIFI_LETTER="be" ;; # Wi-Fi 7
            "HE")  WIFI_LETTER="ax" ;; # Wi-Fi 6/6E
            "VHT") WIFI_LETTER="ac" ;; # Wi-Fi 5
            "MCS") WIFI_LETTER="n"  ;; # Wi-Fi 4
            *)     WIFI_LETTER="a/b/g" ;; # Legacy
        esac

        # Extract Width
        WIDTH=$(echo "$LINK_DATA" | grep -oP '\d+MHz' || echo "20MHz*")

        echo "Connected on: $CURRENT_FREQ MHz | Std: 802.11$WIFI_LETTER ($RAW_PROTO) | Width: $WIDTH" 
        
        echo "Running Speedtest..."
        # Run the detected command and capture output
        RAW_OUTPUT=$($ST_CMD 2>&1)
        
        # Extract Download Speed (Works for both Ookla and Python cli with --simple)
        # Looks for "Download: 100.00"
        RESULT=$(echo "$RAW_OUTPUT" | grep "Download:" | awk '{print $2}')
        
        if [ -z "$RESULT" ]; then
             printf "${RED}Benchmark failed or could not parse output.${NC}\n"
             echo "DEBUG OUTPUT: $RAW_OUTPUT"
             RESULT="0"
        else
             printf "${GREEN}Download: $RESULT Mbps (802.11$WIFI_LETTER @ $WIDTH)${NC}\n"
        fi
    else
        printf "${RED}Could not reach internet.${NC}\n"
        RESULT="0"
        CURRENT_FREQ="-"
    fi
        
    # Return values
    CLEAN_LABEL=$(echo "$BAND_LABEL" | tr -d '.')
    eval "SPEED_$CLEAN_LABEL='$RESULT'"
    eval "FREQ_$CLEAN_LABEL='$CURRENT_FREQ'"
}

# --- Execution ---

# Test 2.4 GHz
run_test "bg" "24"

# Test 5 GHz
run_test "" "5"

# Test 6 GHz
if nmcli connection modify "$CONN_NAME" wifi.band 6g 2>/dev/null; then
   run_test "6g" "6"
else
   printf "\n${RED}Skipping 6GHz (Not supported by hardware/driver).${NC}\n"
   SPEED_6="0"
fi

# --- Generate Final Report ---

is_greater() {
    awk "BEGIN {print ($1 > $2)}"
}

BEST_SPEED=0
BEST_BAND="None"

# Compare 2.4GHz
if [ $(is_greater $SPEED_24 $BEST_SPEED) -eq 1 ]; then
    BEST_SPEED=$SPEED_24
    BEST_BAND="2.4 GHz"
fi

# Compare 5GHz
if [ $(is_greater $SPEED_5 $BEST_SPEED) -eq 1 ]; then
    BEST_SPEED=$SPEED_5
    BEST_BAND="5 GHz"
fi

# Compare 6GHz
if [ $(is_greater $SPEED_6 $BEST_SPEED) -eq 1 ]; then
    BEST_SPEED=$SPEED_6
    BEST_BAND="6 GHz"
fi

# Append to file
{
    echo ""
    echo "HIGHLIGHTS"
    echo "---------------------------------------------------"
    echo "Fastest Band:   $BEST_BAND"
    echo "Top Speed:      $BEST_SPEED Mbps"
    echo ""
    echo "DETAILED BREAKDOWN"
    echo "---------------------------------------------------"
    printf "%-10s | %-12s | %-15s\n" "Band" "Freq (MHz)" "Download (Mbps)"
    echo "---------------------------------------------------"
    printf "%-10s | %-12s | %-15s\n" "2.4 GHz" "$FREQ_24" "$SPEED_24"
    printf "%-10s | %-12s | %-15s\n" "5 GHz"   "$FREQ_5"  "$SPEED_5"
    printf "%-10s | %-12s | %-15s\n" "6 GHz"   "$FREQ_6"  "$SPEED_6"
    echo "---------------------------------------------------"
} >> "$REPORT_FILE"

printf "\n${GREEN}Report generated: $REPORT_FILE${NC}\n"