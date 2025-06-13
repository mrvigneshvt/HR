import React from 'react';
import { View } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';

const AdminCalendar = ({ onDayPress, markedDates }: { onDayPress: (day: any) => void, markedDates: any }) => (
  <View style={{ margin: 16 }}>
    <RNCalendar
      onDayPress={onDayPress}
      markedDates={markedDates}
      theme={{
        selectedDayBackgroundColor: '#4A90E2',
        todayTextColor: '#50C878',
        arrowColor: '#4A90E2',
      }}
    />
  </View>
);

export default AdminCalendar; 