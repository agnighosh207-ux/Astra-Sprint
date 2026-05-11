import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

const DARK_MAP_STYLE = [
  { "elementType": "geometry", "stylers": [{"color": "#1E293B"}] },
  { "elementType": "labels.text.fill", "stylers": [{"color": "#94A3B8"}] },
  { "elementType": "labels.text.stroke", "stylers": [{"color": "#0F172A"}] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{"color": "#334155"}] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{"color": "#0F172A"}] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{"color": "#000000"}] }
];

interface MissionMapProps {
  region: any;
  routeCoordinates: {latitude: number, longitude: number}[];
  phantomCoord?: any;
}

export default function MissionMap({ region, routeCoordinates, phantomCoord }: MissionMapProps) {
  return (
    <MapView 
      style={styles.map} 
      provider={PROVIDER_GOOGLE}
      customMapStyle={DARK_MAP_STYLE}
      region={region}
      showsUserLocation={true}
      showsMyLocationButton={false}
      showsCompass={false}
    >
      {routeCoordinates.length > 0 && (
        <Polyline 
          coordinates={routeCoordinates} 
          strokeColor="#00FFFF" 
          strokeWidth={4} 
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { ...StyleSheet.absoluteFillObject },
});
