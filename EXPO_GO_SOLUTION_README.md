# Expo Go Location Tracking Solution

This solution works in **Expo Go** for testing purposes. It provides location tracking that works when the app is active and resumes when the app comes back to foreground.

## ✅ **What It Does**

- ✅ **Expo Go Compatible**: Works in Expo Go without development build
- ✅ **30-minute intervals**: Sends location every 30 minutes when app is active
- ✅ **Foreground resumption**: Checks and sends location when app comes back to foreground
- ✅ **No UI**: Completely background operation
- ✅ **Retry logic**: Handles network failures
- ✅ **High accuracy**: Uses GPS for precise location

## 🚀 **How to Use**

### 1. Start Expo Go
```bash
npx expo start
```

### 2. Scan QR Code
Use Expo Go app to scan the QR code and run the app.

### 3. Location Tracking Starts Automatically
The location tracking will start automatically when the app launches.

## 📁 **Files**

1. `services/ExpoGoLocationService.ts` - Main location service (Expo Go compatible)
2. `services/initializeBackgroundTracking.ts` - Helper functions
3. `app/_layout.tsx` - Auto-starts tracking
4. Updated `app.json` - Without problematic plugins

## 🔧 **How It Works**

1. **App starts** → Location tracking initializes
2. **Every minute** → Checks if 30 minutes have passed since last location
3. **If 30 minutes passed** → Gets location and sends to API
4. **App goes to background** → Tracking pauses
5. **App comes to foreground** → Checks if location update is needed

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

### 1. Start the App
- Run `npx expo start`
- Scan QR code with Expo Go
- Check console for "Location tracking initialized successfully"

### 2. Test Immediate Location
```javascript
import { manualLocationUpdate } from '../services/initializeBackgroundTracking';

// Test immediate location send
manualLocationUpdate();
```

### 3. Test Foreground/Background
1. Keep app in foreground for a few minutes
2. Minimize the app
3. Bring app back to foreground
4. Check console for "App came to foreground - checking if location update is needed"

### 4. Test 30-Minute Interval
1. Keep app active for 30 minutes
2. Watch console for location updates
3. Check your API for incoming data

## 📱 **Console Logs to Watch**

```
"Location tracking initialized successfully"
"App State changed to: active"
"App State changed to: background"
"App came to foreground - checking if location update is needed"
"Enough time has passed, sending location update..."
"Sending location payload: {...}"
"Location sent successfully: {...}"
```

## ⚠️ **Limitations**

- **App must be active**: Location tracking only works when app is in foreground
- **No true background**: Cannot send location when app is completely closed
- **Testing only**: For production, use the development build solution

## 🔧 **Troubleshooting**

### No Location Sent
- Check permissions in device settings
- Ensure location services are enabled
- Check network connectivity

### App State Issues
- Make sure to grant location permissions
- Check console logs for permission errors

### API Errors
- Verify API endpoint is correct
- Check network connection
- Look for retry attempts in console

## 🎯 **Next Steps for Production**

For true background operation (when app is closed), you'll need to:

1. **Build development version**:
   ```bash
   npx expo run:android
   # or
   npx expo run:ios
   ```

2. **Use BackgroundLocationService.ts** instead of ExpoGoLocationService.ts

3. **Add back the plugins** in app.json:
   - `expo-task-manager`
   - `expo-background-fetch`

This Expo Go solution is perfect for **testing and development**! 🎉 