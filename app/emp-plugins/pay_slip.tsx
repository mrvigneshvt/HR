import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  BackHandler,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MonthYearPickerHeader from 'components/monthCalendar';
import Pay___Slip from 'components/SalarySlip';
import ProfileStack from 'Stacks/HeaderStack';
import * as MediaLib from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import * as Print from 'expo-print';
import { customPlugins } from 'plugins/plug';
import * as Sharing from 'expo-sharing';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { format } from 'date-fns';
import { Api } from 'class/HandleApi';
import { Image } from 'expo-image';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { configFile } from 'config';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';
import { NavRouter } from 'class/Router';

const PaySlip = () => {
  const { role, empId } = useLocalSearchParams() as { role: string; empId: string };

  const [dates, setDates] = useState<{ year: string; month: string }>(() => {
    const [month, year] = format(new Date(), 'MM-yyyy').split('-');
    return { year, month };
  });

  const [apiData, setApiData] = useState<Record<string, any> | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);
  const captureRefView = useRef(null);

  // const onBackPress = () => {
  //   const pathname = role.toLowerCase() === 'employee' ? '/(tabs)/dashboard/' : '/(admin)/home/';
  //   router.replace({ pathname, params: { role, empId } });
  //   return true;
  // };

  useEffect(() => {
    // BackHandler.addEventListener('hardwareBackPress', onBackPress);
    // return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    NavRouter.BackHandler({ empId, role });
  }, [role]);

  useEffect(() => {
    const fetchPayslip = async () => {
      setApiLoading(true);
      setNotFound(false);

      const res = await Api.fetchPaySlip({ empId, month: dates.month, year: dates.year });
      console.log(res, 'res');

      switch (res) {
        case 'error':
          Alert.alert('Error Fetching Api');
          setTimeout(() => onBackPress(), 2000);
          return;
        case 'invalid-format':
          Alert.alert('Invalid Format');
          return;
        case 'mapping':
          Alert.alert('Api Sents Different Response\n\nERR: UnMapped Response');
          return;
        case 'not-found':
          setNotFound(true);
          setApiLoading(false);
          return;
        default:
          setApiData(res);
          setApiLoading(false);
      }
    };

    fetchPayslip();
  }, [dates, empId]);

  const downloadPayslip = async () => {
    try {
      const permission = await MediaLib.requestPermissionsAsync();
      if (!permission.granted) {
        alert('Permission to Access Media is Required');
        return;
      }

      const uri = await captureRef(captureRefView, {
        format: 'png',
        quality: 1,
        fileName: `Month-${parseInt(dates.month)}-Year-${dates.year}`,
      });

      const html = customPlugins.createPdfFormat(uri);
      const pathToPdf = await Print.printToFileAsync({
        html,
        width: 595,
        height: 842,
        base64: false,
      });

      await Sharing.shareAsync(pathToPdf.uri);
      alert('Saved to Your Files !!');
    } catch (error) {
      console.log('error in downloadslip::', error);
    }
  };

  const handleOpenExternal = async () => {
    const url = `${configFile.backendBaseUrl}payslip/${empId}/${dates.year}-${dates.month}`;
    console.log(url);
    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    } else {
      alert('Cannot open Url');
    }
  };

  return (
    <>
      {/* <ProfileStack Payslip={true} ShowDownload={!apiLoading && !notFound} /> */}
      {/* <Stack.Screen options={{ headerShown: false }} /> */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Home',
          headerStyle: { backgroundColor: configFile.colorGreen },
          headerTintColor: 'white',
          headerRight: () => (
            <View className="flex flex-row gap-1">
              {apiData && !notFound && (
                <TouchableOpacity onPress={() => handleOpenExternal()}>
                  <MaterialIcons name="file-download" size={24} color="white" />
                </TouchableOpacity>
              )}
              {/* <Pressable onPress={() => router.replace('/login')} style={{ paddingHorizontal: 10 }}>
                <MaterialIcons name="logout" size={24} color="white" />
              </Pressable> */}
            </View>
          ),
        }}
      />
      <ScrollView className="flex-1">
        <MonthYearPickerHeader onChange={setDates} />

        {notFound && !apiLoading ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: scale(20),
              backgroundColor: '#fff',
              height: Dimensions.get('window').height - 100,
            }}>
            <Image
              source={require('../../assets/no-data.svg')}
              style={{
                width: scale(220),
                height: verticalScale(220),
                marginBottom: verticalScale(20),
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                fontSize: moderateScale(18),
                fontWeight: '600',
                textAlign: 'center',
                marginBottom: verticalScale(20),
                color: '#333',
              }}>
              Data Not Found
            </Text>
          </View>
        ) : apiLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={configFile.colorGreen} />
          </View>
        ) : (
          <>
            <ScrollView style={{ flex: 1 }}>
              <Pay___Slip
                month={parseInt(dates.month)}
                year={parseInt(dates.year)}
                dataRes={apiData}
              />
            </ScrollView>

            <View
              style={{ position: 'absolute', top: 10000, left: 0 }}
              collapsable={false}
              ref={captureRefView}>
              <Pay___Slip
                month={parseInt(dates.month)}
                year={parseInt(dates.year)}
                dataRes={apiData}
              />
            </View>

            {/* <Pressable onPress={downloadPayslip} style={{ padding: 16 }}>
              <Text style={{ textAlign: 'center', color: '#007AFF' }}>Download Payslip</Text>
            </Pressable> */}
          </>
        )}
      </ScrollView>
    </>
  );
};

export default PaySlip;
