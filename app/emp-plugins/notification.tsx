import { View, Text, SafeAreaView, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Image } from 'expo-image';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

import ProfileStack from 'Stacks/HeaderStack';
import LeaveReqCard from 'components/ApprovalCard';
import UniformReqCard from 'components/UniformReqCard';
import { configFile } from '../../config';
import { useIsFocused } from '@react-navigation/native';
import { Api } from 'class/HandleApi';
import { useEmployeeStore } from 'Memory/Employee';

type RequestType = 'leave' | 'uniform';

type RequestItem = Record<string, any> & { type: RequestType; date: string };

const NotificationScreen = () => {
  const { height, width } = Dimensions.get('window');
  const isFocused = useIsFocused();
  const { employee_id: empId } = useEmployeeStore((state) => state.employee);

  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<RequestItem[]>([]);

  const fetchNotifications = useCallback(async () => {
    if (!empId) return;
    setLoading(true);

    try {
      const [leaveRes, uniformRes] = await Promise.all([
        Api.handleApi({ url: configFile.api.common.getLeaveReq(empId), type: 'GET' }),
        Api.handleApi({ url: configFile.api.common.getUniformReq(empId), type: 'GET' }),
      ]);

      const leaveData = leaveRes?.data || null;
      const uniformData = uniformRes?.data || null;

      console.log(leaveData, '////LeaveData\n\n', uniformData, '////UniData');
      const reqData: RequestItem[] = [];

      if (leaveData?.employeeId) {
        reqData.push({
          type: 'leave',
          id: leaveData._id,
          empId: leaveData.employeeId,
          name: leaveData.employeeName,
          leaveReason: leaveData.leaveType,
          from: leaveData.startDate,
          to: leaveData.endDate,
          date: leaveData.createdAt,
          approvalStatus: leaveData.status,
        });
      }

      if (uniformData?.empId) {
        reqData.push({
          type: 'uniform',
          id: uniformData._id,
          empId: uniformData.empId,
          name: uniformData.name,
          designation: uniformData.designation,
          gender: uniformData.gender,
          site: uniformData.site,
          location: uniformData.location,
          femaleAccessories: uniformData.femaleAccessories,
          date: uniformData.createdAt,
          status: uniformData.status,
        });
      }

      reqData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRequests(reqData);
    } catch (err) {
      console.error('Notification fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [empId]);

  useEffect(() => {
    if (isFocused) {
      fetchNotifications();
    }
  }, [isFocused, fetchNotifications]);

  const renderCards = useMemo(
    () =>
      requests.map((item, index) => (
        <View key={index} style={{ margin: moderateScale(5) }}>
          {item.type === 'leave' ? (
            <LeaveReqCard
              id={item.id}
              name={item.name}
              empId={item.empId}
              leaveReason={item.leaveReason}
              from={item.from}
              to={item.to}
              date={item.date}
              approvalStatus={item.approvalStatus}
            />
          ) : (
            <UniformReqCard
              name={item.name}
              empId={item.empId}
              designation={item.designation}
              gender={item.gender}
              site={item.site}
              location={item.location}
              femaleAccessories={item.femaleAccessories}
              date={item.date}
              status={item.status}
            />
          )}
        </View>
      )),
    [requests]
  );

  const showEmpty = !loading && requests.length === 0;

  return (
    <>
      <ProfileStack Notification={true} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {loading ? (
              <ActivityIndicator size="large" color={configFile.colorGreen} />
            ) : showEmpty ? (
              <View style={{ alignItems: 'center', gap: moderateScale(15) }}>
                <Image
                  source={require('../../assets/chill.svg')}
                  style={{
                    height: height * 0.4,
                    width: width * 0.6,
                    opacity: 0.4,
                  }}
                />
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontSize: moderateScale(16), color: 'gray' }}>
                    Chill! You don't have any{' '}
                  </Text>
                  <Text
                    style={{
                      fontSize: moderateScale(16),
                      fontWeight: '500',
                      color: configFile.colorGreen,
                      opacity: 0.4,
                    }}>
                    Notifications
                  </Text>
                </View>
              </View>
            ) : (
              <ScrollView
                style={{ flex: 1, width: '100%' }}
                contentContainerStyle={{ padding: moderateScale(20) }}>
                {renderCards}
              </ScrollView>
            )}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default NotificationScreen;
