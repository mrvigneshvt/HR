import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { configFile } from '../../../config';
import { Api } from 'class/HandleApi';
import { State } from 'class/State';
import { NavRouter } from 'class/Router';
import DashTop from 'components/DashTop';
import { Colors } from 'class/Colors';

const { width } = Dimensions.get('window');
const scaleSize = (size: number) => (width / 360) * size;

const menuCardsList = [
  {
    key: 'employees',
    title: 'Employees',
    icon: 'people',
    description: 'Manage employee records',
    color: '#6a11cb',
    route: '/employees',
  },
  {
    key: 'requests',
    title: 'Requests',
    icon: 'document-text',
    description: 'Manage uniform & leave requests',
    color: '#43cea2',
    route: '/requestV2',
  },
  {
    key: 'clients',
    title: 'Clients',
    icon: 'business',
    description: 'Handle client data',
    color: '#ff512f',
    route: '/clients',
  },
  {
    key: 'attendance',
    title: 'Attendance',
    icon: 'calendar',
    description: 'View attendance logs',
    color: '#00c6ff',
    route: '/attendance',
  },
  {
    key: 'payslip',
    title: 'Pay Slip',
    icon: 'cash',
    description: 'Access payslip info',
    color: '#f7971e',
    route: '/emp-plugins/pay_slip',
  },
  {
    key: 'leave_request',
    title: 'Leave Request',
    icon: 'holiday-village',
    isFontisto: true,
    description: 'Apply for leave',
    color: '#00b09b',
    route: '/emp-plugins/leave_request',
  },
  {
    key: 'uniform_request',
    title: 'Uniform Request',
    icon: 'shirt',
    description: 'Raise Uniform Request for Employees',
    color: '#b92b27',
    route: '/emp-plugins/uniform_request',
  },
];

const HomeScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ role: string; empId: string }>();
  const [company, setCompany] = useState<'sdce' | 'sq'>(State.getCompany() || 'sdce');
  const [empData, setEmpData] = useState<Record<string, any> | null>(null);
  const [empId, setEmpId] = useState(() =>
    params.empId.replace(/^SFM|^SQ/i, company === 'sdce' ? 'SFM' : 'SQ')
  );
  const role = params.role;

  const fetchEmpData = useCallback(async (id: string) => {
    try {
      const response = await Api.getEmpData(id);
      if (response) {
        State.storeEmpData(response);
        setEmpData(response);
      }
    } catch (error) {
      console.error('Error fetching emp data:', error);
    }
  }, []);

  useEffect(() => {
    const activeCompany = State.getCompany() || company;
    const adjustedEmpId = params.empId.replace(
      /^sfm|^sq/i,
      activeCompany === 'sdce' ? 'sfm' : 'sq'
    );
    State.storeCompany(activeCompany);
    setCompany(activeCompany);
    setEmpId(adjustedEmpId);
    fetchEmpData(adjustedEmpId);
    NavRouter.BackHandler({ role, empId: adjustedEmpId, company: activeCompany });
  }, []);

  const switchCompany = () => {
    // const newCompany: 'sdce' | 'sq' = company === 'sdce' ? 'sq' : 'sdce';
    // const newEmpId = empId.replace(/^sfm|^sq/i, newCompany === 'sdce' ? 'sfm' : 'sq');
    // State.storeCompany(newCompany);
    setCompany(newCompany);
    setEmpId(newEmpId);
    fetchEmpData(newEmpId);
    // Replace route after switching
    router.replace({
      pathname: '/(admin)/home',
      params: { role, empId: newEmpId, company: newCompany },
    });
  };

  const navigateTo = useCallback(
    (pathname: string) => {
      router.push({ pathname, params: { role, empId, company } });
    },
    [empId, role, company]
  );

  const renderMenuCard = ({
    key,
    icon,
    title,
    description,
    color,
    route,
    isFontisto,
  }: (typeof menuCardsList)[number]) => (
    <Pressable
      key={key}
      onPress={() => navigateTo(route)}
      style={[
        styles.card,
        {
          borderLeftColor: color,
          backgroundColor: Colors.get(company, 'card'),
        },
      ]}>
      <View style={styles.cardContent}>
        <View style={styles.cardIcon}>
          {isFontisto ? (
            <Fontisto name={icon} size={scaleSize(20)} color={color} />
          ) : (
            <Ionicons name={icon} size={scaleSize(24)} color={color} />
          )}
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
        <Ionicons name="chevron-forward-circle-outline" size={scaleSize(22)} color={color} />
      </View>
    </Pressable>
  );

  const RenderSwitchIcon = () => (
    <TouchableOpacity onPress={switchCompany}>
      {company === 'sdce' ? (
        <MaterialIcons name="security" size={24} color="black" />
      ) : (
        <MaterialCommunityIcons name="broom" size={24} color="black" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: Colors.get(company, 'bg') }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Dashboard',
          headerStyle: {
            backgroundColor: configFile.colorGreen,
            elevation: 10,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold',
          },
          headerRight: () => (
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={() => router.push('/emp-plugins/notification')}>
                <Ionicons name="notifications" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.replace('/login')}>
                <MaterialIcons name="logout" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {empData && (
          <DashTop
            role={''}
            name={empData.name}
            empId={empId.toUpperCase()}
            img={empData.profile_image}
          />
        )}

        {company === 'sdce' && (
          <Pressable
            onPress={() => navigateTo('/(tabs)/dashboard/attendance')}
            style={styles.quickAction}>
            <View>
              <Text style={styles.quickTextSmall}>Quick Action</Text>
              <View style={styles.quickTextRow}>
                <Text style={styles.quickTextMain}>Mark</Text>
                <Text style={[styles.quickTextMain, { color: configFile.colorGreen }]}>
                  Attendance
                </Text>
              </View>
            </View>
            <View style={styles.quickIcon}>
              <FontAwesome name="calendar-check-o" size={22} color="#1abc9c" />
            </View>
          </Pressable>
        )}

        {menuCardsList.map(renderMenuCard)}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

// Styles stay the same as before
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: scaleSize(16),
    paddingTop: scaleSize(16),
  },
  headerIcons: {
    flexDirection: 'row',
    gap: scaleSize(16),
    paddingRight: scaleSize(12),
    alignItems: 'center',
  },
  card: {
    marginBottom: scaleSize(16),
    borderLeftWidth: 6,
    padding: scaleSize(16),
    borderRadius: scaleSize(16),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: scaleSize(48),
    height: scaleSize(48),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: scaleSize(12),
    marginRight: scaleSize(12),
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: scaleSize(16),
    fontWeight: 'bold',
    color: '#1f2937',
  },
  cardDescription: {
    marginTop: scaleSize(4),
    fontSize: scaleSize(13),
    color: '#4b5563',
  },
  quickAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: scaleSize(16),
    backgroundColor: '#fff',
    padding: scaleSize(16),
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: scaleSize(16),
    elevation: 4,
  },
  quickTextSmall: {
    fontSize: scaleSize(12),
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: scaleSize(4),
  },
  quickTextRow: {
    flexDirection: 'row',
    gap: scaleSize(4),
  },
  quickTextMain: {
    fontSize: scaleSize(18),
    fontWeight: 'bold',
    color: '#1f2937',
  },
  quickIcon: {
    padding: scaleSize(10),
    backgroundColor: '#e0f7f1',
    borderRadius: 999,
  },
});
