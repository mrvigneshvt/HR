import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { Calendar as RnCalendar } from 'react-native-calendars';
import CalendarColorComp from './CalendarColorComp';
import { customPlugins } from 'plugins/plug';

const leaveDates = ['2025-04-09', '2025-04-12'];
const lateDates = ['2025-04-01', '2025-04-04', '2025-04-10'];
const presentDates = [
  '2025-04-02',
  '2025-04-03',
  '2025-04-5',
  '2025-04-07',
  '2025-04-08',
  '2025-04-11',
];

type Props = {
  year: number;
  month: number;
};

const Calendar = ({ year, month }: Props) => {
  const [dates, setDates] = useState<string[]>([...leaveDates]);

  // Build markedDates dynamically using reduce

  const sundayArray = customPlugins.getSundaysInMonth(year, month);
  let currentDate: string = customPlugins.getCurrentDate();

  const CurrentDate = {
    [currentDate]: {
      customStyles: {
        container: {
          borderColor: 'black',
          borderWidth: 2,
        },
        text: {
          fontWeight: 'bold',
          color: 'black',
        },
      },
    },
  };

  console.log(CurrentDate);

  const markDatePresent = presentDates.reduce((acc, date: string) => {
    acc[date] = {
      customStyles: {
        container: {
          backgroundColor: 'green',
        },
        text: {
          fontWeight: 'bold',
          color: '#fff',
        },
      },
    };
    return acc;
  }, {});

  const markDateLate = lateDates.reduce((acc, data: string) => {
    acc[data] = {
      customStyles: {
        container: {
          backgroundColor: '#fde68a',
          borderRadius: 8,
        },
        text: {
          color: 'white',
          fontWeight: 'bold',
        },
      },
    };
    return acc;
  }, {});
  const markDateLeave = sundayArray.reduce((acc, data: string) => {
    acc[data] = {
      customStyles: {
        container: {
          backgroundColor: '#68d391',
          borderRadius: 8,
        },
        text: {
          color: 'white',
          fontWeight: 'bold',
        },
      },
    };
    return acc;
  }, {});

  const markedDates: any = dates.reduce((acc: string, date: string) => {
    acc[date] = {
      customStyles: {
        container: {
          backgroundColor: 'red',
          borderRadius: 8,
        },
        text: {
          color: 'white',
          fontWeight: 'bold',
        },
      },
    };
    return acc;
  }, {});

  return (
    <View className="flex-col gap-4">
      <RnCalendar
        hideExtraDays={true}
        hideArrows={true}
        markedDates={{
          ...markDateLeave,
          ...markedDates,
          ...markDateLate,
          ...markDatePresent,
          ...CurrentDate,
        }}
        markingType="custom"
        //onDayPress={(e) => {
        //  const selected = e.dateString;
        //  if (!dates.includes(selected)) {
        //    setDates([...dates, selected]);
        //  } else {
        //    setDates(dates.filter((d) => d !== selected)); // Toggle off if already selected
        //  }
        //  console.log('day pressed: ', selected);
        //}}
      />
      <CalendarColorComp />
    </View>
  );
};

export default Calendar;
