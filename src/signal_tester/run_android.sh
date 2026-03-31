#!/bin/zsh
export ANDROID_HOME="$HOME/Library/Android/sdk"
unset ANDROID_SDK_ROOT
export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$JAVA_HOME/bin:$PATH

cd "$(dirname "$0")"
source ~/.zshrc
nvm use 22 || nvm install 22
$ANDROID_HOME/platform-tools/adb reverse tcp:8081 tcp:8081 2>/dev/null
npm run android -- "$@"
