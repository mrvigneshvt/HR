import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';

export default function PermissionStack() {
  useEffect(() => {
    const requestAllPermissions = async () => {
      try {
        // Request Location Permission
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        if (locationStatus !== 'granted') {
          Alert.alert('Location permission denied');
        }

        // Request Media Library Permission
        const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
        if (mediaStatus !== 'granted') {
          Alert.alert('Media library permission denied');
        }

        // Request Camera Permission

        // You can add more permissions here like Contacts, Notifications, etc.
      } catch (err) {
        console.error('Error requesting permissions:', err);
      }
    };

    requestAllPermissions();
  }, []);

  return null;
}
