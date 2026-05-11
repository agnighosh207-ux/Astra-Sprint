import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  icon?: any;
  colors?: [string, string];
  shadowColor?: string;
  style?: ViewStyle;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  label, 
  onPress, 
  icon, 
  colors = [Colors.primary, Colors.primaryDark],
  shadowColor = Colors.primary,
  style 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.wrapper, style]} 
      onPress={onPress} 
      activeOpacity={0.8}
    >
      <LinearGradient 
        colors={colors} 
        start={{x: 0, y: 0}} 
        end={{x: 1, y: 1}}
        style={styles.button}
      >
        {icon && <Ionicons name={icon} size={24} color="#FFF" style={styles.icon} />}
        <Text style={styles.text}>{label}</Text>
      </LinearGradient>
      <View style={[styles.shadow, { backgroundColor: shadowColor }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 24,
    zIndex: 2,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  shadow: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    bottom: -10,
    borderRadius: 24,
    filter: 'blur(15px)',
    opacity: 0.4,
    zIndex: 1,
  },
});
