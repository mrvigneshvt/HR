import simpleBackgroundLocationService from './SimpleBackgroundLocationService';

/**
 * Initialize background location tracking
 * Call this function when your app starts (e.g., in App.tsx or _layout.tsx)
 */
export const initializeBackgroundLocationTracking = async () => {
  try {
    console.log('Initializing background location tracking...');
    
    const success = await simpleBackgroundLocationService.startLocationTracking();
    
    if (success) {
      console.log('Background location tracking initialized successfully');
    } else {
      console.error('Failed to initialize background location tracking');
    }
    
    return success;
  } catch (error) {
    console.error('Error initializing background location tracking:', error);
    return false;
  }
};

/**
 * Stop background location tracking
 * Call this if you need to stop tracking
 */
export const stopBackgroundLocationTracking = () => {
  try {
    simpleBackgroundLocationService.stopLocationTracking();
    console.log('Background location tracking stopped');
  } catch (error) {
    console.error('Error stopping background location tracking:', error);
  }
};

/**
 * Check if background tracking is active
 */
export const isBackgroundTrackingActive = () => {
  return simpleBackgroundLocationService.isTrackingActive();
};

/**
 * Manual location update (for testing)
 */
export const manualLocationUpdate = async () => {
  try {
    const success = await simpleBackgroundLocationService.manualLocationUpdate();
    if (success) {
      console.log('Manual location update sent successfully');
    } else {
      console.error('Manual location update failed');
    }
    return success;
  } catch (error) {
    console.error('Error in manual location update:', error);
    return false;
  }
}; 