# Production Background Location Tracking

This solution provides **true background location tracking** that works even when the app is idle/minimized.

## ✅ **What It Does**

- ✅ **True Background Operation**: Works even when app is closed/minimized
- ✅ **30-minute intervals**: Sends location every 30 minutes
- ✅ **No UI**: Completely background operation
- ✅ **Retry logic**: Handles network failures
- ✅ **High accuracy**: Uses GPS for precise location
- ✅ **Production ready**: Uses native background tasks

## 🚀 **Setup Requirements**

### 1. Development Build Required
This solution requires a **development build** (not Expo Go):

```bash
# Install expo-dev-client
npx expo install expo-dev-client

# Build for Android
npx expo run:android

# Build for iOS
npx expo run:ios
```

### 2. Dependencies Installed
- `expo-dev-client` - For development builds
- `expo-task-manager` - For background tasks
- `expo-background-fetch` - For background execution
- `expo-location` - For location services

## 📁 **Files**

1. `services/BackgroundLocationService.ts` - Main background service
2. `services/initializeBackgroundTracking.ts` - Helper functions
3. `app/_layout.tsx` - Auto-starts tracking
4. Updated `app.json` - With background permissions

## 🔧 **How It Works**

1. **App starts** → Background task registers with system
2. **Every 30 minutes** → System wakes up the background task
3. **Gets location** → Uses GPS to get current position
4. **Sends to API** → Posts location data to your server
5. **Works in background** → Continues even when app is closed

## 📡 **API Endpoint**

Sends location data to:
```
POST http://192.168.1.4:5000/api/v1/post/locationUpdate/iaus787sadfsdf837asdsad8223e
```

**Payload:**
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "accuracy": 5.0,
  "timestamp": 1640995200000,
  "address": "123 Main St, San Francisco, CA, USA",
  "deviceInfo": {
    "platform": "ios",
    "version": "15.0"
  }
}
```

## 🧪 **Testing**

### 1. Build and Install
```bash
npx expo run:android
# or
npx expo run:ios
```

### 2. Check Console Logs
Look for:
- `"Background location tracking initialized successfully"`
- `"Background location task started"` (every 30 minutes)
- `"Location sent successfully: [response data]"`

### 3. Test Background Operation
1. Start the app
2. Minimize/close the app
3. Wait 30 minutes
4. Check your API for incoming location data

### 4. Manual Testing
```javascript
import { manualLocationUpdate } from '../services/initializeBackgroundTracking';

// Test immediate location send
manualLocationUpdate();
```

## 🔒 **Permissions**

The app will request:
- **Foreground location** permission
- **Background location** permission (iOS)
- **Background processing** permission

## 📱 **Platform Differences**

### iOS
- Background app refresh must be enabled
- Location permissions must be "Always"
- System may optimize background execution

### Android
- Battery optimization should be disabled for the app
- Background location permission required
- More reliable background execution

## 🚨 **Important Notes**

1. **Development Build Required**: This won't work in Expo Go
2. **System Limitations**: iOS/Android may optimize background execution
3. **Battery Impact**: Background location tracking uses battery
4. **Network Required**: API calls need internet connection

## 🔧 **Troubleshooting**

### Background Tasks Not Working
- **iOS**: Check Settings → General → Background App Refresh
- **Android**: Disable battery optimization for the app
- **Both**: Ensure location permissions are granted

### No Location Data
- Check network connectivity
- Verify API endpoint is correct
- Check console logs for errors

### Build Issues
- Run `npx expo prebuild --clean`
- Ensure all dependencies are installed
- Check app.json configuration

## 🎯 **Production Deployment**

1. **Test thoroughly** on both platforms
2. **Monitor battery usage** and optimize if needed
3. **Set up API monitoring** for location data
4. **Consider user privacy** and inform about background tracking

This solution provides **true background location tracking** that works even when the app is idle! 🎉 