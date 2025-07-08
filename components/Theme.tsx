import React, { useState } from 'react';
import { View, Pressable, Animated, Easing } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { MaterialIcons } from '@expo/vector-icons';

interface Props {
  initialMode: 'dark' | 'light';
  onToggle: (newMode: 'dark' | 'light') => void;
}

const ThemeToggle: React.FC<Props> = ({ initialMode, onToggle }) => {
  const [mode, setMode] = useState<'dark' | 'light'>(initialMode);
  const scaleAnim = new Animated.Value(1);
  const opacityAnim = new Animated.Value(1);

  const handleToggle = () => {
    // Animate scale + opacity
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.5,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]),
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    onToggle(newMode);
  };

  return (
    <Pressable onPress={handleToggle}>
      <Animated.View
        className="h-14 w-14 items-center justify-center rounded-full shadow-md"
        style={{
          backgroundColor: mode === 'dark' ? '#1e3a8a' : '#fcd34d',
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }}>
        {mode === 'dark' ? (
          <MaterialIcons name="dark-mode" size={28} color="white" />
        ) : (
          <Entypo name="light-up" size={28} color="#92400e" />
        )}
      </Animated.View>
    </Pressable>
  );
};

export default ThemeToggle;
