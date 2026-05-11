import React, { memo } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface ThreatRadarProps {
  pulseAnim: Animated.Value;
  isHighThreat: boolean;
}

export const ThreatRadar = memo(({ pulseAnim, isHighThreat }: ThreatRadarProps) => {
  const radarColor = isHighThreat ? Colors.danger : Colors.info;
  
  return (
    <View style={styles.radarWrapper}>
      <Animated.View 
        style={[
          styles.radarRing, 
          { 
            transform: [{ scale: pulseAnim }], 
            borderColor: radarColor 
          }
        ]} 
      />
      <View style={[styles.radarCore, { backgroundColor: radarColor }]}>
        <Ionicons name="radio" size={24} color="#000" />
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  // Only re-render if threat level changes. 
  // pulseAnim is handled by the Animated engine, so we don't need to re-render React component for it.
  return prevProps.isHighThreat === nextProps.isHighThreat;
});

const styles = StyleSheet.create({
  radarWrapper: { 
    width: 80, 
    height: 80, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginHorizontal: 10 
  },
  radarRing: { 
    position: 'absolute', 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    borderWidth: 2, 
    opacity: 0.5 
  },
  radarCore: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 0 }, 
    shadowOpacity: 0.8, 
    shadowRadius: 15, 
    elevation: 10 
  },
});
