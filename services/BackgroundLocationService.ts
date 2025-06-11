import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { Platform, AppState } from 'react-native';
import { configFile } from '../config';
import axios from 'axios';

const BACKGROUND_LOCATION_TASK = 'BACKGROUND_LOCATION_TASK';
const LOCATION_WATCH_TASK = 'LOCATION_WATCH_TASK';
const LOCATION_API_ENDPOINT = `${configFile.api.baseUrl}/api/v1/post/locationUpdate/${configFile.api.credentials.key}`;

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

class LocationService {
  private isInitialized: boolean = false;
  private foregroundInterval: NodeJS.Timeout | null = null;
  private isTracking: boolean = false;
  private locationSubscription: Location.LocationSubscription | null = null;
  private lastKnownLocation: LocationData | null = null;

  constructor() {
    this.initializeBackgroundTask();
    this.initializeLocationWatchTask();
    this.setupAppStateListener();
  }

  /**
   * Initialize background task for native builds
   */
  private initializeBackgroundTask() {
    if (this.isInitialized) return;

    TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async () => {
      try {
        console.log('Background location task executed');
        
        // Check if location services are enabled
        const isLocationEnabled = await Location.hasServicesEnabledAsync();
        if (!isLocationEnabled) {
          console.log('Location services are disabled, skipping background location update');
          return BackgroundFetch.BackgroundFetchResult.NoData;
        }

        // Check permissions before attempting to get location
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Location permission not granted, skipping background location update');
          return BackgroundFetch.BackgroundFetchResult.NoData;
        }

        // Try to get current location with fallback to last known location
        await this.sendLocationToServer();
        return BackgroundFetch.BackgroundFetchResult.NewData;
      } catch (error) {
        console.error('Background location task failed:', error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
      }
    });

