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

const LocationWithDate = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [isNear, setIsNear] = useState(false);
  const lolcation = DashMemory((state) => state.dashboard?.user.dailyAttendance.location);
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

      const { latitude, longitude } = loc.coords;
      setLocation(loc);
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      const nearby = customPlugins.isWithinRadius(
        Number(lolcation?.lat),
        Number(lolcation?.lon),
        latitude,
        longitude
      );

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

  useEffect(() => {
    const setInt = setInterval(() => {
      getCurrentLocation();
    }, 4000); // Increased to 4s to reduce jitter

    return () => clearInterval(setInt);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* MAP VIEW */}
      <View style={{ height: 300 }}>
        <MapView style={{ flex: 1 }} region={region}>
          <Marker
            coordinate={region}
            title={`You are here ${isNear ? '(Inside Location)' : '(Outside Location)'}`}
            pinColor="green"
          />
          {!isNear && lolcation?.lat && lolcation?.lon ? (
            <Circle
              center={{ latitude: Number(lolcation.lat), longitude: Number(lolcation.lon) }}
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
            <AttendanceLocation Region={region} Address={address} isNear={isNear} />
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
