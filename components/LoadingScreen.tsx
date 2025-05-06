import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';

type Props = {
  color?: string;
};

const LoadingScreen = ({ color }: Props) => {
  console.log(color);
  const bg = color ? color : '#fff';
  console.log(bg);

  return (
    <View className="rounded-2xl" style={[styles.container, { backgroundColor: bg }]}>
      <Image source={require('../assets/loader.gif')} style={styles.gif} />
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gif: {
    width: 100,
    height: 100,
  },
});
