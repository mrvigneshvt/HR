# Background Location Tracking (Expo Go Compatible)

This is a simple background service that automatically tracks employee location every 30 minutes and sends it to your API. **Works in Expo Go!**

## What it does

- ✅ **Automatic**: Starts when app launches
- ✅ **30-minute intervals**: Sends location every 30 minutes
- ✅ **No UI**: Completely background operation
- ✅ **Retry logic**: Handles network failures
- ✅ **High accuracy**: Uses GPS for precise location
- ✅ **Expo Go compatible**: No native modules required

## Files Created

1. `services/SimpleBackgroundLocationService.ts` - Main background service
2. `services/initializeBackgroundTracking.ts` - Helper functions
3. Updated `app/_layout.tsx` - Auto-starts tracking

## How it works

1. **App starts** → Location tracking automatically initializes
2. **Every 30 minutes** → Gets current location and sends to API
3. **setInterval based** → Uses JavaScript timer (works in Expo Go)
4. **Error handling** → Retries failed API calls up to 3 times

## API Endpoint

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

## Permissions

The app will automatically request:
- **Foreground location** permission
- **Background location** permission (iOS)

## Testing

1. **Start the app** - Check console for "Background location tracking initialized successfully"
2. **Wait 30 minutes** - Location will be sent automatically
3. **Check your API** - You should receive location data
4. **Manual test** - Use `manualLocationUpdate()` function for immediate testing

## Console Logs

Look for these messages:
- `"Background location tracking initialized successfully"`
- `"Location sent successfully: [response data]"`
- `"Sending location update..."` (every 30 minutes)

## Manual Testing

You can test immediately by calling:
```javascript
import { manualLocationUpdate } from '../services/initializeBackgroundTracking';

// Test immediate location send
manualLocationUpdate();
```

## Limitations

- **App must be running**: Unlike true background tasks, this requires the app to be active
- **Timer-based**: Uses setInterval instead of native background tasks
- **Expo Go only**: For production builds, consider using expo-dev-client with native modules

## Troubleshooting

- **No location sent**: Check permissions in device settings
- **API errors**: Check network and API endpoint
- **Timer not working**: Ensure app stays active in foreground

That's it! The location tracking runs every 30 minutes while the app is active. Perfect for Expo Go development! 🎯 