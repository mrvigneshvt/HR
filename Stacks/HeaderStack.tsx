import { router, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, View } from 'react-native';
import { configFile } from '../config';
import Sidebar from 'components/sidebar';
import { populateEvents } from 'react-native-calendars/src/timeline/Packer';
import { minutesInDay } from 'date-fns/constants';
import History from '../app/(tabs)/dashboard/history';
import AntDesign from '@expo/vector-icons/AntDesign';
import notification from '../app/emp-plugins/notification';

interface LogoOptions {
  notification?: boolean;
  logout?: boolean;
  backScreen?: boolean;
  download?: boolean; // only for payslip
}

const options = (
  title: string,
  isNotif?: boolean,
  options?: LogoOptions,
  role?: 'Employee' | 'Executive'
) => {
  if (title && options && role) {
    return {
      headerLeft: () => (
        <Pressable
          onPress={() => router.back()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 5,
            right: 0,
          }}
          android_ripple={{ color: '#ccc' }}>
          <Ionicons name="chevron-back" size={24} color="white" />
          <AntDesign name="home" size={24} color="white" style={{ marginLeft: 4 }} />
        </Pressable>
      ),
      headerRight: () => (
        <>
          <View className="flex-row gap-4">
            {options.logout && (
              <>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/emp-plugins/notification',
                      params: {
                        role,
                      },
                    })
                  }>
                  <Ionicons name="notifications" size={24} color="black" />
                </Pressable>
              </>
            )}
            {options.logout && (
              <>
                <Pressable
                  className="bg-white"
                  onPress={() => {
                    console.log('invoking logout');
                    router.replace('/');
                  }}>
                  <MaterialIcons name="logout" size={24} color="black" />
                </Pressable>
              </>
            )}
            {options.download && (
              <>
                <Pressable className="rounded-2xl bg-white p-1">
                  <MaterialIcons name="file-download" size={24} color={configFile.colorGreen} />
                </Pressable>
              </>
            )}
          </View>
        </>
      ),
      tabBarHideOnKeyboard: true,
      title,
      headerShown: true,
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: configFile.colorGreen,
        elevation: 1, //android
        shadowOpacity: 0, //ios
      },
    };
  }
  if (title && isNotif) {
    console.log('notifiiii');
    return {
      headerLeft: () => (
        <>
          <Pressable
            onPress={() => router.back()}
            style={{ display: 'flex', flexDirection: 'row', right: 16 }}>
            <Ionicons name="chevron-back" size={24} color="white" />
            <AntDesign name="home" size={24} color="white" />
          </Pressable>
        </>
      ),
      tabBarHideOnKeyboard: true,
      title,
      headerShown: true,
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: configFile.colorGreen,
        elevation: 1, //android
        shadowOpacity: 0, //ios
      },
    };
  }

  if (title) {
    return {
      tabBarHideOnKeyboard: true,
      title,
      headerShown: true,
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: configFile.colorGreen,
        elevation: 1, //android
        shadowOpacity: 0, //ios
      },
      headerLeft: () => (
        <>
          {
            //<Sidebar />
          }
        </>
      ),
      headerRight: () => (
        <>
          <View className="flex-row gap-4">
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/emp-plugins/notification',
                  params: {
                    role,
                  },
                })
              }>
              <Ionicons name="notifications" size={24} color="black" />
            </Pressable>
            <Pressable onPress={() => router.replace('/')}>
              <MaterialIcons name="logout" size={24} color="black" />
            </Pressable>
          </View>
        </>
      ),
    };
  }
};

type Props = {
  role?: 'Employee' | 'Executive';
  Profile?: boolean;
  DashBoard?: boolean;
  Attendance?: boolean;
  History?: boolean;
  Notification?: boolean;
  Uniform?: boolean;
  IdCard?: boolean;
  Payslip?: boolean;
  ShowDownload?: boolean;
  Database?: boolean;
};

export default function ProfileStack({
  role,
  Notification,
  Profile,
  DashBoard,
  Attendance,
  History,
  Uniform,
  IdCard,
  Payslip,
  ShowDownload,
  Database,
}: Props) {
  if (Database) {
    return (
      <Stack.Screen
        options={{
          tabBarHideOnKeyboard: true,
          title: 'DataBase',
          headerShown: true,
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: configFile.colorGreen,
            elevation: 1, //android
            shadowOpacity: 0, //ios
          },
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginLeft: 0,
                paddingLeft: 0,
                right: 16,
              }}
              android_ripple={{ color: '#ccc' }}>
              <Ionicons name="chevron-back" size={24} color="white" />
              <AntDesign name="home" size={24} color="white" style={{ marginLeft: 4 }} />
            </Pressable>
          ),
        }}
      />
    );
  }
  if (Payslip || (Payslip && ShowDownload)) {
    return (
      <Stack.Screen
        options={options('Monthly Salary Details', false, {
          logout: false,
          backScreen: true,
          notification: false,
          download: ShowDownload,
        })}
      />
    );
  }
  if (IdCard) {
    return (
      <Stack.Screen
        options={options('Identity Card', false, {
          logout: false,
          backScreen: true,
          notification: false,
        })}
      />
    );
  }
  if (History && role) {
    return <Stack.Screen options={options('History', undefined, undefined, role)} />;
  }
  if (Uniform) {
    return (
      <Stack.Screen
        options={options('Uniform Request', false, {
          logout: false,
          backScreen: true,
          notification: true,
        })}
      />
    );
  }
  if (Attendance) {
    return <Stack.Screen options={options('Attendance')} />;
  }
  if (Profile) {
    return <Stack.Screen options={options('Profile')} />;
  }
  if (DashBoard && role) {
    return <Stack.Screen options={options('Dashboard', undefined, undefined, role)} />;
  }
  if (Notification) {
    return <Stack.Screen options={options('Notification', true)} />;
  }
}
