import MapView, { Marker, UrlTile } from 'react-native-maps';
import { View, Text } from 'react-native';

const MapViewScreen = () => {
  return (
    <View>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 37.7749,
          longitude: -122.4194,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        <UrlTile urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
        <Marker
          coordinate={{
            latitude: 37.7749,
            longitude: -122.4194,
          }}
          title="Location"
        />
      </MapView>
    </View>
  );
};

export default MapViewScreen;
