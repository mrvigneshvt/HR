import { View, Text, Dimensions, ScrollView, StyleSheet, BackHandler } from 'react-native';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import DashTop from 'components/DashTop';
import DashBottom from 'components/DashBottom';
import DashLast from 'components/DashLast';
import ProfileStack from 'Stacks/HeaderStack';
import { useEmployeeStore } from 'Memory/Employee';
import { DashMemory } from 'Memory/DashMem';
import { Api } from 'class/HandleApi';
import { useIsFocused } from '@react-navigation/native';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  innerView: {
    flexDirection: 'column',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  fallbackView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightyellow',
  },
});

const Index = () => {
  const isFocus = useIsFocused();
  const { empId, role } = useLocalSearchParams<{ empId: string; role: string }>();
  const employees = useEmployeeStore((state) => state.employee);
  console.log(employees, '//////////////////////////////////////////employexz');
  const [gender, setGender] = useState<string | null>(null);
  const [empData, setEmpData] = useState<Record<string, any>>();

  const scrollRef = useRef<ScrollView>(null);

  const setupEmpData = async () => {
    try {
      console.log('Invoking EMP ID:', empId);
      const response = await Api.getEmpData(String(empId));
      if (!response) {
        console.log('Response Failed...');
      } else {
        console.log('Received emp Data:', response);
        setEmpData(response); // Assuming response has .data
        useEmployeeStore.getState().setEmployee(response);
      }
    } catch (error) {
      console.error('Error fetching emp data:', error);
    }
  };

  // Initial fetch
  useEffect(() => {
    setupEmpData();
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      router.replace({
        pathname: '/(tabs)/dashboard',
        params: {
          role,
          empId,
        },
      });
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, []);
  // Update gender once empData is available
  useEffect(() => {
    console.log('empData Recoeved', empData, 'typeee', typeof empData);
    if (empData) {
      console.log('Added emp data:', empData);
      setGender(empData.gender?.toLowerCase());
      console.log(gender, '///gender');
    }
  }, [empData]);

  // const dashboard = DashMemory((state) => state.dashboard);

  const { width, height } = Dimensions.get('window');
  const cardSize = useMemo(() => (width - 16 - 8) / 2, [width]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 400, animated: true });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const employee = useEmployeeStore((state) => state.employee);
  console.log(employee, 'newEmployeeeeeeeeeee');
  return (
    <>
      <ProfileStack DashBoard={true} role={'Employee'} />
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.innerView}>
          <DashTop
            role={String(role)}
            empId={String(empId)}
            img={employee?.profile_image}
            name={employee?.name}
          />

          {/* <DashBottom
            Month={dashboard?.user?.monthlyReports?.month}
            Days={dashboard?.user.monthlyReports.totalDays}
            Absent={dashboard?.user.monthlyReports.absent}
            late={dashboard?.user.monthlyReports.late}
            Dimensions={{ width: width - 16, height }}
          /> */}

          <DashLast
            role={String(role)}
            cardSize={cardSize}
            empId={String(empId)}
            isMale={gender === 'male' ? true : false}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default Index;
