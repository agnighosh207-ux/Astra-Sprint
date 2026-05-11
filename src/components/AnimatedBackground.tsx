import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withDelay,
  Easing 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

export const AnimatedBackground = () => {
  const orb1TranslateX = useSharedValue(0);
  const orb1TranslateY = useSharedValue(0);
  const orb2TranslateX = useSharedValue(0);
  const orb2TranslateY = useSharedValue(0);

  useEffect(() => {
    orb1TranslateX.value = withRepeat(
      withTiming(width * 0.5, { duration: 10000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    orb1TranslateY.value = withRepeat(
      withTiming(height * 0.3, { duration: 15000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    
    orb2TranslateX.value = withRepeat(
      withDelay(2000, withTiming(-width * 0.4, { duration: 12000, easing: Easing.inOut(Easing.sin) })),
      -1,
      true
    );
    orb2TranslateY.value = withRepeat(
      withDelay(2000, withTiming(-height * 0.2, { duration: 18000, easing: Easing.inOut(Easing.sin) })),
      -1,
      true
    );
  }, []);

  const orb1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: orb1TranslateX.value },
      { translateY: orb1TranslateY.value },
    ],
  }));

  const orb2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: orb2TranslateX.value },
      { translateY: orb2TranslateY.value },
    ],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.background, '#020617']} style={StyleSheet.absoluteFill} />
      
      <Animated.View style={[styles.orb, styles.orb1, orb1Style]}>
        <LinearGradient colors={[Colors.primary + '20', 'transparent']} style={styles.gradient} />
      </Animated.View>

      <Animated.View style={[styles.orb, styles.orb2, orb2Style]}>
        <LinearGradient colors={[Colors.info + '15', 'transparent']} style={styles.gradient} />
      </Animated.View>
      
      <View style={styles.overlay} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    overflow: 'hidden',
    zIndex: -1,
  },
  orb: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
  },
  orb1: {
    top: -width * 0.4,
    left: -width * 0.2,
  },
  orb2: {
    bottom: -width * 0.4,
    right: -width * 0.2,
  },
  gradient: {
    flex: 1,
    borderRadius: width * 0.6,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.4)', // Subtle grain/dimmer
  }
});
