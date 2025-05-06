import { View, Text } from 'react-native';
import React from 'react';

const dateDeclaration = ['Leave', 'Holiday', 'Absent', 'Late', 'Present'];
const colors = ['bg-violet-700', 'bg-green-400', 'bg-red-600', 'bg-yellow-300', 'bg-green-700'];
const CalendarColorComp = () => {
  console.log(colors[0].slice(2, colors[0].length));

  return (
    <View
      className="mt-2 flex flex-row flex-wrap gap-4 rounded bg-white p-2 "
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowRadius: 5,
        shadowOpacity: 0.25,
        elevation: 5,
      }}>
      {dateDeclaration.map((d, i) => (
        <View key={i} className="bg-red- flex flex-row gap-2">
          <View className={`${colors[i]} w-5 rounded`}></View>
          <Text className={`text-sm text${colors[i].slice(2, colors[i].length)}font-semibold`}>
            {d}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default CalendarColorComp;
