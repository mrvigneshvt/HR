// app/_layout.tsx
import PermissionStack from 'app-loc/location';
import PermissionsGate from 'components/permission/PermissionGate';
import { Slot, Stack } from 'expo-router';
import { useEffect } from 'react';
import locationService from '../services/BackgroundLocationService';

export default function RootLayout() {
  // useEffect(() => {
  //   // Start location tracking when app launches
  //   const startTracking = async () => {
  //     try {
  //       await locationService.startTracking();
  //     } catch (error) {
  //       console.error('Failed to start location tracking:', error);
  //     }
  //   };

  //   startTracking();

  //   // Cleanup on unmount
  //   return () => {
  //     locationService.stopTracking();
  //   };
  // }, []);

  return (
    <>
      <PermissionsGate>
        <Slot />
      </PermissionsGate>
    </>
  );
}
