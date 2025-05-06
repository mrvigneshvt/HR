import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { configFile } from './../config';
import { SafeAreaView } from 'react-native-safe-area-context';

const datas = [
  ['10-04-2025', '10:10:53', 'New Tank Street Nungambakkam Chennai 34', '-'],
  ['10-04-2025', '10:10:53', 'New Tank Street Nungambakkam Chennai 34', '-'],

  ['10-04-2025', '10:10:53', 'New Tank Street Nungambakkam Chennai 34', '-'],

  ['10-04-2025', '10:10:53', 'New Tank Street Nungambakkam Chennai 34', '-'],
  ['10-04-2025', '10:10:53', 'New Tank Street Nungambakkam Chennai 34', '-'],
  ['10-04-2025', '10:10:53', 'New Tank Street Nungambakkam Chennai 34', '-'],
  ['10-04-2025', '10:10:53', 'New Tank Street Nungambakkam Chennai 34', '-'],
  ['10-04-2025', '10:10:53', 'New Tank Street Nungambakkam Chennai 34', '-'],
  ['10-04-2025', '10:10:53', 'New Tank Street Nungambakkam Chennai 34', '-'],
  ['10-04-2025', '10:10:53', 'New Tank Street Nungambakkam Chennai 34', '-'],
  ['10-04-2025', '10:10:53', 'New Tank Street Nungambakkam Chennai 34', '-'],

  // ...more rows
];

const green = configFile.colorGreen;

const HistoryCol = () => {
  return (
    <View
      className="mb-2 mt-2  rounded-xl border bg-white p-2"
      style={{ borderColor: 'black', borderWidth: 0.5 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 300 }}>
        {datas.map((d, i) => (
          <View
            key={i}
            className="flex-row gap-2  border-gray-500 p-2"
            style={{ borderBottomColor: 'black', borderBottomWidth: 0.5 }}>
            <View className="w-1/3 rounded-md  p-2">
              <Text className=" font-semibold text-gray-800">{d[0]}</Text>
              <Text>{d[1]}</Text>
            </View>
            <View className="w-1/3 rounded-md p-2">
              <Text className={`text-[${green}] font-medium`}>{d[2]}</Text>
            </View>
            <View className="w-1/3 items-center rounded-md p-2">
              <Text className={`text-[${green}] font-medium`}>{d[3]}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default HistoryCol;
