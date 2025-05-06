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
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { DashMemory } from 'Memory/DashMem';
import { Image } from 'expo-image';
import { configFile } from 'config';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const LeaveRequest = () => {
  const [confirm, setConfirm] = useState(false);
  const [sent, setSent] = useState(false);
  const { id, role, name } = DashMemory((state) => state.dashboard?.user.details);

  const [leaveReason, setLeaveReason] = useState('');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  useEffect(() => {
    if (!sent) return;
    const clear = setTimeout(() => {
      router.replace({
        pathname: '/dashboard',
        params: {
          role: 'Employee',
        },
      });
    }, 2000);

    return () => clearTimeout(clear);
  }, [sent]);

  const handleSubmit = () => {
    if (!leaveReason || !fromDate || !toDate) {
      Alert.alert('Missing Fields', 'Please fill all the fields.');
      return;
    } else {
      setConfirm(true);
      setSent(true);
      return;
    }
  };

  if (confirm && sent) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: scale(20),
            backgroundColor: '#f0f4f7',
          }}>
          <Image
            source={require('../../assets/leaveSent.svg')} // use PNG or a compatible format with `Image`
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
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: scale(20),
            backgroundColor: '#f0f4f7',
          }}>
          <Image
            source={require('../../assets/leave.svg')} // use PNG or a compatible format with `Image`
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
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              elevation: 3,
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: moderateScale(16),
                fontWeight: 'bold',
              }}>
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
          <View
            style={{
              flex: 1,
              padding: moderateScale(20),
              backgroundColor: '#f9f9f9',
            }}>
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

            {/* Name (disabled) */}
            <Text
              style={{
                fontSize: scale(14),
                fontWeight: '600',
                marginBottom: verticalScale(6),
                color: '#444',
              }}>
              Name:
            </Text>
            <TextInput
              value={name || ''}
              editable={false}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                padding: moderateScale(10),
                borderRadius: moderateScale(6),
                marginBottom: verticalScale(15),
                backgroundColor: '#eee',
                color: '#555',
              }}
            />

            {/* Employee ID (disabled) */}
            <Text
              style={{
                fontSize: scale(14),
                fontWeight: '600',
                marginBottom: verticalScale(6),
                color: '#444',
              }}>
              Employee ID:
            </Text>
            <TextInput
              value={id || ''}
              editable={false}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                padding: moderateScale(10),
                borderRadius: moderateScale(6),
                marginBottom: verticalScale(15),
                backgroundColor: '#eee',
                color: '#555',
              }}
            />

            {/* Role (disabled) */}
            <Text
              style={{
                fontSize: scale(14),
                fontWeight: '600',
                marginBottom: verticalScale(6),
                color: '#444',
              }}>
              Role:
            </Text>
            <TextInput
              value={role || ''}
              editable={false}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                padding: moderateScale(10),
                borderRadius: moderateScale(6),
                marginBottom: verticalScale(15),
                backgroundColor: '#eee',
                color: '#555',
              }}
            />

            {/* Leave Reason */}
            <Text
              style={{
                fontSize: scale(14),
                fontWeight: '600',
                marginBottom: verticalScale(6),
                color: '#444',
              }}>
              Leave Reason:
            </Text>
            <TextInput
              placeholder="E.g., Marriage, Sick, Travel..."
              value={leaveReason}
              onChangeText={setLeaveReason}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                padding: moderateScale(10),
                borderRadius: moderateScale(6),
                marginBottom: verticalScale(15),
                backgroundColor: '#fff',
              }}
            />

            {/* From Date */}
            <Text
              style={{
                fontSize: scale(14),
                fontWeight: '600',
                marginBottom: verticalScale(6),
                color: '#444',
              }}>
              From Date:
            </Text>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: '#bbb',
                padding: moderateScale(10),
                borderRadius: moderateScale(6),
                marginBottom: verticalScale(15),
                backgroundColor: '#fff',
              }}
              onPress={() => setShowFromPicker(true)}>
              <Text style={{ fontSize: scale(14), color: '#555' }}>
                {fromDate ? formatDate(fromDate) : 'Select From Date'}
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
            <Text
              style={{
                fontSize: scale(14),
                fontWeight: '600',
                marginBottom: verticalScale(6),
                color: '#444',
              }}>
              To Date:
            </Text>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: '#bbb',
                padding: moderateScale(10),
                borderRadius: moderateScale(6),
                marginBottom: verticalScale(15),
                backgroundColor: '#fff',
              }}
              onPress={() => setShowToPicker(true)}>
              <Text style={{ fontSize: scale(14), color: '#555' }}>
                {toDate ? formatDate(toDate) : 'Select To Date'}
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

            {/* Submit Button */}
            <TouchableOpacity
              style={{
                backgroundColor: '#4CAF50',
                paddingVertical: verticalScale(12),
                borderRadius: moderateScale(8),
                alignItems: 'center',
                marginTop: verticalScale(20),
              }}
              onPress={handleSubmit}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: scale(16),
                  fontWeight: 'bold',
                }}>
                Submit Request
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LeaveRequest;
