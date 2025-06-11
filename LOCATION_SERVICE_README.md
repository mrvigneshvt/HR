# Location Service - Production Ready

A clean, production-ready React Native Expo solution for calling an API every 10 seconds with current location in both foreground and background.

## Features

- ✅ **Foreground Tracking**: Calls API every 10 seconds when app is active
- ✅ **Background Tracking**: Uses native background fetch when available
- ✅ **No UI Components**: Pure background service
- ✅ **Expo Go Compatible**: Works in Expo Go with foreground tracking
- ✅ **Production Ready**: Full background support with development builds
- ✅ **Clean Code**: Single service file, no unnecessary complexity

## Files

- `services/BackgroundLocationService.ts` - Main location service
- `app/_layout.tsx` - Auto-starts tracking when app launches

## How It Works

### Foreground Tracking
- Uses `setInterval` to call API every 10 seconds when app is active
- Automatically starts/stops based on app state changes
- Works in both Expo Go and development builds

### Background Tracking
- Uses `expo-background-fetch` for true background operation
- Only available in development builds (not Expo Go)
- Falls back gracefully if background fetch is not available

## API Endpoint

The service calls: `${config.api.baseUrl}/api/v1/post/locationUpdate/${config.api.credentials.key}`

### Payload Format
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "accuracy": 5.0,
  "timestamp": 1640995200000,
  "deviceInfo": {
    "platform": "ios",
    "version": "15.0"
  }
}
```

## Usage

The service automatically starts when the app launches. No manual intervention required.

### Manual Control (if needed)

```typescript
import locationService from '../services/BackgroundLocationService';

// Start tracking
await locationService.startTracking();

// Stop tracking
await locationService.stopTracking();

// Check if tracking is active
const isActive = locationService.isTrackingActive();

// Manual location update
await locationService.manualLocationUpdate();
```

## Permissions

The service automatically requests:
- Foreground location permission
- Background location permission (iOS only)

## Dependencies

Make sure these are installed in your `package.json`:

```json
{
  "dependencies": {
    "expo-location": "~16.1.0",
    "expo-task-manager": "~11.3.0",
    "expo-background-fetch": "~11.2.0",
    "axios": "^1.6.0"
  }
}
```

## Configuration

Update your `config.ts` file:

```typescript
export const configFile = {
  api: {
    baseUrl: 'https://your-api-domain.com',
    credentials: {
      key: 'your-api-key'
    }
  }
};
```

## Testing

### Expo Go Testing
1. Run `npx expo start`
2. Open in Expo Go
3. Grant location permissions
4. Check console logs for API calls every 10 seconds
5. Minimize app - tracking stops (Expo Go limitation)

### Production Testing (Development Build)
1. Install `expo-dev-client`
2. Run `npx expo run:ios` or `npx expo run:android`
3. Grant location permissions
4. Check console logs for API calls every 10 seconds
5. Minimize app - background tracking continues

## Console Logs

The service provides detailed console logs:
- Location tracking started/stopped
- API call attempts and responses
- Permission status
- Error handling

## Error Handling

- Graceful fallback if background fetch is not available
- Automatic retry on API failures
- Permission request handling
- Network timeout protection (10 seconds)

## Notes

- **Expo Go**: Only supports foreground tracking
- **Development Builds**: Full background support
- **iOS**: Requires background location permission
- **Android**: Background location works automatically
- **API Interval**: 10 seconds (minimum for background fetch)
- **Network Timeout**: 10 seconds per API call 