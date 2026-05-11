import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface MapProps {
  region?: any;
  routeCoordinates?: any;
  phantomCoord?: any;
}

export default function MissionMap({ region, routeCoordinates, phantomCoord }: MapProps) {
  return (
    <View style={styles.webMapFallback}>
      <Ionicons name="map" size={60} color={Colors.border} />
      <Text style={styles.webMapText}>[MAP UNAVAILABLE ON WEB]</Text>
      <Text style={styles.webMapSubtext}>Please use the mobile app for live telemetry tracking.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  webMapFallback: { 
    flex: 1,
    backgroundColor: Colors.background, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 2, 
    borderColor: Colors.border 
  },
  webMapText: { 
    color: Colors.textDim, 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginTop: 10, 
    letterSpacing: 2 
  },
  webMapSubtext: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 5,
  }
});
