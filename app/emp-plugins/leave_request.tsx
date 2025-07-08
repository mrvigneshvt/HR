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
import { hiIN } from 'date-fns/locale';

import { NavRouter } from 'class/Router';

const LeaveRequest = () => {
  const [confirm, setConfirm] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const [sent, setSent] = useState(false);
  const { employee_id: empId, role, name } = useEmployeeStore((state) => state.employee);

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

  const formatDateString = (date: Date) => format(date, 'yyyy/MM/dd', { locale: hiIN });

  useEffect(() => {
    NavRouter.BackHandler({ empId, role });
  }, [confirm]);

  useEffect(() => {
    setLeaveReason(value);
  }, [value]);

  const handleSubmit = async () => {
    if (!leaveReason || !fromDate || !toDate) {
      Alert.alert('Missing Fields', 'Please fill all the fields.');
      return;
    }

    const startDate = fromDate;
    const endDate = toDate;
    // console.
    console.log('before: ', fromDate, '//start\n\n', toDate, { startDate, endDate, leaveReason });

    const data = await Api.postLeaveReq({
      employeeId: empId,
      employeeName: name,
      leaveType: leaveReason,
      startDate,
      endDate,
    });

    console.log(data, '.......dat////////////');

    if (data?.status || data?.status == true) {
      Alert.alert('Success', 'Leave Request Posted Successfully Wait till Management Responds');
      // setShowPop(true);
      setTimeout(() => {
        router.replace({
          pathname: '/emp-plugins/notification', //role.toLowerCase() === 'employee' ? '/(tabs)/dashboard/' : '/(admin)/home/',
          params: {
            empId: empId,
            role,
          },
        });
      }, 2000);
      return;
    } else {
      Alert.alert('Failed', data?.message);
      // setApiMsg(data?.message);
      // setShowPop(true);
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
            <Text className="font-semibold text-black">Name:</Text>
            <TextInput value={name || ''} editable={false} style={inputStyle} />

            {/* Employee ID */}
            <Text className="font-semibold  text-black">Employee ID:</Text>
            <TextInput value={empId || ''} editable={false} style={inputStyle} />

            {/* Role */}
            <Text className="font-semibold  text-black">Role:</Text>
            <TextInput value={role || ''} editable={false} style={inputStyle} />

            {/* Reason */}
            <Text className="font-semibold  text-black">Leave Reason:</Text>
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
            <Text className="font-semibold  text-black">From Date:</Text>
            <TouchableOpacity style={inputStyle} onPress={() => setShowFromPicker(true)}>
              <Text className=" text-black">
                {fromDate ? formatDateString(fromDate) : 'Select From Date'}
              </Text>
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
            <Text className="font-semibold  text-black">To Date:</Text>
            <TouchableOpacity style={inputStyle} onPress={() => setShowToPicker(true)}>
              <Text className=" text-black">
                {toDate ? formatDateString(toDate) : 'Select To Date'}
              </Text>
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
