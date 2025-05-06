import { View, Text } from 'react-native';
import React, { useState } from 'react';
import HistoryTop from 'components/HistoryTop';
import HistoryMiddle from 'components/HistoryMiddle';
import HistoryTable from 'components/HistoryTable';
import Calendar from 'components/Calendar';
import ProfileStack from 'Stacks/HeaderStack';
import { DashMemory } from 'Memory/DashMem';

const History = (): React.ReactNode => {
  const exArray = ['jakfjkd', 'hnafdh', 'iashdis'];

  const [childData, setChildData] = useState<string | undefined>('His');

  const dashboard = DashMemory((state) => state.dashboard);
  console.log(dashboard, 'gddddd');

  const callback = (data: string) => {
    console.log('callback received::');
    setChildData(data);
    console.log(childData);
  };

  return (
    <>
      <ProfileStack History={true} role={dashboard?.user.details.role} />
      <View className="h-full items-center justify-start rounded-xl bg-white pt-4">
        <View className="flex w-full max-w-[420px] flex-col gap-2 px-4">
          <HistoryTop callback={callback} />
          {childData === 'His' ? (
            <>
              <HistoryTable />
            </>
          ) : (
            <>
              <Calendar month={4} year={2025} />
            </>
          )}
        </View>
      </View>
    </>
  );
};

export default History;
