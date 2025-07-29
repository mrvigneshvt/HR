import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Linking,
  Modal,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import MonthYearPickerHeader from 'components/monthCalendar';
import PaySlipComponent from 'components/SalarySlip';
import EntityDropdown from 'components/DropDown';
import { captureRef } from 'react-native-view-shot';
import * as MediaLib from 'expo-media-library';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Api } from 'class/HandleApi';
import { NavRouter } from 'class/Router';
import { configFile } from 'config';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Image } from 'expo-image';
import { customPlugins } from 'plugins/plug';

const PaySlip = () => {
  const { role, empId: initialEmpId, company } = useLocalSearchParams();
  const [empId, setEmpId] = useState(initialEmpId);
  const [showModal, setShowModal] = useState(false);
  const [apiData, setApiData] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);
  const captureRefView = useRef(null);

  const [dates, setDates] = useState(() => {
    const [month, year] = format(new Date(), 'MM-yyyy').split('-');
    return { year, month };
  });

  useEffect(() => {
    NavRouter.BackHandler({ empId: initialEmpId, role, company });
  }, [initialEmpId, role, company]);

  const fetchPayslip = useCallback(async () => {
    setApiLoading(true);
    setNotFound(false);

    const res = await Api.fetchPaySlip({ empId, ...dates });

    if (res === 'error') {
      Alert.alert('Error Fetching API');
      return setTimeout(() => router.back(), 2000);
    }

    if (['invalid-format', 'mapping'].includes(res)) {
      return Alert.alert('Invalid API Response');
    }

    if (res === 'not-found') {
      setNotFound(true);
      setApiData(null);
    } else {
      setApiData(res);
    }

    setApiLoading(false);
  }, [dates, empId]);

  useEffect(() => {
    fetchPayslip();
  }, [fetchPayslip]);

  const downloadPayslip = async () => {
    const { granted } = await MediaLib.requestPermissionsAsync();
    if (!granted) return alert('Permission to access media is required');

    try {
      const uri = await captureRef(captureRefView, {
        format: 'png',
        quality: 1,
        fileName: `Month-${parseInt(dates.month)}-Year-${dates.year}`,
      });

      const html = customPlugins.createPdfFormat(uri);
      const { uri: pdfUri } = await Print.printToFileAsync({
        html,
        width: 595,
        height: 842,
      });

      await Sharing.shareAsync(pdfUri);
      alert('Saved to your files!');
    } catch (error) {
      console.error('Error downloading payslip:', error);
    }
  };

  const handleOpenExternal = async () => {
    const url = `${configFile.backendBaseUrl}payslip/${empId}/${dates.year}-${dates.month}`;
    Linking.canOpenURL(url) ? await Linking.openURL(url) : alert('Cannot open URL');
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Payslip',
          headerStyle: { backgroundColor: configFile.colorGreen },
          headerTintColor: 'white',
          headerRight: () => (
            <View style={styles.headerIcons}>
              {apiData && !notFound && !apiLoading && (
                <TouchableOpacity onPress={handleOpenExternal}>
                  <MaterialIcons name="file-download" size={24} color="white" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setShowModal(true)}>
                <AntDesign name="idcard" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView style={{ flex: 1 }}>
        <MonthYearPickerHeader onChange={setDates} employeeName={empId} />

        {apiLoading ? (
          <ActivityIndicator style={{ marginTop: 50 }} size="large" color={configFile.colorGreen} />
        ) : notFound ? (
          <View style={styles.noDataContainer}>
            <Image source={require('../../assets/no-data.svg')} style={styles.noDataImage} />
            <Text style={styles.noDataText}>Data Not Found</Text>
          </View>
        ) : (
          <>
            <PaySlipComponent
              month={parseInt(dates.month)}
              year={parseInt(dates.year)}
              dataRes={apiData}
            />
            <View style={styles.hiddenView} collapsable={false} ref={captureRefView}>
              <PaySlipComponent
                month={parseInt(dates.month)}
                year={parseInt(dates.year)}
                dataRes={apiData}
              />
            </View>
          </>
        )}
      </ScrollView>

      <Modal
        visible={showModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Employee</Text>
            <EntityDropdown
              type="employee"
              selected={empId}
              setState={(value) => {
                setEmpId(value);
                setShowModal(false);
              }}
            />
            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.modalCloseBtn}>
              <Text style={{ color: configFile.colorGreen }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default PaySlip;

const styles = StyleSheet.create({
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(20),
    height: Dimensions.get('window').height - 100,
  },
  noDataImage: {
    width: scale(220),
    height: verticalScale(220),
    marginBottom: verticalScale(20),
  },
  noDataText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#333',
  },
  hiddenView: {
    position: 'absolute',
    top: 10000,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  modalCloseBtn: {
    marginTop: 20,
    alignSelf: 'flex-end',
  },
});