    this.isInitialized = true;
  }

  /**
   * Initialize location watching task for continuous background updates
   */
  private initializeLocationWatchTask() {
    TaskManager.defineTask(LOCATION_WATCH_TASK, async ({ data, error }) => {
      if (error) {
        console.error('Location watch task error:', error);
        return;
      }

      if (data) {
        const { locations } = data as { locations: Location.LocationObject[] };
        if (locations && locations.length > 0) {
          const location = locations[0];
          this.lastKnownLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy ?? undefined,
            timestamp: location.timestamp,
          };
          
          console.log('Background location updated:', this.lastKnownLocation);
          
          // Send to server if we have a valid location
          try {
            await this.sendLocationToServer(this.lastKnownLocation);
          } catch (error) {
            console.error('Failed to send background location to server:', error);
          }
        }
      }
    });
  }

  /**
   * Setup app state listener for foreground/background transitions
   */
  private setupAppStateListener() {
    AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && this.isTracking) {
        this.startForegroundTracking();
        this.startLocationWatching();
      } else if (nextAppState === 'background' && this.isTracking) {
        this.stopForegroundTracking();
        this.startBackgroundLocationWatching();
      }
    });
  }

  /**
   * Request location permissions
   */
  private async requestPermissions(): Promise<boolean> {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      
      if (foregroundStatus !== 'granted') {
        console.error('Foreground location permission denied');
        return false;
      }

      if (Platform.OS === 'ios') {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        
        if (backgroundStatus !== 'granted') {
          console.error('Background location permission denied');
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  /**
   * Check if location services are enabled
   */
  private async checkLocationServices(): Promise<boolean> {
    try {
      const isEnabled = await Location.hasServicesEnabledAsync();
      if (!isEnabled) {
        console.log('Location services are disabled. Please enable location services in device settings.');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking location services:', error);
      return false;
    }
  }

  /**
   * Get current location with better error handling and fallbacks
   */
  private async getCurrentLocation(): Promise<LocationData | null> {
    try {
      // Check location services first
      const isLocationEnabled = await this.checkLocationServices();
      if (!isLocationEnabled) {
        throw new Error('Location services are disabled');
      }

      // Check permissions
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }

      // Try to get current location with multiple strategies
      let location: Location.LocationObject | null = null;

      // Strategy 1: Try with high accuracy
      try {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 5,
        });
      } catch (error) {
        console.log('High accuracy location failed, trying balanced accuracy');
        
        // Strategy 2: Try with balanced accuracy
        try {
          location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 10000,
            distanceInterval: 10,
          });
        } catch (error) {
          console.log('Balanced accuracy location failed, trying low accuracy');
          
          // Strategy 3: Try with low accuracy
          try {
            location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Low,
              timeInterval: 15000,
              distanceInterval: 20,
            });
          } catch (error) {
            console.log('All location strategies failed, using last known location');
            
            // Strategy 4: Use last known location if available
            if (this.lastKnownLocation) {
              console.log('Using last known location as fallback');
              return this.lastKnownLocation;
            }
            
            throw new Error('Unable to get current location and no fallback available');
          }
        }
      }

      if (!location) {
        throw new Error('Unable to get current location');
      }

      const locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy ?? undefined,
        timestamp: location.timestamp,
      };

      // Update last known location
      this.lastKnownLocation = locationData;

      return locationData;
    } catch (error) {
      console.error('Error getting current location:', error);
      
      // Provide specific error messages
      if (error instanceof Error) {
        if (error.message.includes('location services are disabled')) {
          console.log('Please enable location services in your device settings');
        } else if (error.message.includes('permission not granted')) {
          console.log('Please grant location permissions to the app');
        } else if (error.message.includes('timeout')) {
          console.log('Location request timed out, trying again later');
        }
      }
      
      // Return last known location as final fallback
      if (this.lastKnownLocation) {
        console.log('Using last known location as final fallback');
        return this.lastKnownLocation;
      }
      
      return null;
    }
  }

  /**
   * Start location watching for continuous updates
   */
  private async startLocationWatching() {
    try {
      if (this.locationSubscription) {
        this.locationSubscription.remove();
      }

      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 30000, // 30 seconds
          distanceInterval: 10, // 10 meters
        },
        (location) => {
          this.lastKnownLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy ?? undefined,
            timestamp: location.timestamp,
          };
          console.log('Location watch update:', this.lastKnownLocation);
        }
      );

      console.log('Location watching started');
    } catch (error) {
      console.error('Error starting location watching:', error);
    }
  }

  /**
   * Start background location watching
   */
  private async startBackgroundLocationWatching() {
    try {
      // For background, we rely on the background task and last known location
      console.log('Background location watching active (using background tasks)');
    } catch (error) {
      console.error('Error starting background location watching:', error);
    }
  }

  /**
   * Stop location watching
   */
  private stopLocationWatching() {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
      console.log('Location watching stopped');
    }
  }

  /**
   * Send location to server
   */
  private async sendLocationToServer(locationData?: LocationData | null): Promise<void> {
    try {
      const data = locationData || await this.getCurrentLocation();
      
      if (!data) {
        console.log('Skipping API call - no location data available');
        return;
      }

      const payload = {
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: data.accuracy,
        timestamp: data.timestamp,
        deviceInfo: {
          platform: Platform.OS,
          version: Platform.Version,
        },
      };

      console.log('Sending location payload:', payload);

      const response = await axios.post(LOCATION_API_ENDPOINT, payload, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${configFile.api.credentials.key}`,
        },
      });

      console.log('Location sent successfully:', response.data);
      
    } catch (error) {
      console.error('Error sending location to server:', error);
      throw error;
    }
  }

  /**
   * Start foreground tracking (every 30 minutes)
   */
  private startForegroundTracking() {
    if (this.foregroundInterval) {
      clearInterval(this.foregroundInterval);
    }

    this.foregroundInterval = setInterval(async () => {
      try {
        await this.sendLocationToServer();
      } catch (error) {
        console.error('Foreground location update failed:', error);
      }
    }, 30 * 60 * 1000); // 30 minutes in milliseconds

    console.log('Foreground location tracking started (30min interval)');
  }

  /**
   * Stop foreground tracking
   */
  private stopForegroundTracking() {
    if (this.foregroundInterval) {
      clearInterval(this.foregroundInterval);
      this.foregroundInterval = null;
      console.log('Foreground location tracking stopped');
    }
  }

  /**
   * Start location tracking (both foreground and background)
   */
  async startTracking(): Promise<boolean> {
    try {
      console.log('Starting location tracking...');

      // Check location services first
      const isLocationEnabled = await this.checkLocationServices();
      if (!isLocationEnabled) {
        console.error('Location services are disabled. Please enable them in device settings.');
        return false;
      }

      // Request permissions
      const hasPermissions = await this.requestPermissions();
      if (!hasPermissions) {
        console.error('Location permissions not granted');
        return false;
      }

      // Start foreground tracking
      this.startForegroundTracking();

      // Start location watching
      await this.startLocationWatching();

      // Register background fetch task for native builds
      try {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_LOCATION_TASK, {
          minimumInterval: 30 * 60, // 30 minutes in seconds
          stopOnTerminate: false,
          startOnBoot: true,
        });
        console.log('Background location task registered');
      } catch (error) {
        console.log('Background task registration failed (Expo Go limitation):', error);
      }

      this.isTracking = true;
      console.log('Location tracking started successfully');
      
      // Send initial location
      await this.sendLocationToServer();
      
      return true;
    } catch (error) {
      console.error('Error starting location tracking:', error);
      return false;
    }
  }

  /**
   * Stop location tracking
   */
  async stopTracking(): Promise<void> {
    try {
      this.stopForegroundTracking();
      this.stopLocationWatching();
      
      try {
        await BackgroundFetch.unregisterTaskAsync(BACKGROUND_LOCATION_TASK);
        console.log('Background location task unregistered');
      } catch (error) {
        console.log('Background task unregistration failed:', error);
      }

      this.isTracking = false;
      console.log('Location tracking stopped');
    } catch (error) {
      console.error('Error stopping location tracking:', error);
    }
  }

  /**
   * Check if tracking is active
   */
  isTrackingActive(): boolean {
    return this.isTracking;
  }

  /**
   * Manual location update (for testing)
   */
  async manualLocationUpdate(): Promise<boolean> {
    try {
      await this.sendLocationToServer();
      return true;
    } catch (error) {
      console.error('Manual location update failed:', error);
      return false;
    }
  }

  /**
   * Check location services status
   */
  async checkLocationStatus(): Promise<{
    servicesEnabled: boolean;
    permissionsGranted: boolean;
    canGetLocation: boolean;
    lastKnownLocation: LocationData | null;
  }> {
    const servicesEnabled = await this.checkLocationServices();
    const { status } = await Location.getForegroundPermissionsAsync();
    const permissionsGranted = status === 'granted';
    const canGetLocation = servicesEnabled && permissionsGranted;

    return {
      servicesEnabled,
      permissionsGranted,
      canGetLocation,
      lastKnownLocation: this.lastKnownLocation,
    };
  }
}

// Create singleton instance
const locationService = new LocationService();

export default locationService; 