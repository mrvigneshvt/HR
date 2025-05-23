// components/PermissionsGate.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';

export default function PermissionsGate({ children }: { children: React.ReactNode }) {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [loading, setLoading] = useState(true);

  const requestPermissions = async () => {
    setLoading(true);
    try {
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();

      if (locationStatus === 'granted' && mediaStatus === 'granted') {
        setPermissionsGranted(true);
      } else {
        setPermissionsGranted(false);
      }
    } catch (err) {
      console.error('Permission error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (!permissionsGranted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Please grant Location and File Access permissions to continue.</Text>
        <Button title="Try Again" onPress={requestPermissions} />
      </View>
    );
  }

  return <>{children}</>;
}
