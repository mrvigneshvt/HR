import { View, Text, Pressable, ScrollView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MonthYearPickerHeader from 'components/monthCalendar';
import SalarySlip from 'components/SalarySlip';
import Pay___Slip from 'components/SalarySlip';
import ProfileStack from 'Stacks/HeaderStack';
import * as MediaLib from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import * as Print from 'expo-print';
import { customPlugins } from 'plugins/plug';
import * as Sharing from 'expo-sharing';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { BackHandler } from 'react-native';
const PaySlip = () => {
  const { role, empId } = useLocalSearchParams();
  const [dates, setDates] = useState<{ year: number; month: number }>({
    year: 2025,
    month: 0,
  });
  useEffect(() => {
    const onBackPress = () => {
      router.replace({
        pathname: '/(tabs)/dashboard/',
        params: { role, empId },
      });
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, []);

  const captureRefView = useRef(null);
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
        fileName: `Month-${dates.month + 1}-Year-${dates.year}`,
      });

      console.log(uri);

      const html = customPlugins.createPdfFormat(uri);

      const pathToPdf = await Print.printToFileAsync({
        html,
        width: 595,
        height: 842,
        base64: false,
      });

      console.log(pathToPdf, '//pa');

      await Sharing.shareAsync(pathToPdf.uri);
      alert('Saved to Your Files !!');
      //  const asset = await MediaLib.createAssetAsync(uri);
      //  await MediaLib.createAlbumAsync(
      //    `PaySlip-Month-${dates.month}-Year-${dates.year}`,
      //    asset,
      //    false
      //  );
      //
      //  alert('Saved to Your Files');
    } catch (error) {
      console.log('error in downloadslip::', error);
    }
  };

  const [showDown, setShowDown] = useState(true);
  return (
    <>
      <ProfileStack Payslip={true} ShowDownload={showDown} />
      <ScrollView>
        <View>
          <MonthYearPickerHeader onChange={setDates} />
        </View>

        {/* Visible ScrollView for user */}
        <ScrollView style={{ flex: 1 }}>
          <Pay___Slip month={dates.month + 1} year={dates.year} />
        </ScrollView>

        {/* Hidden full view for screenshot */}
        <View
          style={{ position: 'absolute', top: 10000, left: 0 }} // hide it off-screen
          collapsable={false}
          ref={captureRefView}>
          <Pay___Slip month={dates.month + 1} year={dates.year} />
        </View>

        <Pressable onPress={downloadPayslip}>
          <Text>Download</Text>
        </Pressable>
      </ScrollView>
    </>
  );
};

export default PaySlip;
