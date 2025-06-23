import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { configFile } from '../../../config';
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
import TimeDetails from 'components/TimeDetails';
import AttendanceLocation from 'components/AttendanceLocation';
import { DashMemory } from 'Memory/DashMem';
import { customPlugins } from 'plugins/plug';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { BackHandler } from 'react-native';
import ProfileStack from 'Stacks/HeaderStack';

const LocationWithDate = () => {
  const { role, empId } = useLocalSearchParams();
  const [lolcation, setLocalCation] = useState({
    lat: 0,
    lon: 0,
  });
  useEffect(() => {
    const path = role.toLowerCase() == 'employee' ? '/(tabs)/dashboard' : '/(admin)/home';
    const onBackPress = () => {
      router.replace({
        pathname: path,
        params: { role, empId },
      });
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, []);

  // const [showButton, setShowButton] = useState(false);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [isNear, setIsNear] = useState(false);
  // const lolcation = DashMemory((state) => state.dashboard?.user.dailyAttendance.location);
  const [state, setState] = useState('Loc');
  const toggleButton = (val) => setState(val);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      let { latitude, longitude } = loc.coords;
      // latitude = 13.0540762;
      // longitude = 80.2418275;
      // console.log(loc.coords, '////LocCooords');
      setLocation(loc);
      // console.log(latitude, longitude, 'location///////////');
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      // console.log(region, '////////////?????Regiojsaidosadjsa');

      console.log(
        `invoking near\n\nfrom us: ${latitude} ${longitude}}\nto Api:${lolcation.lat}${lolcation.lon}`
      );
      const nearby = customPlugins.isWithinRadius(
        lolcation?.lat,
        lolcation?.lon,
        latitude,
        longitude,
        50
      );
      console.log(nearby, '/////////NEARByyy');

      setIsNear(nearby);

      const addr = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (addr.length > 0) {
        const { name, city, region, country } = addr[0];
        setAddress(`${name}, ${city}, ${region}, ${country}`);
      }
    } catch (err) {
      console.log('Location error:', err);
    }
  };

  const handleCbL = (options: { lat: number; lon: number }) => {
    console.log('Triggering HANDLE CBL::: ', options.lat, '////', options.lon);
    setLocalCation(options);
  };

  // useEffect(() => {
  //   if (!region.latitude || region.longitude) return;
  //   setShowButton(true);
  // }, [region]);

  useEffect(() => {
    if (!lolcation.lat || !lolcation.lon) return;

    console.log('lolcation::', lolcation);
    const setInt = setInterval(() => {
      getCurrentLocation();
    }, 4000); // polling every 4s

    return () => clearInterval(setInt);
  }, [lolcation]); // ✅ trigger when `lolcation` is updated

  return (
    <View style={{ flex: 1 }}>
      <ProfileStack Attendance={true} />
      {/* MAP VIEW */}
      <View style={{ height: 300 }}>
        <MapView style={{ flex: 1 }} region={region}>
          <Marker
            coordinate={region}
            title={`You are here ${isNear ? '(Inside Location)' : '(Outside Location)'}`}
            pinColor="green"
          />
          {lolcation?.lat && lolcation?.lon ? (
            <Circle
              center={{ latitude: lolcation.lat, longitude: lolcation.lon }}
              radius={60} // Slight buffer added
              strokeWidth={2}
              strokeColor="rgba(0,0,255,0.5)"
              fillColor="rgba(0,0,255,0.2)"
            />
          ) : null}
        </MapView>
      </View>

      {/* TAB CONTROLS */}
      <View style={styles.tabContainer}>
        <Pressable
          onPress={() => toggleButton('Loc')}
          style={[styles.tab, state === 'Loc' && styles.activeTab]}>
          <Text style={[styles.tabText, state === 'Loc' && styles.activeTabText]}>Location</Text>
        </Pressable>
        <Pressable
          onPress={() => toggleButton('Tim')}
          style={[styles.tab, state === 'Tim' && styles.activeTab]}>
          <Text style={[styles.tabText, state === 'Tim' && styles.activeTabText]}>
            Time Details
          </Text>
        </Pressable>
      </View>

      {/* CONTENT */}
      <View style={{ flex: 1 }}>
        {state === 'Tim' ? (
          <TimeDetails />
        ) : (
          <ScrollView>
            <AttendanceLocation
              empId={String(empId)}
              role={String(role)}
              Region={region}
              Address={address}
              isNear={isNear}
              cbLocation={handleCbL}
              // showButton={showButton}
            />
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  activeTab: {
    backgroundColor: configFile.colorGreen,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
  activeTabText: {
    color: 'white',
  },
});

export default LocationWithDate;
