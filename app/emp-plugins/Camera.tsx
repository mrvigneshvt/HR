import { View, Text } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';

const Camera = () => {
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const [status, requestPermission] = useCameraPermissions();

  console.log(status);

  if (status?.granted) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView facing={facing} style={{ flex: 1 }} />
      </View>
    );
  } else {
    requestPermission();
  }
};

export default Camera;
