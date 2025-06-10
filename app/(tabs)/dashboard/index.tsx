import { View, Text, Dimensions, Pressable, ScrollView, Platform, StyleSheet } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { configFile } from '../../../config';
import { Stack, useLocalSearchParams } from 'expo-router';
import DashTop from 'components/DashTop';

import { router } from 'expo-router';
import DashBottom from 'components/DashBottom';
import DashLast from 'components/DashLast';
import DashboardStack from 'Stacks/DashboardStack';
import ProfileStack from 'Stacks/HeaderStack';
import { verticalScale } from 'react-native-size-matters';
import { DashMemory } from 'Memory/DashMem';
import DataBase from 'components/DataBaseComp';
import InActive from 'components/InActive';

const greenColor = configFile.colorGreen;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: 'red',
    // paddingBottom: verticalScale(200),
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 72,
    position: 'relative',
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 8,
  },
  dashboardContainer: {
    flex: 1,
    flexDirection: 'column',
    borderRadius: 12,
    backgroundColor: 'white',
    paddingBottom: 80,
    height: '100%',
  },
});

const index = () => {
  const { status } = useLocalSearchParams();
  console.log(status, 'stattt');
  if (status == 'Active') {
    return <InActive />;
  }
  const dashboard = DashMemory((state) => state.dashboard);
  if (dashboard?.user) {
    //const dashBottomdata = dashboard?.user.details.

    const { width, height } = Dimensions.get('window');
    console.log('w:', width, ' h:', height);
    const screenWidth = width;
    const cardSize = (screenWidth - 16 - 8) / 2; // screen padding + gap
    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
      const timer = setTimeout(() => {
        scrollRef.current?.scrollTo({
          y: 400,
          animated: true,
        });
      }, 2000);

      return () => clearTimeout(timer);
    }, []);

    return (
      <>
        <ProfileStack DashBoard={true} role={dashboard.user.details.role} />
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={{
            //   paddingBottom: verticalScale(80),
            paddingHorizontal: 8,
            backgroundColor: 'white',
            // ⚠️ remove flex: 1 and position: "relative" from here
          }}>
          <View style={{ flexDirection: 'column', borderRadius: 12, backgroundColor: 'white' }}>
            <DashTop
              name={dashboard?.user.details.name}
              role={dashboard?.user.details.role}
              employeeId={Number(dashboard?.user.details.id)}
            />

            {
              <DashBottom
                Month={dashboard?.user?.monthlyReports?.month}
                Days={dashboard?.user.monthlyReports.totalDays}
                Absent={dashboard?.user.monthlyReports.absent}
                late={dashboard?.user.monthlyReports.late}
                Dimensions={{
                  width: width - 16,
                  height,
                }}
              />
            }

            <DashLast role={dashboard.user.details.role} cardSize={cardSize} />

            {dashboard.user.details.role === 'Executive' && <DataBase />}
          </View>
        </ScrollView>
      </>
    );
  } else {
    return (
      <View className="flex flex-row items-center justify-center bg-green-300">
        <Text>Some Error Contact The Developer</Text>
      </View>
    );
  }
};

export default index;
