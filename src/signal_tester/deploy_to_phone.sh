#!/bin/bash
# Script to deploy the Signal Tester app to a connected Android phone

export ANDROID_HOME=/Users/calvinault/Library/Android/sdk
export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
export PATH=$ANDROID_HOME/platform-tools:$JAVA_HOME/bin:$PATH

APK_PATH="android/app/build/outputs/apk/release/app-release.apk"

echo "--- Checking for connected Android devices ---"
DEVICE_COUNT=$(adb devices | grep -v "List of devices attached" | grep "device" | wc -l)

if [ "$DEVICE_COUNT" -eq 0 ]; then
    echo "ERROR: No Android device found. Please connect your OnePlus via USB."
    exit 1
fi

# Enable reverse proxy for auto-update check (phone:8080 -> Mac:8080)
adb reverse tcp:8080 tcp:8080
echo "--- ADB Reverse Proxy enabled on port 8080 ---"

echo "--- Device detected, installing APK... ---"
if [ ! -f "$APK_PATH" ]; then
    echo "ERROR: APK not found at $APK_PATH. Please run the build script first."
    exit 1
fi

adb install -r "$APK_PATH"

if [ $? -eq 0 ]; then
    echo "SUCCESS: Signal Tester app has been installed and is ready on your homescreen."
    # Optional: Automatically launch the app
    # adb shell am start -n com.valault1.signal_tester/com.valault1.signal_tester.MainActivity
else
    echo "ERROR: Failed to install the APK."
fi
