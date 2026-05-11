import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors } from '../../src/constants/Colors';
import { GlassCard } from '../../src/components/GlassCard';
import { AnimatedBackground } from '../../src/components/AnimatedBackground';

const { width } = Dimensions.get('window');
const isDesktop = Platform.OS === 'web' && width > 768;

const MenuItem = ({ icon, label, desc, onPress }: any) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemIcon}>
      <Ionicons name={icon} size={22} color={Colors.secondary} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.menuItemLabel}>{label}</Text>
      <Text style={styles.menuItemDesc}>{desc}</Text>
    </View>
  </TouchableOpacity>
);

export default function DashboardScreen() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuAnim = useSharedValue(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    menuAnim.value = withSpring(isMenuOpen ? 0 : 1, { damping: 15 });
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const menuStyle = useAnimatedStyle(() => ({
    opacity: menuAnim.value,
    transform: [{ scale: withSpring(menuAnim.value ? 1 : 0.95) }],
    pointerEvents: menuAnim.value > 0.5 ? 'auto' : 'none',
  }));

  const blueprints = [
    { id: '1', title: 'CITY RUN CHALLENGE', tag: 'FAST PACE', icon: 'flame', color: Colors.primary, route: '/(tabs)/map' },
    { id: '2', title: 'BASE HEADQUARTERS', tag: 'UPGRADES', icon: 'home', color: Colors.secondary, route: '/safehouse' },
    { id: '3', title: 'GEAR CRAFTING', tag: 'NEW GEAR', icon: 'hammer', color: Colors.accent, route: '/forge' },
    { id: '4', title: 'AR TROPHY ROOM', tag: 'VIEW COLLECTIONS', icon: 'camera', color: Colors.info, route: '/camera' },
  ];

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <SafeAreaView style={{ flex: 1 }}>
        
        {/* Advanced Top Header */}
        <Animated.View entering={FadeInDown.duration(800)} style={styles.topNav}>
          <View style={styles.headerInfo}>
            <Text style={styles.sysTime}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} // GPS: ACTIVE</Text>
            <Text style={styles.headerTitle}>DASHBOARD</Text>
          </View>
          <TouchableOpacity onPress={toggleMenu} style={styles.menuTrigger}>
            <View style={styles.avatarGlow} />
            <View style={styles.avatarSmall}>
              <Ionicons name="menu" size={20} color={Colors.secondary} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Intelligent Menu Overlay */}
        <Animated.View style={[styles.menuOverlay, menuStyle]}>
          <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill}>
            <SafeAreaView style={styles.menuContent}>
              <View style={styles.menuHeader}>
                <Text style={styles.menuBrand}>COMMAND CENTER</Text>
                <TouchableOpacity onPress={toggleMenu}>
                  <Ionicons name="close" size={32} color={Colors.text} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.menuLinks} showsVerticalScrollIndicator={false}>
                <MenuItem icon="home" label="My Base HQ" desc="Base upgrades & resources" onPress={() => { toggleMenu(); router.push('/safehouse'); }} />
                <MenuItem icon="hammer" label="Gear Crafting" desc="Create powerful power-ups" onPress={() => { toggleMenu(); router.push('/forge'); }} />
                <MenuItem icon="camera" label="AR Trophy Room" desc="View your earned trophies" onPress={() => { toggleMenu(); router.push('/camera'); }} />
                <MenuItem icon="person" label="My Profile" desc="Manage your fitness data" onPress={() => { toggleMenu(); router.push('/profile'); }} />
                <MenuItem icon="settings" label="App Settings" desc="Configure your experience" onPress={() => { toggleMenu(); router.push('/settings'); }} />
              </ScrollView>

              <View style={styles.menuFooter}>
                <View style={styles.proBadge}>
                  <Text style={styles.proBadgeText}>PREMIUM ACCESS ACTIVE</Text>
                </View>
              </View>
            </SafeAreaView>
          </BlurView>
        </Animated.View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Hero "Operational Status" Card */}
          <Animated.View entering={FadeInDown.delay(200).duration(800)}>
            <GlassCard style={styles.heroCard} accentColor={Colors.secondary}>
              <LinearGradient colors={['rgba(6, 182, 212, 0.1)', 'transparent']} style={StyleSheet.absoluteFill} />
              <View style={styles.heroTop}>
                <View style={styles.heroStats}>
                  <Text style={styles.statLabel}>WORKOUT STREAK</Text>
                  <Text style={styles.statVal}>12 DAYS</Text>
                </View>
                <View style={styles.pulseContainer}>
                  <View style={styles.pulseCircle} />
                  <Ionicons name="pulse" size={24} color={Colors.secondary} />
                </View>
              </View>
              <Text style={styles.heroSubText}>The Syndicate detects threats in your area. Start a run now to stay ahead.</Text>
              <TouchableOpacity style={styles.deployBtn} onPress={() => router.push('/(tabs)/map')}>
                <LinearGradient colors={[Colors.secondary, Colors.primary]} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.deployGradient}>
                  <Text style={styles.deployText}>START RUNNING</Text>
                  <Ionicons name="chevron-forward" size={18} color="#000" />
                </LinearGradient>
              </TouchableOpacity>
            </GlassCard>
          </Animated.View>

          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>CHOOSE YOUR ACTIVITY</Text>
            <View style={styles.sectionLine} />
          </View>

          {/* Advanced Blueprints Grid */}
          <View style={styles.grid}>
            {blueprints.map((bp, idx) => (
              <Animated.View key={bp.id} entering={FadeInDown.delay(400 + idx * 100).duration(800)} style={styles.gridItem}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => router.push(bp.route as any)}>
                  <GlassCard style={styles.blueprintCard}>
                    <View style={[styles.bpIconBox, { backgroundColor: `${bp.color}15`, borderColor: `${bp.color}30` }]}>
                      <Ionicons name={bp.icon as any} size={28} color={bp.color} />
                    </View>
                    <Text style={styles.bpTitle}>{bp.title}</Text>
                    <Text style={[styles.bpTag, { color: bp.color }]}>{bp.tag}</Text>
                  </GlassCard>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Intelligence Feed */}
          <View style={styles.intelligenceHeader}>
            <Text style={styles.sectionLabel}>RECENT UPDATES</Text>
          </View>
          <Animated.View entering={FadeInDown.delay(900).duration(800)}>
            <GlassCard style={styles.intelCard}>
              <View style={styles.intelRow}>
                <Ionicons name="notifications" size={18} color={Colors.primary} />
                <Text style={styles.intelText}>Your last run was 15% faster than average.</Text>
              </View>
              <View style={styles.intelRow}>
                <Ionicons name="trending-up" size={18} color={Colors.secondary} />
                <Text style={styles.intelText}>You earned 50 new crafting materials.</Text>
              </View>
            </GlassCard>
          </Animated.View>

        </ScrollView>

        {/* Extraordinary Mobile FAB */}
        {!isDesktop && (
          <Animated.View entering={FadeInDown.delay(1000).springify()} style={styles.fabContainer}>
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                router.push('/(tabs)/map');
              }}
              style={styles.fab}
            >
              <LinearGradient colors={[Colors.secondary, Colors.primary]} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.fabGradient}>
                <Ionicons name="flash" size={28} color="#000" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 20 },
  headerInfo: { flex: 1 },
  sysTime: { color: Colors.secondary, fontSize: 9, fontWeight: '900', letterSpacing: 1.5, marginBottom: 4, opacity: 0.8 },
  headerTitle: { color: Colors.text, fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  
  menuTrigger: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  avatarGlow: { position: 'absolute', width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.secondary, opacity: 0.2, filter: 'blur(8px)' } as any,
  avatarSmall: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.3)', alignItems: 'center', justifyContent: 'center' },

  menuOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 1000 },
  menuContent: { flex: 1, padding: 30 },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 },
  menuBrand: { color: Colors.secondary, fontSize: 14, fontWeight: '900', letterSpacing: 4 },
  menuLinks: { flex: 1 },
  
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  menuItemIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', marginRight: 20 },
  menuItemLabel: { color: Colors.text, fontSize: 16, fontWeight: '800', marginBottom: 2 },
  menuItemDesc: { color: Colors.textDim, fontSize: 11, fontWeight: '600' },

  menuFooter: { paddingTop: 30, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  proBadge: { backgroundColor: 'rgba(6, 182, 212, 0.1)', paddingVertical: 15, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(6, 182, 212, 0.3)' },
  proBadgeText: { color: Colors.info, fontSize: 12, fontWeight: '900', letterSpacing: 2 },

  scrollContent: { flexGrow: 1, padding: 25, paddingBottom: 120 },

  heroCard: { marginBottom: 35, padding: 25, overflow: 'hidden' },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  heroStats: { flex: 1 },
  statLabel: { color: Colors.textDim, fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 4 },
  statVal: { color: Colors.text, fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  pulseContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(6, 182, 212, 0.1)', alignItems: 'center', justifyContent: 'center' },
  pulseCircle: { position: 'absolute', width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: Colors.secondary, opacity: 0.5 },
  
  heroSubText: { color: Colors.textMuted, fontSize: 14, lineHeight: 22, marginBottom: 25 },
  deployBtn: { borderRadius: 12, overflow: 'hidden' },
  deployGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
  deployText: { color: '#000', fontSize: 13, fontWeight: '900', letterSpacing: 1, marginRight: 10 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, marginTop: 10 },
  sectionLabel: { color: Colors.textDim, fontSize: 10, fontWeight: '900', letterSpacing: 2, marginRight: 15 },
  sectionLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', marginBottom: 15 },
  blueprintCard: { alignItems: 'center', padding: 20, minHeight: 160 },
  bpIconBox: { width: 56, height: 56, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  bpTitle: { color: Colors.text, fontSize: 13, fontWeight: '900', textAlign: 'center', marginBottom: 4 },
  bpTag: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },

  intelligenceHeader: { marginBottom: 20, marginTop: 20 },
  intelCard: { padding: 20 },
  intelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  intelText: { color: Colors.textMuted, fontSize: 13, marginLeft: 12 },

  fabContainer: { position: 'absolute', bottom: Platform.OS === 'ios' ? 120 : 100, right: 25, zIndex: 99 },
  fab: { width: 64, height: 64, borderRadius: 32, shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.6, shadowRadius: 15, elevation: 12 },
  fabGradient: { flex: 1, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
});
