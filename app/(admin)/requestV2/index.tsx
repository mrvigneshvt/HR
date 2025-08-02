import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Entypo, FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { configFile } from 'config';
import { Api } from 'class/HandleApi';
import { company } from 'Memory/Token';
import PaginatedComponent from 'components/Pagination';
import TabSwitcher from 'components/TabSwitch';
import { Colors } from 'class/Colors';
import IconModal from 'components/AddReq';
import CompanySwitch from 'components/CompanySwitch';
import { useIsFocused } from '@react-navigation/native';

const IndexScreen = () => {
  const { empId, role, company } = useLocalSearchParams<{
    role: string;
    empId: string;
    company: company;
  }>();

  const isFocussed = useIsFocused();

  const [activeTab, setActiveTab] = useState<'uniform' | 'leave' | 'id'>('uniform');
  const [expandedCardId, setExpandedCardId] = useState<string | number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModal, setShowModal] = useState<'accept' | 'reject' | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const [Company, setCompany] = useState<company>(company || 'sdce');

  const switchCompany = () => setCompany((prev) => (prev === 'sdce' ? 'sq' : 'sdce'));

  const apiURL = (tab: 'uniform' | 'leave' | 'id card') => {
    console.log('incoming TAB::: ', tab);
    const prefix = Company === 'sdce' ? '' : 'sq';
    const endpoints = {
      uniform: configFile.api.superAdmin.app[`${prefix}uniform`],
      leave: configFile.api.superAdmin.app[`${prefix}leave`],
      id: configFile.api.superAdmin.request.idcard.get,
    };
    if (tab === 'id card') return endpoints.id;
    console.log(endpoints, '///TOTAL');
    console.log(endpoints[tab], '////ID');
    return endpoints[tab];
  };

  useEffect(() => {
    setCompany(company);
  }, [isFocussed]);

  const handleToggle = async (action: 'Approved' | 'Rejected') => {
    if (!selectedRequest) return;

    setLoading(true);
    try {
      let url: string;
      const isUniform = !!selectedRequest.gender;

      if (activeTab === 'uniform') {
        url = configFile.api.superAdmin.request.uniform.update(selectedRequest._id);
      } else if (activeTab === 'leave') {
        url = configFile.api.superAdmin.request.leaves.update(selectedRequest._id);
      } else {
        url = configFile.api.superAdmin.request.idcard.update;
      }

      const api = await Api.handleApi({
        url,
        type: 'PUT',
        payload:
          activeTab === 'id'
            ? { id: selectedRequest.id, status: action }
            : { ...selectedRequest, status: action },
      });

      const isSuccess = api.status === 200;
      Alert.alert(isSuccess ? 'Success' : 'Failed', api.data.message);

      if (isSuccess) {
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

  const formatDate = (dateStr?: string, sike?: boolean) =>
    dateStr ? new Date(dateStr).toLocaleDateString('en-IN') : null;

  const renderLine = (label: string, value?: string | number) =>
    value ? (
      <Text className="mb-1 text-sm text-gray-700">
        <Text className="font-semibold">{label}: </Text>
        {value}
      </Text>
    ) : null;

  const renderIdCard = ({ size = 24, color = 'black' }) => (
    <FontAwesome name="id-badge" size={size} color={color} />
  );

  const renderRequestCard = ({ req, type, showActions, idx, isExpanded, onToggleExpand }: any) => {
    const genderIcon =
      req.gender?.toLowerCase() === 'male' ? (
        <FontAwesome name="male" size={18} color="#77d2f3" />
      ) : req.gender?.toLowerCase() === 'female' ? (
        <FontAwesome name="female" size={18} color="#f377e4" />
      ) : (
        ''
      );

    const statusColor = getStatusColor(req.status);
    const hasIdBadge = (req.accessories || []).some((acc: string) =>
      acc.toLowerCase().startsWith('id')
    );

    return (
      <View
        key={idx}
        className="mb-4 overflow-hidden rounded-2xl shadow-md"
        style={{ backgroundColor: Colors.get(company, 'card') }}>
        <TouchableOpacity
          onPress={onToggleExpand}
          className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
          <View className="flex-1">
            <Text className="flex-row items-center text-lg font-bold text-gray-800">
              {req.name || req.employeeName || req.employee_name} {genderIcon}
              {hasIdBadge && renderIdCard({ size: 18, color: '#2563eb' })}
            </Text>
            {renderLine('ID', req.empId || req.employeeId || req.employee_id)}
            {renderLine(
              'Requested on',
              req.requested_at ? req.requested_at : formatDate(req.requestedDate || req.createdAt)
            )}
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
                {req.departmant
                  ? renderLine('Department', req.department)
                  : renderLine('Designation', req.designation)}
                {renderLine('Site', req.site)}
                {renderLine('Location', req.location)}
                {renderLine('Gender', req.gender)}
              </View>
              <View className="w-full md:w-[48%]">
                {type === 'uniform' ? (
                  req.gender?.toLowerCase() === 'male' ? (
                    <>
                      {renderLine('Shirt Size', req.shirtSize)}
                      {renderLine('Pant Size', req.pantSize)}
                    </>
                  ) : (
                    <>
                      {renderLine('Chudithar Size', req.chuditharSize)}
                      {renderLine('Pant Size', req.pantSize)}
                    </>
                  )
                ) : type === 'leave' ? (
                  <>
                    {renderLine('Leave Type', req.leaveType)}
                    {renderLine('Duration', req.numberOfDays + ' days')}
                    {renderLine('Start Date', formatDate(req.startDate))}
                    {renderLine('End Date', formatDate(req.endDate))}
                  </>
                ) : null}
                {renderLine('Shoe Size', req.shoeSize || req.femaleShoeSize)}
                {renderLine('Accessories', (req.accessories || req.femaleAccessories)?.join(', '))}
              </View>
            </View>

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

            {req.requestedByName && (
              <View className="mt-4 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Text className="font-semibold text-gray-700">Requested By:</Text>
                  <View
                    className="flex-row items-center gap-2 rounded-full px-3 py-1"
                    style={{ backgroundColor: `${configFile.colorGreen}20` }}>
                    <Text style={{ color: configFile.colorGreen }}>{req.requestedByName}</Text>
                  </View>
                </View>
              </View>
            )}
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
          headerRight: () => (
            <View className="mr-2 flex flex-row items-center justify-center gap-2">
              {/* <CompanySwitch setCompany={setCompany} company={Company} /> */}
              <TouchableOpacity
                onPress={() => setShowAddModal(!showAddModal)}
                className="flex-row rounded-full p-0.5">
                <FontAwesome6 name="add" size={20} color={'white'} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <View
        className="rounded-t-1xl flex-1 bg-white p-6"
        style={{ backgroundColor: Colors.get(Company, 'bg') }}>
        <TabSwitcher
          tabs={['Uniform', 'Leave', 'Id Card']}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab.toLowerCase() as 'uniform' | 'leave' | 'id')}
        />

        <PaginatedComponent
          key={`${activeTab}${reload}`}
          url={apiURL(activeTab)}
          limit={10}
          renderItem={({ item, index }) => {
            const showActions = (item.empId || item.employeeId) !== empId;
            const cardId = item._id ?? index;
            return renderRequestCard({
              req: item,
              type: activeTab,
              showActions,
              idx: cardId,
              isExpanded: expandedCardId === cardId,
              onToggleExpand: () => setExpandedCardId((prev) => (prev === cardId ? null : cardId)),
            });
          }}
        />
      </View>

      {renderConfirmModal()}

      <IconModal
        setShowModal={setShowAddModal}
        showModal={showAddModal}
        empId={empId}
        role={role}
      />
    </>
  );
};

export default IndexScreen;
