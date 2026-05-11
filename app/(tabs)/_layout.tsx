import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors } from '../../src/constants/Colors';

const { width } = Dimensions.get('window');
const isDesktop = Platform.OS === 'web' && width > 768;

const SidebarItem = ({ icon, label, route, isActive, onPress }: any) => (
  <TouchableOpacity 
    style={[styles.sidebarItem, isActive && styles.sidebarItemActive]} 
    onPress={onPress}
  >
    <View style={[styles.sidebarIconBox, isActive && { backgroundColor: Colors.secondary }]}>
      <Ionicons name={icon} size={20} color={isActive ? '#FFF' : Colors.textMuted} />
    </View>
    <Text style={[styles.sidebarLabel, isActive && styles.sidebarLabelActive]}>{label}</Text>
  </TouchableOpacity>
);

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.sidebar}>
      <View style={styles.sidebarHeader}>
        <Ionicons name="flash" size={24} color={Colors.secondary} />
        <Text style={styles.sidebarBrand}>MYTHIC SPRINT</Text>
      </View>

      <ScrollView contentContainerStyle={styles.sidebarContent}>
        <Text style={styles.sidebarSectionLabel}>QUICK START</Text>
        <SidebarItem icon="home" label="Dashboard" route="/(tabs)" isActive={pathname === '/'} onPress={() => router.push('/(tabs)')} />
        <SidebarItem icon="map" label="Start a Run" route="/(tabs)/map" isActive={pathname === '/map'} onPress={() => router.push('/(tabs)/map')} />
        <SidebarItem icon="cube" label="My Equipment" route="/(tabs)/inventory" isActive={pathname === '/inventory'} onPress={() => router.push('/(tabs)/inventory')} />
        
        <Text style={[styles.sidebarSectionLabel, { marginTop: 30 }]}>BASE & CRAFTING</Text>
        <SidebarItem icon="home" label="Base HQ" route="/safehouse" isActive={pathname === '/safehouse'} onPress={() => router.push('/safehouse')} />
        <SidebarItem icon="hammer" label="Gear Crafting" route="/forge" isActive={pathname === '/forge'} onPress={() => router.push('/forge')} />
        <SidebarItem icon="camera" label="AR Trophy Room" route="/camera" isActive={pathname === '/camera'} onPress={() => router.push('/camera')} />
        
        <Text style={[styles.sidebarSectionLabel, { marginTop: 30 }]}>ACCOUNT</Text>
        <SidebarItem icon="person" label="My Profile" route="/profile" isActive={pathname === '/profile'} onPress={() => router.push('/profile')} />
        <SidebarItem icon="settings" label="Settings" route="/settings" isActive={pathname === '/settings'} onPress={() => router.push('/settings')} />
      </ScrollView>

      <View style={styles.sidebarFooter}>
        <View style={styles.proBadge}>
          <Text style={styles.proBadgeText}>ELITE TIER ACTIVE</Text>
        </View>
      </View>
    </View>
  );
};

export default function TabLayout() {
  const router = useRouter();
  
  const handleTabPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <View style={styles.wrapper}>
      {isDesktop && <Sidebar />}
      
      <View style={styles.mainContent}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: isDesktop ? { display: 'none' } : styles.tabBar,
            tabBarShowLabel: false,
            tabBarBackground: () => (
              !isDesktop && <BlurView intensity={95} tint="dark" style={StyleSheet.absoluteFill} />
            ),
          }}
          screenListeners={{
            tabPress: handleTabPress,
          }}
        >
          <Tabs.Screen name="index" options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="home" /> }} />
          <Tabs.Screen name="map" options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="map" /> }} />
          <Tabs.Screen name="inventory" options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="cube" /> }} />
          <Tabs.Screen name="factions" options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="shield-checkmark" /> }} />
        </Tabs>
      </View>
    </View>
  );
}

const TabIcon = ({ focused, icon }: { focused: boolean, icon: string }) => {
  const scale = useSharedValue(focused ? 1.2 : 1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : 1, { damping: 10, stiffness: 100 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.iconContainer}>
      <Animated.View style={[styles.iconWrapper, focused && styles.iconWrapperFocused, animatedStyle]}>
        <Ionicons name={focused ? icon as any : (`${icon}-outline` as any)} size={22} color={focused ? '#FFF' : '#94A3B8'} />
        {focused && <View style={styles.iconGlow} />}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, flexDirection: isDesktop ? 'row' : 'column', backgroundColor: Colors.background },
  mainContent: { flex: 1 },
  
  sidebar: { width: 280, backgroundColor: Colors.card, borderRightWidth: 1, borderRightColor: Colors.border, paddingTop: 30 },
  sidebarHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, marginBottom: 40 },
  sidebarBrand: { color: Colors.text, fontSize: 16, fontWeight: '900', letterSpacing: 2, marginLeft: 10 },
  sidebarContent: { paddingHorizontal: 20 },
  sidebarSectionLabel: { color: Colors.textDim, fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 15, marginLeft: 10 },
  sidebarItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10, borderRadius: 12, marginBottom: 5 },
  sidebarItemActive: { backgroundColor: 'rgba(255,255,255,0.05)' },
  sidebarIconBox: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  sidebarLabel: { color: Colors.textMuted, fontSize: 13, fontWeight: '600', marginLeft: 15 },
  sidebarLabelActive: { color: Colors.text, fontWeight: '800' },
  sidebarFooter: { padding: 25, borderTopWidth: 1, borderTopColor: Colors.border },
  proBadge: { backgroundColor: 'rgba(6, 182, 212, 0.1)', paddingVertical: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(6, 182, 212, 0.3)' },
  proBadgeText: { color: Colors.info, fontSize: 11, fontWeight: '900', letterSpacing: 1 },

  tabBar: { position: 'absolute', bottom: Platform.OS === 'ios' ? 30 : 20, left: 25, right: 25, elevation: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 35, height: 65, borderTopWidth: 0, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.6, shadowRadius: 25, overflow: 'hidden', borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  iconContainer: { alignItems: 'center', justifyContent: 'center', height: '100%', paddingTop: 10 },
  iconWrapper: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  iconWrapperFocused: { backgroundColor: Colors.secondary, shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.8, shadowRadius: 15, elevation: 12 },
  iconGlow: { position: 'absolute', width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.secondary, opacity: 0.3, filter: 'blur(10px)' } as any,
  indicator: { display: 'none' },
});
