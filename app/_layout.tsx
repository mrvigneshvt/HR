// app/_layout.tsx
import PermissionStack from 'app-loc/location';
import PermissionsGate from 'components/permission/PermissionGate';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { initializeBackgroundLocationTracking } from '../services/initializeBackgroundTracking';

export default function RootLayout() {
  useEffect(() => {
    // Start background location tracking when app launches
    initializeBackgroundLocationTracking();
  }, []);

  return (
    <>
      <PermissionsGate>
        <Slot />
      </PermissionsGate>
    </>
  );
}
