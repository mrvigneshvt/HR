import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import LoadingScreen from 'components/LoadingScreen';
import { Image } from 'expo-image';
const InActive = () => {
  return (
    <View className="rounded-2xl" style={[styles.container, { backgroundColor: 'red' }]}>
      <Image source={require('../assets/infinite-spinner.svg')} style={styles.gif} />
    </View>
  );
};

export default InActive;

// import React from 'react';
// import { View, StyleSheet, ActivityIndicator } from 'react-native';
// import { Image } from 'expo-image';

// type Props = {
//   color?: string;
// };

// const LoadingScreen = ({ color }: Props) => {
//   console.log(color);
//   const bg = color ? color : '#fff';
//   console.log(bg);

//   return (

//   );
// };

// export default LoadingScreen;

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
