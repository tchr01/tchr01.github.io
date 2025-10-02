# Building the MA Keno Viewer APK

## Prerequisites

1. Install [Android Studio](https://developer.android.com/studio)
2. Make sure your Mac server IP is correct in `MainActivity.java` (currently set to `10.0.0.125`)

## Steps to Build APK

### Option 1: Using Android Studio (Easiest)

1. Open Android Studio
2. Click "New Project" > "Empty Views Activity"
3. Set these values:
   - Name: `MA Keno Viewer`
   - Package name: `com.keno.viewer`
   - Language: `Java`
   - Minimum SDK: `API 21`
4. Click "Finish" and wait for Gradle to sync
5. Replace these files with the ones from `android-app/`:
   - `app/src/main/java/com/keno/viewer/MainActivity.java`
   - `app/src/main/AndroidManifest.xml`
   - `app/build.gradle`
6. **IMPORTANT:** Edit `MainActivity.java` line 13 and set your Mac's IP address:
   ```java
   private static final String SERVER_URL = "http://YOUR_MAC_IP:3000/viewer";
   ```
7. Build APK:
   - Click `Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)`
   - Wait for build to complete
   - Click "locate" to find the APK file

### Option 2: Using Command Line

```bash
# Create new Android project
cd android-app
gradle wrapper
./gradlew build

# APK will be in: build/outputs/apk/debug/app-debug.apk
```

## Installing on Nvidia Shield

### Via ADB (Recommended)

1. Enable Developer Options on Shield:
   - Go to Settings > Device Preferences > About
   - Click "Build" 7 times
2. Enable USB Debugging:
   - Settings > Device Preferences > Developer Options > USB Debugging
3. Connect via ADB:
   ```bash
   adb connect YOUR_SHIELD_IP
   adb install app-debug.apk
   ```

### Via USB Drive

1. Copy `app-debug.apk` to USB drive
2. Plug into Shield
3. Use a file manager app to install the APK

## Configuration

### Change Server URL

Edit `MainActivity.java` line 13:
```java
private static final String SERVER_URL = "http://YOUR_MAC_IP:3000/viewer";
```

Find your Mac's IP:
```bash
ipconfig getifaddr en0
```

## Features

- ✅ Fullscreen display
- ✅ Landscape orientation
- ✅ Screen stays on
- ✅ Hides navigation bar
- ✅ Works on Android TV/Shield
- ✅ Auto-refreshes with server

## Troubleshooting

**APK won't install:**
- Enable "Unknown sources" in Shield settings

**Blank screen:**
- Check Mac server is running: `http://YOUR_MAC_IP:3000/viewer`
- Check Shield can reach Mac (ping test)
- Check IP address in MainActivity.java

**App crashes:**
- Check Android Studio Logcat for errors
- Verify minimum Android version (API 21+)

## Starting Node Server on Mac

```bash
cd /path/to/keno
npm install
npm start

# Or use pm2 for persistent server:
npm install -g pm2
pm2 start server.js --name keno
pm2 save
pm2 startup
```

## Making Updates

After updating the viewer code:
1. Just refresh - no need to rebuild APK
2. APK always loads latest from server
3. Only rebuild APK if changing the server URL
