import React from 'react';
import { StyleSheet, View, ViewStyle, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/Colors';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  accentColor?: string;
  onPress?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, accentColor, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    if (onPress) scale.value = withSpring(1);
  };

  const Content = (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      <BlurView intensity={15} tint="dark" style={styles.blur}>
        <View style={[
          styles.inner, 
          accentColor ? { borderTopColor: accentColor, borderTopWidth: 2 } : null
        ]}>
          {children}
        </View>
      </BlurView>
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        activeOpacity={1} 
        onPress={onPress} 
        onPressIn={handlePressIn} 
        onPressOut={handlePressOut}
      >
        {Content}
      </TouchableOpacity>
    );
  }

  return Content;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(17, 24, 39, 0.7)',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  blur: {
    flex: 1,
  },
  inner: {
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.02)', // Subtle inner glow
  },
});
