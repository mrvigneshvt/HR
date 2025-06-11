import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { Platform, AppState } from 'react-native';
import { configFile } from '../config';
import axios from 'axios';

const BACKGROUND_LOCATION_TASK = 'BACKGROUND_LOCATION_TASK';
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

  constructor() {
    this.initializeBackgroundTask();
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
   * Setup app state listener for foreground/background transitions
   */
  private setupAppStateListener() {
    AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && this.isTracking) {
        this.startForegroundTracking();
      } else if (nextAppState === 'background' && this.isTracking) {
        this.stopForegroundTracking();
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
   * Get current location with better error handling
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

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 5,
      });

      if (!location) {
        throw new Error('Unable to get current location');
      }

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy ?? undefined,
        timestamp: location.timestamp,
      };
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
      
      return null;
    }
  }

  /**
   * Send location to server
   */
  private async sendLocationToServer(): Promise<void> {
    try {
      const locationData = await this.getCurrentLocation();
      
      if (!locationData) {
        console.log('Skipping API call - no location data available');
        return;
      }

      const payload = {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        accuracy: locationData.accuracy,
        timestamp: locationData.timestamp,
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
  }> {
    const servicesEnabled = await this.checkLocationServices();
    const { status } = await Location.getForegroundPermissionsAsync();
    const permissionsGranted = status === 'granted';
    const canGetLocation = servicesEnabled && permissionsGranted;

    return {
      servicesEnabled,
      permissionsGranted,
      canGetLocation,
    };
  }
}

// Create singleton instance
const locationService = new LocationService();

export default locationService; 