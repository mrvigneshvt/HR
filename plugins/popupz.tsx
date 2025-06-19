import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View, ViewStyle } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface Props {
  message: string;
  onClose: () => void;
  style?: ViewStyle; // Allow placement under any button or inside any view
}

const PopupMessage: React.FC<Props> = ({ message, onClose, style }) => {
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    // Slide in from -50 to 0
    Animated.timing(slideAnim, {
      toValue: 10,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Slide out back to -50 after 4s
    const timeout = setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -60,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onClose();
      });
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(8),
    borderWidth: 2,
    borderColor: '#238c58',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    alignSelf: 'center',
    zIndex: 999,
  },
  message: {
    color: '#238c58',
    fontSize: scale(14),
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default PopupMessage;
