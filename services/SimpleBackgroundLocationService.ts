import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { configFile } from '../config';
import axios from 'axios';

const LOCATION_API_ENDPOINT = `${configFile.api.baseUrl}/api/v1/post/locationUpdate/${configFile.api.credentials.key}`;

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
  address?: string;
}

class SimpleBackgroundLocationService {
  private intervalId: NodeJS.Timeout | null = null;
  private isTracking: boolean = false;
  private retryCount: number = 0;
  private maxRetries: number = 3;

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
   * Get current location
   */
  private async getCurrentLocation(): Promise<LocationData | null> {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 10,
      });

      if (!location) {
        throw new Error('Unable to get current location');
      }

      // Get address
      let address = '';
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
          const place = reverseGeocode[0];
          address = [
            place.street,
            place.city,
            place.region,
            place.country,
          ]
            .filter(Boolean)
            .join(', ');
        }
      } catch (geocodeError) {
        console.warn('Reverse geocoding failed:', geocodeError);
      }

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy ?? undefined,
        timestamp: location.timestamp,
        address,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
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
        throw new Error('Failed to get location data');
      }

      const payload = {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        accuracy: locationData.accuracy,
        timestamp: locationData.timestamp,
        address: locationData.address,
        deviceInfo: {
          platform: Platform.OS,
          version: Platform.Version,
        },
      };

      console.log(payload,"payload>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")

      // const response = await axios.post(LOCATION_API_ENDPOINT, payload, {
      //   timeout: 10000,
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${configFile.api.credentials.key}`,
      //   },
      // });

      // console.log('Location sent successfully:', response.data);
      this.retryCount = 0; // Reset retry count on success
      
    } catch (error) {
      console.error('Error sending location to server:', error);
      
      // Retry logic
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`Retrying location send (${this.retryCount}/${this.maxRetries})...`);
        
        // Wait 5 seconds before retry
        setTimeout(() => {
          this.sendLocationToServer();
        }, 5000);
      } else {
        console.error('Max retries reached, giving up');
      }
    }
  }

  /**
   * Start location tracking every 30 minutes
   */
  async startLocationTracking(): Promise<boolean> {
    try {
      console.log('Starting location tracking...');

      // Check if already tracking
      if (this.isTracking) {
        console.log('Location tracking is already active');
        return true;
      }

      // Request permissions
      const hasPermissions = await this.requestPermissions();
      if (!hasPermissions) {
        console.error('Location permissions not granted');
        return false;
      }

      // Send initial location
      await this.sendLocationToServer();

      // Set up interval for every 30 minutes (30 * 60 * 1000 milliseconds)
      // this.intervalId = setInterval(() => {
      //   console.log('Sending location update...');
      //   this.sendLocationToServer();
      // }, 30 * 60 * 1000); // 30 minutes

      this.intervalId = setInterval(() => {
          console.log('Sending location update...');
          this.sendLocationToServer();
        }, 10 * 1000); // 30 minutes

      this.isTracking = true;
      console.log('Location tracking started successfully - will send location every 30 minutes');
      
      return true;
    } catch (error) {
      console.error('Error starting location tracking:', error);
      return false;
    }
  }

  /**
   * Stop location tracking
   */
  stopLocationTracking(): void {
    try {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
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
}

// Create singleton instance
const simpleBackgroundLocationService = new SimpleBackgroundLocationService();

export default simpleBackgroundLocationService; 