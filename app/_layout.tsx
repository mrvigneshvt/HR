// app/_layout.tsx
import PermissionStack from 'app-loc/location';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <>
      <PermissionStack />
      <Slot />
    </>
  );
}
