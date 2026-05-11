import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../src/constants/Colors';
import { AnimatedBackground } from '../src/components/AnimatedBackground';
import { GlassCard } from '../src/components/GlassCard';

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/auth');
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>COMMAND SETTINGS</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Profile Section */}
          <Animated.View entering={FadeInDown.duration(800)}>
            <GlassCard style={styles.profileCard}>
              <View style={styles.profileInfo}>
                <View style={styles.avatarLarge}>
                  <Ionicons name="person" size={40} color={Colors.textMuted} />
                  <View style={styles.statusDot} />
                </View>
                <View style={styles.profileText}>
                  <Text style={styles.profileName}>Operative #7214</Text>
                  <Text style={styles.profileRank}>Vanguard Elite • Lvl 24</Text>
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          {/* Preferences Section */}
          <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.section}>
            <Text style={styles.sectionTitle}>SYSTEM PREFERENCES</Text>
            <GlassCard style={styles.settingsGroup}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 255, 255, 0.1)' }]}>
                    <Ionicons name="notifications" size={20} color={Colors.info} />
                  </View>
                  <Text style={styles.settingLabel}>Threat Alerts</Text>
                </View>
                <Switch value={true} trackColor={{ false: '#334155', true: Colors.info }} thumbColor="#FFF" />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconBox, { backgroundColor: 'rgba(236, 72, 153, 0.1)' }]}>
                    <Ionicons name="mic" size={20} color={Colors.primary} />
                  </View>
                  <Text style={styles.settingLabel}>AI Voice Narrative</Text>
                </View>
                <Switch value={true} trackColor={{ false: '#334155', true: Colors.primary }} thumbColor="#FFF" />
              </View>

              <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                    <Ionicons name="location" size={20} color={Colors.success} />
                  </View>
                  <Text style={styles.settingLabel}>Precision GPS</Text>
                </View>
                <Switch value={true} trackColor={{ false: '#334155', true: Colors.success }} thumbColor="#FFF" />
              </View>
            </GlassCard>
          </Animated.View>

          {/* Account Section */}
          <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.section}>
            <Text style={styles.sectionTitle}>SUBSCRIPTION</Text>
            <TouchableOpacity onPress={() => router.push('/upgrade')}>
              <LinearGradient colors={[Colors.secondary, Colors.secondaryDark]} style={styles.premiumCard}>
                <View style={styles.premiumContent}>
                  <Ionicons name="diamond" size={24} color="#FFF" />
                  <View style={styles.premiumTextWrapper}>
                    <Text style={styles.premiumTitle}>Elite Operative Active</Text>
                    <Text style={styles.premiumDesc}>Renews on July 14, 2026</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#FFF" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Logout */}
          <Animated.View entering={FadeInDown.delay(600).duration(800)}>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color={Colors.danger} />
              <Text style={styles.logoutText}>TERMINATE SESSION</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.versionText}>MYTHIC SPRINT V2.0.4 - KINETIC BUILD</Text>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 25, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  backButton: { marginRight: 15 },
  headerTitle: { color: Colors.text, fontSize: 16, fontWeight: '800', letterSpacing: 2 },
  scrollContent: { flexGrow: 1, padding: 25, paddingBottom: 60 },

  profileCard: { marginBottom: 35 },
  profileInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  statusDot: { position: 'absolute', bottom: 5, right: 5, width: 14, height: 14, borderRadius: 7, backgroundColor: Colors.success, borderWidth: 2, borderColor: Colors.card },
  profileText: { marginLeft: 20 },
  profileName: { color: Colors.text, fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  profileRank: { color: Colors.textMuted, fontSize: 14, marginTop: 4, fontWeight: '600' },

  section: { marginBottom: 40 },
  sectionTitle: { color: Colors.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 2, marginBottom: 18 },
  settingsGroup: { padding: 0 },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  settingLabel: { color: Colors.text, fontSize: 16, fontWeight: '600' },

  premiumCard: { borderRadius: 24, padding: 25, shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 10 },
  premiumContent: { flexDirection: 'row', alignItems: 'center' },
  premiumTextWrapper: { flex: 1, marginLeft: 20 },
  premiumTitle: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  premiumDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 22, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.05)' },
  logoutText: { color: Colors.danger, fontSize: 14, fontWeight: '900', marginLeft: 10, letterSpacing: 1 },
  versionText: { color: Colors.textDim, fontSize: 11, textAlign: 'center', marginTop: 40, letterSpacing: 2, fontWeight: 'bold' },
});
