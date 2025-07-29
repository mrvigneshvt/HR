import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import MapView, { UrlTile, Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// Expo-managed compatible: uses only UrlTile for OSM tiles and hides default providers
// Installation: expo install react-native-maps

const MapScreens = ({ latitude = 37.78825, longitude = -122.4324 }) => {
  const region = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // OpenStreetMap tile URL (single subdomain)
  const tileUrl = 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png';

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : null} // use Google on Android to support overlays
        mapType="none" // hide default map tiles
        initialRegion={region}
        region={region} // control region explicitly
      >
        <UrlTile urlTemplate={tileUrl} maximumZ={19} tileSize={256} zIndex={0} />
        <Marker coordinate={{ latitude, longitude }} />
      </MapView>

      {/* Attribution overlay */}
      <View style={styles.attributionContainer} pointerEvents="none">
        <Text style={styles.attribution}>© OpenStreetMap contributors</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  attributionContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  attribution: {
    fontSize: 10,
    color: '#333',
  },
});

export default MapScreens;
