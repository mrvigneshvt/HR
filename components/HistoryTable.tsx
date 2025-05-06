import { View, Text } from 'react-native';
import React from 'react';
import HistoryMiddle from './HistoryMiddle';
import HistoryCol from './HistoryCol';

const HistoryTable = () => {
  return (
    <View>
      <View>
        <HistoryMiddle />
        <HistoryCol />
      </View>
      <View></View>
    </View>
  );
};

export default HistoryTable;
