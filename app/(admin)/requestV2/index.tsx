// Updated IndexScreen.tsx with working accept/reject modals and toggle handler
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { configFile } from 'config';
import { Entypo, Feather, FontAwesome } from '@expo/vector-icons';
import PaginatedComponent from 'components/Pagination';
import TabSwitcher from 'components/TabSwitch';
import { Api } from 'class/HandleApi';

const IndexScreen = () => {
  const { empId, role } = useLocalSearchParams() as { role: string; empId: string };
  const [activeTab, setActiveTab] = useState<'uniform' | 'leave'>('uniform');
  const [expandedCardId, setExpandedCardId] = useState<string | number | null>(null);
  const [showModal, setShowModal] = useState<'accept' | 'reject' | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  const handleToggle = async (action: 'Approved' | 'Rejected') => {
    if (!selectedRequest) return;
    setLoading(true);
    try {
      const isUniform = !!selectedRequest.gender;
      const url = isUniform
        ? configFile.api.superAdmin.request.uniform.update(selectedRequest._id)
        : configFile.api.superAdmin.request.leaves.update(selectedRequest._id);

      const body = {
        ...selectedRequest,
        status: action,
      };

      const api = await Api.handleApi({ url, type: 'PUT', payload: body });
      Alert.alert(api.status === 200 ? 'Success' : 'Failed', api.data.message);
      if (api.status === 200) {
        setSelectedRequest(null);
        setShowModal(null);
        setReload((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Handle toggle error:', err);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const renderConfirmModal = () => {
    if (!showModal || !selectedRequest) return null;
    const isReject = showModal === 'reject';

    return (
      <Modal visible transparent animationType="slide" onRequestClose={() => setShowModal(null)}>
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => setShowModal(null)}>
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View className="rounded-t-3xl bg-white p-6">
              <Text className="mb-4 text-xl font-bold text-black">
                {isReject ? 'Reject Request' : 'Approve Request'}
              </Text>
              <Text className="mb-4 text-gray-600">
                Are you sure you want to {isReject ? 'Reject' : 'Approve'} this request?
              </Text>
              <View className="flex-row justify-end gap-2">
                <Pressable
                  onPress={() => {
                    setShowModal(null);
                    setSelectedRequest(null);
                  }}
                  className="rounded-lg bg-gray-200 px-4 py-2">
                  <Text>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleToggle(isReject ? 'Rejected' : 'Approved')}
                  className={`rounded-lg px-4 py-2 ${isReject ? 'bg-red-500' : 'bg-green-500'}`}
                  disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white">{isReject ? 'Reject' : 'Approve'}</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#FFA500';
      case 'approved':
        return configFile.colorGreen;
      case 'rejected':
        return '#FF0000';
      default:
        return '#666666';
    }
  };

  const renderRequestCard = ({
    req,
    type,
    showActions,
    idx,
    isExpanded,
    onToggleExpand,
  }: {
    req: any;
    type: 'uniform' | 'leave';
    showActions: boolean;
    idx: number | string;
    isExpanded: boolean;
    onToggleExpand: () => void;
  }) => {
    const formatDate = (dateStr?: string) =>
      dateStr ? new Date(dateStr).toLocaleDateString('en-IN') : null;

    const renderLine = (label: string, value?: string | number) =>
      value ? (
        <Text className="mb-1 text-sm text-gray-700">
          <Text className="font-semibold">{label}: </Text>
          {value}
        </Text>
      ) : null;

    const genderIcon =
      req.gender?.toLowerCase() === 'male'
        ? '♂️'
        : req.gender?.toLowerCase() === 'female'
          ? '♀️'
          : '';

    const statusColor = getStatusColor(req.status);

    return (
      <View key={idx} className="mb-4 overflow-hidden rounded-2xl bg-white shadow-md">
        <TouchableOpacity
          onPress={onToggleExpand}
          className="flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-800">
              {req.name || req.employeeName} {!!genderIcon && genderIcon}
            </Text>
            {renderLine('ID', req.empId || req.employeeId)}
          </View>
          <View className="flex-row items-center space-x-2">
            <View className="h-2 w-2 rounded-full" style={{ backgroundColor: statusColor }} />
            <Entypo name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="gray" />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View className="bg-white px-4 py-3">
            <View className="flex-row flex-wrap justify-between gap-2">
              <View className="w-full md:w-[48%]">
                {renderLine('Designation', req.designation)}
                {renderLine('Site', req.site)}
                {renderLine('Location', req.location)}
                {renderLine('Gender', req.gender)}
              </View>
              <View className="w-full md:w-[48%]">
                {type === 'uniform' ? (
                  <>
                    {req.gender?.toLowerCase() === 'male' ? (
                      <>
                        {renderLine('Shirt Size', req.shirtSize)}
                        {renderLine('Pant Size', req.pantSize)}
                      </>
                    ) : (
                      <>
                        {renderLine('Chudithar Size', req.chuditharSize)}
                        {renderLine('Pant Size', req.pantSize)}
                      </>
                    )}
                    {renderLine('Shoe Size', req.shoeSize || req.femaleShoeSize)}
                    {req.accessories?.length > 0 &&
                      renderLine('Accessories', req.accessories.join(', '))}
                    {req.femaleAccessories?.length > 0 &&
                      renderLine('Accessories', req.femaleAccessories.join(', '))}
                  </>
                ) : (
                  <>
                    {renderLine('Leave Type', req.leaveType)}
                    {renderLine('Duration', req.numberOfDays + ' days')}
                    {renderLine('Start Date', formatDate(req.startDate))}
                    {renderLine('End Date', formatDate(req.endDate))}
                  </>
                )}
              </View>
            </View>

            {/* Status and Actions */}
            <View className="mt-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Text className="font-semibold text-gray-700">Status:</Text>
                <View
                  className="flex-row items-center gap-2 rounded-full px-3 py-1"
                  style={{ backgroundColor: `${statusColor}20` }}>
                  <Text style={{ color: statusColor }}>{req.status}</Text>
                  <Text style={{ color: statusColor }}>{req.approvedName || req.approvedname}</Text>
                </View>
              </View>

              {req.status?.toLowerCase() === 'pending' && showActions && (
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedRequest(req);
                      setShowModal('accept');
                    }}
                    className="rounded-lg bg-green-500 px-3 py-2">
                    <FontAwesome name="check-circle" size={19} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedRequest(req);
                      setShowModal('reject');
                    }}
                    className="rounded-lg bg-red-500 px-3 py-2">
                    <Entypo name="circle-with-cross" size={19} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Requests',
          headerStyle: { backgroundColor: configFile.colorGreen },
          headerTintColor: 'white',
        }}
      />
      <View className="rounded-t-1xl flex-1 bg-white p-6">
        <TabSwitcher
          tabs={['Uniform', 'Leave']}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab.toLowerCase() as 'uniform' | 'leave')}
        />

        {activeTab === 'uniform' ? (
          <PaginatedComponent
            key={'uniform' + reload}
            url={configFile.api.superAdmin.app.uniform}
            limit={10}
            renderItem={({ item, index }) => {
              const action = (item.empId || item.employeeId) !== empId;
              const cardId = item._id ?? index;
              return renderRequestCard({
                req: item,
                type: 'uniform',
                showActions: action,
                idx: cardId,
                isExpanded: expandedCardId === cardId,
                onToggleExpand: () =>
                  setExpandedCardId((prev) => (prev === cardId ? null : cardId)),
              });
            }}
          />
        ) : (
          <PaginatedComponent
            key={'leave' + reload}
            url={configFile.api.superAdmin.app.leave}
            limit={10}
            renderItem={({ item, index }) => {
              const action = (item.empId || item.employeeId) !== empId;
              const cardId = item._id ?? index;
              return renderRequestCard({
                req: item,
                type: 'leave',
                showActions: action,
                idx: cardId,
                isExpanded: expandedCardId === cardId,
                onToggleExpand: () =>
                  setExpandedCardId((prev) => (prev === cardId ? null : cardId)),
              });
            }}
          />
        )}
      </View>
      {renderConfirmModal()}
    </>
  );
};

export default IndexScreen;
