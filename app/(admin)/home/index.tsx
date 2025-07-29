import React, { useEffect, useState, useCallback, memo } from 'react';
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
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
  Fontisto,
  MaterialIcons,
} from '@expo/vector-icons';

import DashTop from 'components/DashTop';
import CompanySwitch from 'components/CompanySwitch';
import { Api } from 'class/HandleApi';
import { State } from 'class/State';
import { NavRouter } from 'class/Router';
import { Colors } from 'class/Colors';
import { configFile } from '../../../config';
import { LocalStore } from 'class/LocalStore';

const { width } = Dimensions.get('window');
const scaleSize = (size: number) => (width / 360) * size;

const menuCardsList = [
  {
    key: 'employees',
    title: 'Employees',
    icon: 'people',
    description: 'Manage employee records',
    color: '#6a11cb',
    route: '/employeesV2',
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
    key: 'feedback_request',
    title: 'Feedback',
    icon: 'feedback',
    description: 'Manage Feedbacks from Clients',
    color: '#b92b27',
    route: '/emp-plugins/feedback_request',
    type: 'material',
  },
];

// 🎨 Icon component logic
const getIcon = (icon: string, type?: string, color?: string, size = 24) => {
  switch (type) {
    case 'material':
      return <MaterialIcons name={icon} size={size} color={color} />;
    case 'fontisto':
      return <Fontisto name={icon} size={size} color={color} />;
    default:
      return <Ionicons name={icon} size={size} color={color} />;
  }
};

// 📦 Menu card component
const MenuCard = memo(({ item, onPress, bgColor }: any) => (
  <TouchableOpacity
    onPress={() => onPress(item.route)}
    style={[
      styles.card,
      {
        borderLeftColor: item.color,
        backgroundColor: bgColor,
      },
    ]}>
    <View style={styles.cardContent}>
      <View style={styles.cardIcon}>{getIcon(item.icon, item.type, item.color)}</View>
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </View>
      <Ionicons name="chevron-forward-circle-outline" size={scaleSize(22)} color={item.color} />
    </View>
  </TouchableOpacity>
));

// 🏠 Main HomeScreen
const HomeScreen = () => {
  const router = useRouter();
  const {
    role,
    empId: paramEmpId,
    company: paramCompany,
  } = useLocalSearchParams<{
    role: string;
    empId: string;
    company: 'sdce' | 'sq';
  }>();

  const [company, setCompany] = useState<'sdce' | 'sq'>(paramCompany || 'sdce');

  // const getPrefix = useCallback((comp: string) => (comp === 'sdce' ? 'SFM' : 'SQ'), []);
  const [empId, setEmpId] = useState(paramEmpId);

  const [empData, setEmpData] = useState<Record<string, any> | null>(null);

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
    const activeCompany = empId?.toLowerCase().startsWith('sfm') ? 'sdce' : 'sq';
    State.storeCompany(activeCompany);
    setCompany(activeCompany);
    fetchEmpData(empId);
    NavRouter.BackHandler({ role, empId, company: activeCompany });
  }, []);

  useEffect(() => {
    if (paramCompany) setCompany(paramCompany);
  }, [paramCompany]);

  const navigateTo = useCallback(
    (pathname: string) => {
      router.replace({ pathname, params: { role, empId, company } });
    },
    [role, empId, company]
  );

  return (
    <View style={[styles.container, { backgroundColor: Colors.get(company, 'bg') }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Dashboard',
          headerStyle: { backgroundColor: configFile.colorGreen, elevation: 10 },
          headerTintColor: 'white',
          headerTitleStyle: { fontSize: 22, fontWeight: 'bold' },
          headerLeft: () => (
            <View className="mx-2">
              <CompanySwitch setCompany={setCompany} company={company} />
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={() => router.push('/emp-plugins/notification')}>
                <Ionicons name="notifications" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/(admin)/dailyReport',
                    params: { role, empId, company },
                  })
                }>
                <FontAwesome name="paper-plane" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  State.deleteToken();
                  router.replace('/login');
                }}>
                <MaterialIcons name="logout" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {empData && (
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            <DashTop
              role=""
              name={empData.name}
              empId={empId.toUpperCase()}
              img={empData.profile_image}
            />
          </TouchableOpacity>
        )}

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

        {menuCardsList.map((item) => (
          <MenuCard
            key={item.key}
            item={item}
            onPress={navigateTo}
            bgColor={Colors.get(company, 'card')}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

// 🎨 Styles
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
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: scaleSize(16), fontWeight: 'bold', color: '#1f2937' },
  cardDescription: { marginTop: scaleSize(4), fontSize: scaleSize(13), color: '#4b5563' },
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
  quickTextRow: { flexDirection: 'row', gap: scaleSize(4) },
  quickTextMain: { fontSize: scaleSize(18), fontWeight: 'bold', color: '#1f2937' },
  quickIcon: { padding: scaleSize(10), backgroundColor: '#e0f7f1', borderRadius: 999 },
});
