# Build APK for MA Keno Viewer

Your Cordova project is ready! Since building locally requires Java JDK and Android SDK installation, here are the easiest ways to build your APK:

## Option 1: PhoneGap Build Online (Easiest - No Setup Required)

**Note:** PhoneGap Build service has been discontinued. Use Option 2 or 3 instead.

## Option 2: Use AppGeyser (Quick & Free)

1. Go to https://appsgeyser.com/
2. Click "Create App Now"
3. Choose "Website"
4. Enter URL: `http://10.0.0.35:3000/viewer`
5. Name your app: "MA Keno Viewer"
6. Customize icon (optional)
7. Download APK

**Pros:** Super easy, no setup required
**Cons:** May include AppGeyser branding/ads

## Option 3: Build Locally (Complete Setup)

If you want to build locally, you need to install:

### Install Java JDK

```bash
# Install via Homebrew
brew install --cask temurin

# Or download from: https://adoptium.net/
```

### Install Android SDK

```bash
# Install via Homebrew
brew install --cask android-commandlinetools

# Set environment variables (add to ~/.zshrc or ~/.bash_profile)
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Install required packages
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"
```

### Accept Licenses

```bash
sdkmanager --licenses
```

### Build APK

```bash
cd /Users/matthewwhite/Documents/GitHub/tchr01.github.io/prototypes/keno/KenoApp
cordova build android

# APK will be at:
# platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

## Option 4: Use GitHub Actions (Automated)

I can set up a GitHub Actions workflow to automatically build APKs when you push changes.

## Recommended Approach

For quick testing, use **Option 2 (AppGeyser)** - it's the fastest way to get an APK on your Shield.

Once you verify everything works, if you want a custom branded APK without any third-party branding, use **Option 3** (local build).

## Installing APK on Nvidia Shield

### Method 1: ADB (Recommended)

```bash
# Enable Developer Mode on Shield:
# Settings > Device Preferences > About > Click "Build" 7 times

# Enable USB Debugging:
# Settings > Developer Options > USB Debugging

# Connect via ADB
adb connect YOUR_SHIELD_IP
adb install app-debug.apk
```

### Method 2: USB Drive

1. Copy APK to USB drive
2. Plug into Shield
3. Use file manager app to install

### Method 3: Send Files to TV App

1. Install "Send Files to TV" on both devices
2. Send APK from Mac to Shield
3. Install from Shield

## Changing Server URL

If your Mac's IP changes, edit this file:
```
KenoApp/www/index.html
```

Line 26:
```html
<iframe src="http://YOUR_NEW_IP:3000/viewer" allowfullscreen></iframe>
```

Then rebuild the APK.

## Current Configuration

- Server URL: `http://10.0.0.35:3000/viewer`
- Package ID: `com.keno.viewer`
- App Name: MA Keno Viewer
- Orientation: Landscape
- Fullscreen: Enabled
- Android TV: Supported
