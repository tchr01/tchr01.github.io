#!/bin/bash

# Quick build script for Keno APK

echo "============================================"
echo "Building MA Keno Viewer APK"
echo "============================================"

# Set Java 21
export JAVA_HOME=$(/usr/libexec/java_home -v 21)

# Set Android paths
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:/opt/homebrew/share/android-commandlinetools/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

echo ""
echo "Environment:"
echo "  Java: $JAVA_HOME"
echo "  Android SDK: $ANDROID_HOME"
echo ""

cd /Users/matthewwhite/Documents/GitHub/tchr01.github.io/prototypes/keno/KenoApp

cordova build android

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ BUILD SUCCESSFUL!"
    echo ""
    echo "APK Location:"
    find platforms/android/app/build/outputs/apk -name "*.apk" 2>/dev/null
    echo ""
else
    echo ""
    echo "❌ BUILD FAILED"
    echo ""
    echo "Try using AppGeyser instead:"
    echo "1. Go to https://appsgeyser.com/"
    echo "2. Choose 'Website'"
    echo "3. Enter URL: http://10.0.0.35:3000/viewer"
    echo "4. Download APK"
    echo ""
fi
