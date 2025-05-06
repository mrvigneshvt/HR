import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Props = {
  timeColor: string;
  iconColor: string;
};
const LiveClockComponent = ({ timeColor, iconColor }: Props) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Convert to IST manually
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const istTime = new Date(utc + 3600000 * 5.5); // IST = UTC + 5:30

      const timeString = istTime.toLocaleString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour12: false,
      });

      setCurrentTime(timeString);
    };

    updateTime(); // call once initially
    const interval = setInterval(updateTime, 1000); // update every second

    return () => clearInterval(interval); // cleanup
  }, []);
  const [date, time] = currentTime.split('at');
  return (
    <View
      style={{
        padding: 16,
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: timeColor }}>{time}</Text>
      <MaterialIcons name="timer" size={24} color={iconColor} />
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: timeColor }}>{date}</Text>
    </View>
  );
};

export default LiveClockComponent;
