// app/_layout.tsx
import PermissionStack from 'app-loc/location';
import PermissionsGate from 'components/permission/PermissionGate';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <>
      <PermissionsGate>
        <Slot />
      </PermissionsGate>
    </>
  );
}
