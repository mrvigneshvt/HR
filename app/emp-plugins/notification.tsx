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
import { NavRouter } from 'class/Router';

type RequestType = 'leave' | 'uniform';
type RequestItem = Record<string, any> & { type: RequestType; date: string };

const NotificationScreen = () => {
  const { height, width } = Dimensions.get('window');
  const isFocused = useIsFocused();
  const { employee_id: empId, role } = useEmployeeStore((state) => state.employee);

  useEffect(() => {
    NavRouter.BackHandler({ role, empId });
  }, []);

  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<RequestItem[]>([]);

  const getApiRequests = (empId: string, role: string) => {
    const leaveReq = Api.handleApi({
      url: configFile.api.common.getLeaveReq(empId),
      type: 'GET',
    });

    const uniformReq =
      role.toLowerCase() === 'employee'
        ? Api.handleApi({
            url: configFile.api.common.getUniformReq(empId),
            type: 'GET',
          })
        : Promise.resolve(null);

    return Promise.all([leaveReq, uniformReq]);
  };

  const fetchNotifications = useCallback(async () => {
    if (!empId) return;
    setLoading(true);

    try {
      setRequests([]);
      const [leaveRes, uniformRes] = await getApiRequests(empId, role);
      const leaveData = leaveRes?.data ?? [];
      const uniformData = uniformRes?.data ?? [];

      console.log(leaveData, '///LeaveData\n\n');
      const formattedLeaves = leaveData
        .filter((d: any) => d?.employeeId)
        .map((d: any) => ({
          type: 'leave',
          id: d._id,
          empId: d.employeeId,
          name: d.employeeName,
          leaveReason: d.leaveType,
          from: d.startDate.split('T')[0],
          to: d.endDate.split('T')[0],
          date: d.createdAt.split('T')[0],
          approvalStatus: d.status,
          approvedBy: d.approvedBy,
          approvedName: d.approvedname,
        }));

      console.log(formattedLeaves, '////Formatted LEaces');

      const formattedUniforms = uniformData
        .filter((d: any) => d?.empId)
        .map((d: any) => ({
          type: 'uniform',
          id: d._id,
          empId: d.empId,
          name: d.name,
          designation: d.designation,
          gender: d.gender,
          site: d.site,
          location: d.location,
          femaleAccessories: d.femaleAccessories,
          date: d.createdAt,
          status: d.status,
        }));

      const allRequests = [...formattedLeaves, ...formattedUniforms].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setRequests(allRequests);
      console.log('\n\n', requests);
    } catch (err) {
      console.error('Notification fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [empId, role]);

  useEffect(() => {
    if (isFocused) fetchNotifications();
  }, [isFocused, fetchNotifications]);

  const renderCards = useMemo(
    () =>
      requests.map((item, index) => (
        <View key={item.id || index} style={{ margin: moderateScale(5) }}>
          {item.type === 'leave' ? <LeaveReqCard {...item} /> : <UniformReqCard {...item} />}
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
