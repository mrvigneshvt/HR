import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';

type Props = {
  color?: string;
  loaderOnly?: boolean;
};

const LoadingScreen = ({ color, loaderOnly }: Props) => {
  console.log(color);
  const bg = color ? color : '#fff';
  console.log(bg);
  if (loaderOnly) {
    return (
      <View className="flex items-center justify-center">
        <Image source={require('../assets/loader.gif')} style={styles.gif} />;
      </View>
    );
  }

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
