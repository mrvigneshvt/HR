import { Link, Stack, Tabs, usePathname } from 'expo-router';
import { configFile } from '../../config';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Header from 'components/Header';
import { KeyboardAvoidingView, View } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function TabLayout() {
  const path = usePathname();
  console.log(path, 'patname');
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'black',

          tabBarStyle: {
            backgroundColor: configFile.colorGreen,
            borderTopWidth: 0,
            display: 'none',
          },
        }}>
        <Tabs.Screen
          name="dashboard/index"
          options={{
            title: 'Dashboard',

            //tabBarStyle: {
            // backgroundColor: 'black',
            // }
            tabBarIcon: () => (
              <MaterialCommunityIcons
                name="monitor-dashboard"
                size={24}
                color={path === '/dashboard' ? 'white' : 'black'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="dashboard/history"
          options={{
            title: 'History',
            tabBarIcon: () => (
              <FontAwesome5
                name="history"
                size={24}
                color={path === '/dashboard/history' ? 'white' : 'black'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="dashboard/attendance"
          options={{
            title: 'Attendance',
            tabBarIcon: () => (
              <AntDesign
                name="pluscircle"
                size={22}
                color={path === '/dashboard/attendance' ? 'white' : 'black'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile/index"
          options={{
            title: 'Profile',
            tabBarIcon: () => (
              <MaterialCommunityIcons
                name="account"
                size={24}
                color={path === '/profile' ? 'white' : 'black'}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
