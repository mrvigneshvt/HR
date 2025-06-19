import { View, Text, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import ProfileStack from 'Stacks/HeaderStack';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { configFile } from '../../config';
import { DashMemory } from 'Memory/DashMem';
import MailCard from 'components/MailCard';
import NotifTop from 'components/NotifTop';
import ApprovalCard from 'components/ApprovalCard';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useEmployeeStore } from 'Memory/Employee';

const NotificationScreen = () => {
  console.log('role:::', role);
  const { employee_id, role, name } = useEmployeeStore((state) => state.employee);

  const { height, width } = Dimensions.get('window');

  const [getNotificationApp, setGetNotificationApp] = useState<any[]>([]);

  const [state, setState] = useState<'Ann' | 'Req'>('Ann');

  const callback = (data: 'Ann' | 'Req') => {
    setState(data);
  };

  useEffect(() => {}, []);

  // useEffect(() => {
  //   if (role === 'Executive') {
  //     const notifApp = DashMemory.getState().getNotificationApp();
  //     setGetNotificationApp(notifApp);
  //   }
  // }, [role]);

  const showEmptyScreen = getNotification.length < 1 && getNotificationApp.length < 1;

  return (
    <>
      <ProfileStack Notification={true} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }} className="bg-white">
          <View style={{ margin: scale(5), marginTop: verticalScale(12) }}>
            {role === 'Executive' && <NotifTop callback={callback} />}
          </View>

          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
            }}>
            {showEmptyScreen ? (
              <View
                style={{
                  alignItems: 'center',
                  gap: moderateScale(15),
                  backgroundColor: 'white',
                }}>
                <Image
                  source={require('../../assets/chill.svg')}
                  style={{
                    height: height * 0.4,
                    width: width * 0.6,
                    opacity: 0.4,
                  }}
                />
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{
                      fontSize: moderateScale(16),
                      color: 'gray',
                    }}>
                    Chill! You don't have any
                  </Text>
                  <Text
                    style={{
                      fontSize: moderateScale(16),
                      fontWeight: '500',
                      color: configFile.colorGreen,
                      opacity: 0.4,
                    }}>
                    Notification
                  </Text>
                </View>
              </View>
            ) : (
              <ScrollView
                style={{
                  width: '100%',
                  flex: 1,
                  backgroundColor: 'white',
                }}
                contentContainerStyle={{
                  padding: moderateScale(20),
                }}>
                {state === 'Ann'
                  ? getNotification.map((d, i) => (
                      <View key={i} style={{ margin: moderateScale(5) }}>
                        <MailCard from={d.name} message={d.message} date={d.date} />
                      </View>
                    ))
                  : getNotificationApp.map((d, i) => (
                      <View key={i} style={{ margin: moderateScale(5) }}>
                        <ApprovalCard
                          id={d.id}
                          name={d.name}
                          empId={d.empId}
                          leaveReason={d.leaveReason}
                          from={d.from}
                          date={d.date}
                          to={d.to}
                          approvalStatus={d.approvalStatus}
                        />
                      </View>
                    ))}
              </ScrollView>
            )}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default NotificationScreen;
