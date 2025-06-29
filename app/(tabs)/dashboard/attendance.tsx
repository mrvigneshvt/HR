import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
  BackHandler,
  Alert,
  Pressable,
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { useLocalSearchParams, router } from 'expo-router';
import ProfileStack from 'Stacks/HeaderStack';
import { FontAwesome5 } from '@expo/vector-icons';
import { NavRouter } from 'class/Router';

const LocationWithDate = () => {
  const { role, empId } = useLocalSearchParams();
  const [assignedLocations, setAssignedLocations] = useState([]);
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [statusText, setStatusText] = useState('Getting location...');
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(-1);
  const [isNear, setIsNear] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const punchAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const startPunchAnimation = () => {
    punchAnim.setValue(0);
    Animated.spring(punchAnim, {
      toValue: 1,
      friction: 4,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getCurrentLocationAndCheck = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      const { latitude, longitude } = loc.coords;
      setRegion({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });

      setStatusText('Fetching assigned work...');
      fadeIn();

      const today = new Date().toISOString().split('T')[0];
      const res = await axios.get(
        'https://sdce.lyzooapp.co.in:31313/api/attendance/assigned-work',
        {
          params: { employeeId: empId, fromDate: today, toDate: today },
        }
      );

      const records = res.data.records;
      setAssignedLocations(records);
      fadeIn();

      for (let i = 0; i < records.length; i++) {
        setSelectedRecordIndex(i);
        const rec = records[i];
        const dist = getDistance(
          latitude,
          longitude,
          parseFloat(rec.latitude),
          parseFloat(rec.longitude)
        );

        setStatusText(`Comparing with ${rec.client_no}: ${dist.toFixed(1)}m`);
        fadeIn();
        await new Promise((res) => setTimeout(res, 800));

        if (dist <= 100) {
          setIsNear(true);
          setStatusText(`✅ Nearby match at ${rec.client_no} (${dist.toFixed(1)}m)`);
          fadeIn();
          startPunchAnimation();
          break;
        }
      }

      if (!isNear) {
        setStatusText('❌ No nearby location found.');
        fadeIn();
      }
    } catch (err) {
      console.log(err);
      setStatusText('❗ Error getting location or data');
    }
  };

  useEffect(() => {
    getCurrentLocationAndCheck();

    NavRouter.BackHandler({role,empId})
  }, []);

  // Periodic Check only if not near
  useEffect(() => {
    if (isNear) return;
    const timer = setInterval(getCurrentLocationAndCheck, 10000); // every 10s
    return () => clearInterval(timer);
  }, [isNear]);

  const handlePunch = () => {
    Alert.alert('Punch-In', '📍 Punch your Location :)');
  };

  return (
    <View style={{ flex: 1 }}>
      <ProfileStack Attendance={true} />

      <View style={{ height: 300 }}>
        <MapView style={{ flex: 1 }} region={region} showsUserLocation>
          {assignedLocations.map((rec) => (
            <React.Fragment key={rec.id}>
              <Marker
                coordinate={{
                  latitude: parseFloat(rec.latitude),
                  longitude: parseFloat(rec.longitude),
                }}
                title={`Assigned: ${rec.client_no}`}
                pinColor={isNear ? 'green' : 'red'}
              />
              <Circle
                center={{
                  latitude: parseFloat(rec.latitude),
                  longitude: parseFloat(rec.longitude),
                }}
                radius={50}
                strokeColor="rgba(0,0,255,0.5)"
                fillColor="rgba(0,0,255,0.2)"
              />
            </React.Fragment>
          ))}
        </MapView>
      </View>

      {isNear && (
        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center', paddingVertical: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: '#333' }}>Within Location </Text>
        </Animated.View>
      )}

      {/* Punch Button Animation */}
      {isNear && (
        <Animated.View
          style={{
            alignSelf: 'center',
            marginVertical: 10,
            transform: [
              {
                scale: punchAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            ],
          }}>
          <Pressable
            onPress={handlePunch}
            style={{
              backgroundColor: '#f7f7f7',
              borderRadius: 100,
              padding: 20,
              elevation: 5,
              shadowColor: '#000',
              shadowOpacity: 0.3,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              position: 'relative',
            }}>
            <FontAwesome5 name="fingerprint" size={40} color="#3b82f6" />
            <View
              style={{
                position: 'absolute',
                top: -10,
                right: -10,
                backgroundColor: '#3b82f6',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 15,
              }}>
              <Text style={{ color: 'white', fontSize: 12 }}>Punch your Location :)</Text>
            </View>
          </Pressable>
        </Animated.View>
      )}

      <ScrollView style={{ padding: 10 }}>
        {assignedLocations.map((rec, idx) => (
          <View
            key={rec.id}
            style={[styles.card, selectedRecordIndex === idx && styles.activeCard]}>
            <Text style={styles.cardText}>📍 Client: {rec.client_no}</Text>
            <Text style={styles.cardText}>🗓 Date: {rec.attendance_date.split('T')[0]}</Text>
            <Text style={styles.cardText}>
              🧭 Lat: {rec.latitude}, Lon: {rec.longitude}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: '#eee',
    elevation: 2,
  },
  activeCard: {
    backgroundColor: '#d1f7c4',
    borderWidth: 1,
    borderColor: '#3bba00',
  },
  cardText: {
    fontSize: 15,
    color: '#333',
  },
});

export default LocationWithDate;
