import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface PopupMessageProps {
  text: string;
  duration: number; // in milliseconds
}

const PopupMessage: React.FC<PopupMessageProps> = ({ text, duration }) => {
  const [visible] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in
    Animated.timing(visible, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Fade out after duration
    const timer = setTimeout(() => {
      Animated.timing(visible, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, visible]);

  return (
    <Animated.View style={[styles.container, { opacity: visible }]}>
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 999,
  },
  text: {
    color: '#238c58',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default PopupMessage;
