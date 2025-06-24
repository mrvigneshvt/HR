import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  BackHandler,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useEmployeeStore } from 'Memory/Employee';
import { Image } from 'expo-image';
import { configFile } from 'config';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import { Api } from 'class/HandleApi';
import { format } from 'date-fns'; // ✅ For formatting date
import PopupMessage from 'plugins/popupz';

const LeaveRequest = () => {
  const [confirm, setConfirm] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const [sent, setSent] = useState(false);
  const { employee_id, role, name } = useEmployeeStore((state) => state.employee);

  const [leaveReason, setLeaveReason] = useState('');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [apiMsg, setApiMsg] = useState('');

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('Other');
  const [items, setItems] = useState([
    { label: 'Sick', value: 'Sick' },
    { label: 'Vacation', value: 'Vacation' },
    { label: 'Casual', value: 'Casual' },
    { label: 'Maternity', value: 'Maternity' },
    { label: 'Other', value: 'Other' },
  ]);

  const formatDateString = (date: Date) => format(date, 'yyyy/MM/dd');

  useEffect(() => {
    const onBackPress = () => {
      router.replace({
        pathname: '/(tabs)/dashboard/',
        params: { role, empId: employee_id },
      });
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, []);

  useEffect(() => {
    setLeaveReason(value);
  }, [value]);

  useEffect(() => {
    if (!sent) return;
    console.log('returning to /');
    const clear = setTimeout(() => {
      router.replace({
        pathname: '/dashboard',
        params: { role, empId: employee_id },
      });
    }, 2000);
    return () => clearTimeout(clear);
  }, [sent]);

  const handleSubmit = async () => {
    if (!leaveReason || !fromDate || !toDate) {
      Alert.alert('Missing Fields', 'Please fill all the fields.');
      return;
    }

    const startDate = formatDateString(fromDate);
    const endDate = formatDateString(toDate);

    console.log({ startDate, endDate, leaveReason });

    const data = await Api.postLeaveReq({
      employeeId: employee_id,
      employeeName: name,
      leaveType: leaveReason,
      startDate,
      endDate,
    });

    console.log(data, '.......dat////////////');

    if (data?.status || data?.status == true) {
      Alert.alert(data.message.toUpperCase());
      // setShowPop(true);
      setTimeout(() => {
        router.replace({
          pathname: '/(tabs)/dashboard/',
          params: {
            empId: employee_id,
            role,
          },
        });
      }, 2000);
      return;
    } else {
      Alert.alert(data?.message);
      // setApiMsg(data?.message);
      setShowPop(true);
    }
  };

  if (confirm && sent) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: scale(20),
            backgroundColor: '#f0f4f7',
          }}>
          <Image
            source={require('../../assets/leaveSent.svg')}
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
              borderColor: configFile.colorGreen,
              borderWidth: 2,
              padding: scale(10),
              borderRadius: moderateScale(8),
            }}>
            Your Leave Request Has been Sent!
          </Text>
        </View>
      </>
    );
  }

  if (!confirm) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: scale(20),
            backgroundColor: '#f0f4f7',
          }}>
          <Image
            source={require('../../assets/leave.svg')}
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
            Are you sure you want to take leave?
          </Text>

          <TouchableOpacity
            onPress={() => setConfirm(true)}
            style={{
              backgroundColor: configFile.colorGreen,
              paddingVertical: verticalScale(12),
              paddingHorizontal: scale(30),
              borderRadius: moderateScale(10),
              elevation: 3,
            }}>
            <Text style={{ color: '#fff', fontSize: moderateScale(16), fontWeight: 'bold' }}>
              Yes, I Confirm!
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <Stack.Screen options={{ headerShown: false }} />
        <ScrollView>
          <View style={{ flex: 1, padding: moderateScale(20), backgroundColor: '#f9f9f9' }}>
            <Text
              style={{
                fontSize: scale(22),
                fontWeight: 'bold',
                marginBottom: verticalScale(20),
                textAlign: 'center',
                color: '#333',
              }}>
              Leave Request Form
            </Text>

            {/* Name */}
            <Text className="font-semibold">Name:</Text>
            <TextInput value={name || ''} editable={false} style={inputStyle} />

            {/* Employee ID */}
            <Text className="font-semibold">Employee ID:</Text>
            <TextInput value={employee_id || ''} editable={false} style={inputStyle} />

            {/* Role */}
            <Text className="font-semibold">Role:</Text>
            <TextInput value={role || ''} editable={false} style={inputStyle} />

            {/* Reason */}
            <Text className="font-semibold">Leave Reason:</Text>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder="Select leave reason"
              style={inputStyle}
              dropDownContainerStyle={{ borderColor: '#ccc' }}
            />

            {/* From Date */}
            <Text className="font-semibold">From Date:</Text>
            <TouchableOpacity style={inputStyle} onPress={() => setShowFromPicker(true)}>
              <Text>{fromDate ? formatDateString(fromDate) : 'Select From Date'}</Text>
            </TouchableOpacity>
            {showFromPicker && (
              <DateTimePicker
                value={fromDate || new Date()}
                minimumDate={new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(e, date) => {
                  setShowFromPicker(false);
                  if (date) setFromDate(date);
                }}
              />
            )}

            {/* To Date */}
            <Text className="font-semibold">To Date:</Text>
            <TouchableOpacity style={inputStyle} onPress={() => setShowToPicker(true)}>
              <Text>{toDate ? formatDateString(toDate) : 'Select To Date'}</Text>
            </TouchableOpacity>
            {showToPicker && (
              <DateTimePicker
                value={toDate || new Date()}
                minimumDate={new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(e, date) => {
                  setShowToPicker(false);
                  if (date) setToDate(date);
                }}
              />
            )}

            {/* Submit */}
            <TouchableOpacity
              style={{
                backgroundColor: '#4CAF50',
                paddingVertical: verticalScale(12),
                borderRadius: moderateScale(8),
                alignItems: 'center',
                marginTop: verticalScale(20),
              }}
              onPress={handleSubmit}>
              <Text style={{ color: '#fff', fontSize: scale(16), fontWeight: 'bold' }}>
                Submit Request
              </Text>
            </TouchableOpacity>
            {showPop && <PopupMessage message={apiMsg} onClose={() => setShowPop(false)} />}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const inputStyle = {
  borderWidth: 1,
  borderColor: '#ccc',
  padding: moderateScale(10),
  borderRadius: moderateScale(6),
  marginBottom: verticalScale(15),
  backgroundColor: '#fff',
  color: '#555',
};

export default LeaveRequest;
