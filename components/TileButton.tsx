import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { configFile } from '../config';

type TileButtonProps = {
  label: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  color?: string;
  width?: string | number;
  height?: number;
  radius?: number;
};

const TileButton = ({
  label,
  icon,
  onPress,
  color = configFile.colorGreen,
  width = '48%',
  height = scale(150),
  radius = moderateScale(12),
}: TileButtonProps) => {
  return (
    <View style={[styles.wrapper, { width }]}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: '#ffffff30', borderless: false }}
        style={[
          styles.card,
          {
            backgroundColor: color,
            height,
            borderRadius: radius,
          },
        ]}>
        {icon && <View style={styles.iconWrapper}>{icon}</View>}
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: verticalScale(8),
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginBottom: verticalScale(10),
  },
  label: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default TileButton;
