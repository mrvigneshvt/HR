import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { format, addMonths, subMonths } from 'date-fns';
import AntDesign from '@expo/vector-icons/AntDesign';
import { configFile } from '../config';

type Props = {
  onChange: (data: { year: string; month: string }) => void;
};

export default function MonthYearPickerHeader({ onChange }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  console.log(currentDate, 'curre');

  const handlePrev = () => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);

    onChange({
      year: newDate.getFullYear().toString(),
      month: String(newDate.getMonth() + 1).padStart(2, '0'), // ensures '01', '02', etc.
    });
  };

  const handleNext = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);

    onChange({
      year: newDate.getFullYear().toString(),
      month: String(newDate.getMonth() + 1).padStart(2, '0'), // ensures '01', '02', etc.
    });
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
      }}>
      <Pressable onPress={handlePrev}>
        <AntDesign name="leftcircleo" size={24} color={configFile.colorGreen} />
      </Pressable>

      <Text
        className="rounded-xl"
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          backgroundColor: configFile.colorGreen,
          padding: 8,
          color: 'white',
        }}>
        {format(currentDate, 'MMMM yyyy')}
      </Text>

      <Pressable onPress={handleNext}>
        <AntDesign name="rightcircleo" size={24} color={configFile.colorGreen} />
      </Pressable>
    </View>
  );
}
