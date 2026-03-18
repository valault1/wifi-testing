#!/bin/bash
export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$JAVA_HOME/bin:$PATH

cd "$(dirname "$0")"
npm run android
