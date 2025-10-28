import {
  View,
  Text,
  Dimensions,
  ScrollView,
  StyleSheet,
  BackHandler,
  Pressable,
  Image,
} from 'react-native';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import DashTop from 'components/DashTop';
import DashBottom from 'components/DashBottom';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DashLast from 'components/DashLast';
import ProfileStack from 'Stacks/HeaderStack';
import { useEmployeeStore } from 'Memory/Employee';
import { DashMemory } from 'Memory/DashMem';
import { Api } from 'class/HandleApi';
import { useIsFocused } from '@react-navigation/native';
import { NavRouter } from 'class/Router';
import { EsiCard } from 'components/EsiCard';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { configFile } from 'config';
import { State } from '../../../class/State';
import TileButton from 'components/TileButton';

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
  const [gender, setGender] = useState<string | null>(null);
  const [empData, setEmpData] = useState<Record<string, any>>();
  const scrollRef = useRef<ScrollView>(null);

  const setupEmpData = async () => {
    try {
      console.log('Invoking EMP ID:', empId);
      const response = await Api.getEmpData(String(empId));
      if (response) {
        console.log('Received emp Data:', response);
        setEmpData(response);
        useEmployeeStore.getState().setEmployee(response);
      } else {
        console.log('Response Failed...');
      }
    } catch (error) {
      console.error('Error fetching emp data:', error);
    }
  };

  useEffect(() => {
    setupEmpData();
  }, []);

  useEffect(() => {
    NavRouter.BackHandler({ role, empId });
  }, []);

  useEffect(() => {
    if (empData) {
      setGender(empData.gender?.toLowerCase());
    }
  }, [empData]);

  const { width, height } = Dimensions.get('window');
  const cardSize = useMemo(() => (width - 16 - 8) / 2, [width]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 400, animated: true });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const employee = useEmployeeStore((state) => state.employee);

  return (
    <>
      {/* ✅ Dashboard Screen Header */}
      <Stack.Screen
        options={{
          title: 'Dashboard',
          headerShown: true,
          headerTintColor: 'white',
          tabBarHideOnKeyboard: true,
          headerStyle: {
            backgroundColor: configFile.colorGreen,
            elevation: 1,
            shadowOpacity: 0,
          },
          headerRight: () => (
            <Pressable
              onPress={() => {
                console.log('Logo pressed!');
                State.deleteToken();
                router.replace('/login');
              }}
              style={{ marginRight: 12 }}>
              <MaterialIcons name="logout" size={24} color="white" />
              {/* <Image
                source={require('../../../assets/logo.png')} // ✅ update path if needed
                style={{ width: 36, height: 36, borderRadius: 8 }}
                resizeMode="contain"
              /> */}
            </Pressable>
          ),
        }}
      />

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

          <DashLast
            role={String(role)}
            cardSize={cardSize}
            empId={String(empId)}
            isMale={gender === 'male'}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default Index;
