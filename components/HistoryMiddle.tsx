import { View, Text } from 'react-native';
import React from 'react';

const datas = ['Date & Time', 'Address', 'Remarks'];

type Props = {
  data: [];
};

const HistoryMiddle = () => {
  return (
    <View>
      <View className="flex flex-row justify-between bg-white ">
        {datas.map((d, i) => (
          <View className="p-2" key={i}>
            <Text className="font-semibold">{d}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default HistoryMiddle;
