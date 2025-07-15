import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
  Alert,
  Pressable,
} from 'react-native';
import MapView, { UrlTile, Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import ProfileStack from 'Stacks/HeaderStack';
import { FontAwesome5 } from '@expo/vector-icons';
import { NavRouter } from 'class/Router';
import { format } from 'date-fns';
import { Api } from 'class/HandleApi';
import { configFile } from 'config';

//... (imports remain unchanged)

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
  const [nearbyRecord, setNearbyRecord] = useState(null);
  const [showO1, setShowO1] = useState(false);
  const [isNear, setIsNear] = useState(false);
  const [attendStatus, setAttendStatus] = useState<
    'check_in' | 'lunch_in' | 'check_out' | 'completed' | ''
  >('');
  const [time] = useState(format(new Date(), 'HH:mm:ss'));
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
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const alreadyInit = (datas) => datas.find((d) => d.check_in_time || d.check_in_status) || null;

  const getNextCondition = ({ check_in_time, lunch_in_time, check_out_time }) => {
    if (!check_in_time && !lunch_in_time && !check_out_time) return 'check_in';
    if (check_in_time && !lunch_in_time && !check_out_time) return 'lunch_in';
    if (check_in_time && lunch_in_time && !check_out_time) return 'check_out';
    return 'completed';
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
      const { data } = await axios.get(
        'https://sdce.lyzooapp.co.in:31313/api/attendance/assigned-work',
        {
          params: { employeeId: empId, fromDate: today, toDate: today },
        }
      );

      const records = data.records;
      if (!records || records.length < 1) {
        Alert.alert('No Works Assigned!', 'Chill! You don’t have any work today. Chill and Rest !');
        NavRouter.backOrigin({ role, empId });
        return;
      }

      setAssignedLocations(records);
      const existing = alreadyInit(records);

      if (existing) {
        const dist = getDistance(
          latitude,
          longitude,
          parseFloat(existing.latitude),
          parseFloat(existing.longitude)
        );
        setNearbyRecord(existing);
        setSelectedRecordIndex(records.findIndex((r) => r.id === existing.id));
        const action = getNextCondition(existing);
        setAttendStatus(action);

        if (dist <= 100) {
          setIsNear(true);
          setStatusText(`✅ Within location ${existing.id} - ${action}`);
          fadeIn();
          startPunchAnimation();
        } else {
          setIsNear(false);
          setStatusText(`⚠️ Record exists but not near (${dist.toFixed(1)}m)`);
          fadeIn();
        }
        return;
      }

      for (let i = 0; i < records.length; i++) {
        const rec = records[i];
        const dist = getDistance(
          latitude,
          longitude,
          parseFloat(rec.latitude),
          parseFloat(rec.longitude)
        );
        setSelectedRecordIndex(i);
        setStatusText(`Comparing ${rec.client_no} - ${dist.toFixed(1)}m`);
        fadeIn();
        await new Promise((r) => setTimeout(r, 800));
        if (dist <= 100) {
          setNearbyRecord(rec);
          const action = getNextCondition(rec);
          setAttendStatus(action);
          setIsNear(true);
          setStatusText(`✅ Within location ${rec.id} - ${action}`);
          fadeIn();
          startPunchAnimation();
          return;
        }
      }

      setIsNear(false);
      setStatusText('❌ No nearby location found');
      fadeIn();
    } catch (err) {
      console.error(err);
      setStatusText('❗ Error getting location or data');
    }
  };

  useEffect(() => {
    getCurrentLocationAndCheck();
    NavRouter.BackHandler({ role, empId });
  }, []);

  useEffect(() => {
    if (!isNear) {
      const timer = setInterval(getCurrentLocationAndCheck, 10000);
      return () => clearInterval(timer);
    }
  }, [isNear]);

  const getPunchUrl = () => {
    switch (attendStatus) {
      case 'check_in':
        return configFile.api.attendance.checkIn();
      case 'lunch_in':
        return configFile.api.attendance.lunchIn();
      case 'check_out':
        return configFile.api.attendance.checkOut();
      default:
        return null;
    }
  };

  const handlePunch = async () => {
    if (attendStatus === 'completed') {
      Alert.alert('Chill', 'You already did all the attendance. Take some rest!');
      return;
    }

    const url = getPunchUrl();
    if (!url || !nearbyRecord) return;

    const key = `${attendStatus}_time`;
    const payload = {
      [key]: time,
      latitude: region.latitude,
      longitude: region.longitude,
      attendanceId: nearbyRecord.id,
    };

    const request = await Api.handleApi({ url, type: 'POST', payload });
    console.log(request, '/////Responseeeeeeeeeeeeeeee', payload, '////Payload////', url);
    if ([200, 400, 404, 500].includes(request.status)) {
      Alert.alert(request.status === 200 ? 'Success' : 'Failed', request.data.message);
      NavRouter.backOrigin({ role, empId });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ProfileStack Attendance={true} />
      <View style={{ height: 300 }}>
        <MapView style={{ flex: 1 }} region={region} showsUserLocation={true}>
          <UrlTile urlTemplate="https://c.tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
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

      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center', paddingVertical: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: '500', color: '#333' }}>
          {isNear
            ? `✅ You are near ${nearbyRecord.client_no}/${nearbyRecord.id} - ${getNextCondition(nearbyRecord)}`
            : `Searching For Nearby Client ${time}`}
        </Text>
      </Animated.View>

      {isNear && (
        <Animated.View
          style={{
            alignSelf: 'center',
            marginVertical: 10,
            transform: [
              { scale: punchAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) },
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
            }}>
            <FontAwesome5 name="fingerprint" size={40} color="#3b82f6" />
          </Pressable>
        </Animated.View>
      )}

      <ScrollView style={{ padding: 10 }}>
        {(showO1 && nearbyRecord ? [nearbyRecord] : assignedLocations).map((rec, idx) => (
          <View
            key={rec.id}
            style={[styles.card, selectedRecordIndex === idx && styles.activeCard]}>
            <Text style={styles.cardText}>📍 Company Name: {rec.client_name}</Text>
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
  card: { padding: 12, marginVertical: 6, borderRadius: 10, backgroundColor: '#eee', elevation: 2 },
  activeCard: { backgroundColor: '#d1f7c4', borderWidth: 1, borderColor: '#3bba00' },
  cardText: { fontSize: 15, color: '#333' },
});

export default LocationWithDate;
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   Animated,
//   Easing,
//   Alert,
//   Pressable,
//   ActivityIndicator,
// } from 'react-native';
// import MapLibreGL from '@rnmapbox/maps';
// import * as Location from 'expo-location';
// import axios from 'axios';
// import { useLocalSearchParams } from 'expo-router';
// import ProfileStack from 'Stacks/HeaderStack';
// import { FontAwesome5 } from '@expo/vector-icons';
// import { NavRouter } from 'class/Router';
// import { format } from 'date-fns';
// import { Api } from 'class/HandleApi';
// import { configFile } from 'config';

// // Set access token to null for OSM
// MapLibreGL.setAccessToken(null);

// const LocationWithDate = () => {
//   const { role, empId } = useLocalSearchParams();
//   const [assigned, setAssigned] = useState([]);
//   const [coords, setCoords] = useState(null);
//   const [statusText, setStatusText] = useState('Getting location...');
//   const [nearbyRecord, setNearbyRecord] = useState(null);
//   const [isNear, setIsNear] = useState(false);
//   const [attendStatus, setAttendStatus] = useState('');
//   const [time] = useState(format(new Date(), 'HH:mm:ss'));
//   const [loading, setLoading] = useState(false);

//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const punchAnim = useRef(new Animated.Value(0)).current;

//   const fadeIn = () => {
//     fadeAnim.setValue(0);
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 400,
//       easing: Easing.inOut(Easing.ease),
//       useNativeDriver: true,
//     }).start();
//   };

//   const springPunch = () => {
//     punchAnim.setValue(0);
//     Animated.spring(punchAnim, {
//       toValue: 1,
//       friction: 4,
//       tension: 60,
//       useNativeDriver: true,
//     }).start();
//   };

//   const getDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371000;
//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLon = ((lon2 - lon1) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) ** 2 +
//       Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
//     return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   };

//   const alreadyInit = (recs) =>
//     recs.find((r) => r.check_in_time || r.lunch_in_time || r.check_out_time);
//   const getNext = ({ check_in_time, lunch_in_time, check_out_time }) =>
//     !check_in_time
//       ? 'check_in'
//       : !lunch_in_time
//         ? 'lunch_in'
//         : !check_out_time
//           ? 'check_out'
//           : 'completed';

//   const getPunchUrl = () => {
//     switch (attendStatus) {
//       case 'check_in':
//         return configFile.api.attendance.checkIn();
//       case 'lunch_in':
//         return configFile.api.attendance.lunchIn();
//       case 'check_out':
//         return configFile.api.attendance.checkOut();
//       default:
//         return null;
//     }
//   };

//   const fetchAndCheck = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') return;
//       const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
//       const { latitude, longitude } = loc.coords;
//       setCoords({ latitude, longitude });

//       setStatusText('Fetching assigned work...');
//       fadeIn();

//       const today = new Date().toISOString().slice(0, 10);
//       const res = await axios
//         .get(configFile.api.attendance.assignedWork, {
//           params: { employeeId: empId, fromDate: today, toDate: today },
//         })
//         .catch(() => ({ data: {} }));
//       const records = res.data.records || [];
//       if (!records.length) {
//         Alert.alert('No Works Assigned!', '', 'You have no tasks today.');
//         return NavRouter.backOrigin({ role, empId });
//       }
//       setAssigned(records);

//       const existing = alreadyInit(records);
//       let record = existing;
//       if (!record) {
//         record = records.find((r) => {
//           const dist = getDistance(latitude, longitude, +r.latitude, +r.longitude);
//           return dist <= 100;
//         });
//       }

//       if (record) {
//         const dist = getDistance(latitude, longitude, +record.latitude, +record.longitude);
//         const action = getNext(record);
//         setNearbyRecord(record);
//         setAttendStatus(action);
//         const near = dist <= 100;
//         setIsNear(near);
//         setStatusText(
//           near ? `✅ Within location ${record.id} - ${action}` : `⚠️ Not within ${dist.toFixed(1)}m`
//         );
//         fadeIn();
//         if (near) springPunch();
//       } else {
//         setIsNear(false);
//         setStatusText('❌ No nearby client found');
//         fadeIn();
//       }
//     } catch (e) {
//       console.error(e);
//       setStatusText('❗ Error fetching location or data');
//     }
//   };

//   const handlePunch = async () => {
//     if (attendStatus === 'completed') {
//       return Alert.alert('Done', 'You already completed today’s attendance.');
//     }
//     const url = getPunchUrl();
//     if (!url || !nearbyRecord || !coords) return;
//     const payload = {
//       [`${attendStatus}_time`]: time,
//       latitude: coords.latitude,
//       longitude: coords.longitude,
//       attendanceId: nearbyRecord.id,
//     };
//     const r = await Api.handleApi({ url, type: 'POST', payload }).catch((e) => e);
//     Alert.alert(r.status === 200 ? 'Success' : 'Failed', r.data?.message || '');
//     NavRouter.backOrigin({ role, empId });
//   };

//   useEffect(() => {
//     fetchAndCheck();
//     NavRouter.BackHandler({ role, empId });
//   }, []);

//   useEffect(() => {
//     if (!isNear) {
//       const timer = setInterval(fetchAndCheck, 10000);
//       return () => clearInterval(timer);
//     }
//   }, [isNear]);

//   return (
//     <View style={{ flex: 1 }}>
//       <ProfileStack Attendance />
//       <View style={{ height: 300 }}>
//         {coords && (
//           <MapLibreGL.MapView style={{ flex: 1 }}>
//             <MapLibreGL.Camera
//               zoomLevel={15}
//               centerCoordinate={[coords.longitude, coords.latitude]}
//             />
//             <MapLibreGL.RasterSource
//               id="osm"
//               tileSize={256}
//               tiles={['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png']}>
//               <MapLibreGL.RasterLayer id="osmLayer" sourceID="osm" />
//             </MapLibreGL.RasterSource>
//             <MapLibreGL.PointAnnotation id="you" coordinate={[coords.longitude, coords.latitude]} />
//             {assigned.map((r) => (
//               <MapLibreGL.PointAnnotation
//                 key={r.id}
//                 id={String(r.id)}
//                 coordinate={[+r.longitude, +r.latitude]}>
//                 <View
//                   style={[styles.marker, nearbyRecord?.id === r.id ? styles.markerNear : null]}
//                 />
//               </MapLibreGL.PointAnnotation>
//             ))}
//           </MapLibreGL.MapView>
//         )}
//       </View>

//       <Animated.View style={{ opacity: fadeAnim, alignItems: 'center', padding: 10 }}>
//         <Text style={styles.status}>{statusText}</Text>
//       </Animated.View>

//       {isNear && (
//         <Animated.View
//           style={{
//             alignSelf: 'center',
//             margin: 10,
//             transform: [
//               { scale: punchAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) },
//             ],
//           }}>
//           <Pressable
//             onPress={() => {
//               setLoading(true);
//               handlePunch();
//               setLoading(false);
//             }}
//             style={styles.punchBtn}>
//             {!loading ? (
//               <FontAwesome5 name="fingerprint" size={40} color="#3b82f6" />
//             ) : (
//               <ActivityIndicator color="blue" />
//             )}
//           </Pressable>
//         </Animated.View>
//       )}

//       <ScrollView style={{ padding: 10 }}>
//         {(nearbyRecord ? [nearbyRecord] : assigned).map((r, i) => (
//           <View key={r.id} style={[styles.card, nearbyRecord?.id === r.id && styles.active]}>
//             <Text style={styles.cardText}>📍 {r.client_name}</Text>
//             <Text style={styles.cardText}>
//               🧭 {r.latitude}, {r.longitude}
//             </Text>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   marker: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'red' },
//   markerNear: { backgroundColor: 'green' },
//   punchBtn: { backgroundColor: '#f7f7f7', borderRadius: 100, padding: 20, elevation: 5 },
//   status: { fontSize: 16, fontWeight: '500', color: '#333' },
//   card: { padding: 12, marginVertical: 6, borderRadius: 10, backgroundColor: '#eee' },
//   active: { backgroundColor: '#d1f7c4', borderWidth: 1, borderColor: '#3bba00' },
//   cardText: { fontSize: 15, color: '#333' },
// });

// export default LocationWithDate;
