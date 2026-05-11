import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../src/constants/Colors';
import { AnimatedBackground } from '../src/components/AnimatedBackground';
import { GlassCard } from '../src/components/GlassCard';

export default function ProfileScreen() {
  const router = useRouter();
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [guideVoice, setGuideVoice] = useState('Standard Cyber-Guide');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const stats = [
    { label: 'CALORIES BURNED', value: '12,450', unit: 'KCAL', icon: 'flame', color: Colors.danger },
    { label: 'TIME ESCAPED', value: '42:15', unit: 'HRS', icon: 'time', color: Colors.info },
    { label: 'FACTION RANK', value: 'ELITE IV', unit: 'TOP 5%', icon: 'shield-checkmark', color: Colors.secondary }
  ];

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>OPERATIVE PROFILE</Text>
          <TouchableOpacity onPress={() => setIsSettingsOpen(true)}>
            <View style={styles.settingsIconBox}>
              <Ionicons name="options-outline" size={20} color={Colors.text} />
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Animated.View entering={FadeInDown.duration(500)} style={styles.profileHeader}>
            <View style={styles.avatarLarge}>
              <Ionicons name="person" size={50} color={Colors.textMuted} />
              <LinearGradient colors={[Colors.secondary, Colors.secondaryDark]} style={styles.rankBadge}>
                <Text style={styles.rankBadgeText}>Lvl 24</Text>
              </LinearGradient>
            </View>
            <Text style={styles.operativeName}>Agnishwar Ghosh</Text>
            <Text style={styles.operativeHandle}>@agnighosh207</Text>
          </Animated.View>

          {/* Current Plan Card (Professional Layout) */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <GlassCard style={styles.planCard} accentColor={Colors.info}>
              <View style={styles.planHeader}>
                <View>
                  <Text style={styles.planLabel}>CURRENT PLAN</Text>
                  <View style={styles.planTitleRow}>
                    <Ionicons name="infinite" size={24} color={Colors.info} />
                    <Text style={styles.planTitle}>Mythic Infinity</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.manageBtn} onPress={() => router.push('/upgrade')}>
                  <Text style={styles.manageBtnText}>UPGRADE</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.planFooter}>
                <Text style={styles.creditsText}>Credits Remaining: <Text style={{ color: Colors.info, fontWeight: '900' }}>Unlimited</Text></Text>
              </View>
            </GlassCard>
          </Animated.View>

          <View style={styles.statsGrid}>
            {stats.map((stat, idx) => (
              <Animated.View key={idx} entering={FadeInDown.delay(200 + idx * 100).duration(500)} style={styles.statItem}>
                <GlassCard style={styles.statCard}>
                  <View style={[styles.statIconBox, { backgroundColor: `${stat.color}15` }]}>
                    <Ionicons name={stat.icon as any} size={20} color={stat.color} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </GlassCard>
              </Animated.View>
            ))}
          </View>

          {/* Account Settings List */}
          <Animated.View entering={FadeInDown.delay(600).duration(500)} style={styles.accountSection}>
            <Text style={styles.sectionTitle}>ACCOUNT</Text>
            <GlassCard style={styles.listCard}>
              <TouchableOpacity style={styles.listItem}>
                <Ionicons name="share-social-outline" size={20} color={Colors.textMuted} />
                <Text style={styles.listItemText}>Refer & Earn</Text>
                <Ionicons name="chevron-forward" size={18} color={Colors.textDim} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.listItem} onPress={() => router.push('/upgrade')}>
                <Ionicons name="card-outline" size={20} color={Colors.textMuted} />
                <Text style={styles.listItemText}>Plans & Billing</Text>
                <Ionicons name="chevron-forward" size={18} color={Colors.textDim} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.listItem} onPress={() => router.push('/support')}>
                <Ionicons name="headset-outline" size={20} color={Colors.textMuted} />
                <Text style={styles.listItemText}>Support</Text>
                <Ionicons name="chevron-forward" size={18} color={Colors.textDim} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.listItem, { borderBottomWidth: 0 }]} onPress={() => setIsSettingsOpen(true)}>
                <Ionicons name="settings-outline" size={20} color={Colors.textMuted} />
                <Text style={styles.listItemText}>Settings</Text>
                <Ionicons name="chevron-forward" size={18} color={Colors.textDim} />
              </TouchableOpacity>
            </GlassCard>
          </Animated.View>

          <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/auth')}>
            <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

        </ScrollView>

        {/* Settings Modal */}
        <Modal visible={isSettingsOpen} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.bottomSheet}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>INTERFACE CONFIG</Text>
              
              <View style={styles.settingGroup}>
                <Text style={styles.settingLabel}>Unit System</Text>
                <View style={styles.toggleRow}>
                  <TouchableOpacity 
                    onPress={() => setUnitSystem('metric')}
                    style={[styles.toggleBtn, unitSystem === 'metric' && styles.toggleBtnActive]}
                  >
                    <Text style={[styles.toggleText, unitSystem === 'metric' && styles.toggleTextActive]}>METRIC</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setUnitSystem('imperial')}
                    style={[styles.toggleBtn, unitSystem === 'imperial' && styles.toggleBtnActive]}
                  >
                    <Text style={[styles.toggleText, unitSystem === 'imperial' && styles.toggleTextActive]}>IMPERIAL</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.settingGroup}>
                <Text style={styles.settingLabel}>AI Guide Voice</Text>
                <TouchableOpacity style={styles.selectBtn}>
                  <Text style={styles.selectText}>{guideVoice}</Text>
                  <Ionicons name="chevron-down" size={20} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.closeBtn} onPress={() => setIsSettingsOpen(false)}>
                <Text style={styles.closeBtnText}>APPLY CHANGES</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 25, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backButton: { padding: 5 },
  headerTitle: { color: Colors.text, fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  settingsIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  scrollContent: { padding: 25, paddingBottom: 60 },

  profileHeader: { alignItems: 'center', marginBottom: 35 },
  avatarLarge: { width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.border },
  rankBadge: { position: 'absolute', bottom: -5, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
  rankBadgeText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  operativeName: { color: Colors.text, fontSize: 22, fontWeight: '900', marginTop: 15 },
  operativeHandle: { color: Colors.textDim, fontSize: 14, marginTop: 4 },

  planCard: { marginBottom: 30, padding: 0 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.border },
  planLabel: { color: Colors.textDim, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 5 },
  planTitleRow: { flexDirection: 'row', alignItems: 'center' },
  planTitle: { color: Colors.text, fontSize: 20, fontWeight: '900', marginLeft: 10 },
  manageBtn: { backgroundColor: 'rgba(6, 182, 212, 0.1)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(6, 182, 212, 0.2)' },
  manageBtnText: { color: Colors.info, fontSize: 11, fontWeight: '900' },
  planFooter: { padding: 15, backgroundColor: 'rgba(0,0,0,0.2)' },
  creditsText: { color: Colors.textMuted, fontSize: 12, fontWeight: '600' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 30 },
  statItem: { width: '31%', marginBottom: 15 },
  statCard: { alignItems: 'center', padding: 15 },
  statIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { color: Colors.text, fontSize: 18, fontWeight: '900' },
  statLabel: { color: Colors.textDim, fontSize: 9, fontWeight: '800', letterSpacing: 0.5, marginTop: 2, textAlign: 'center' },

  accountSection: { marginBottom: 30 },
  sectionTitle: { color: Colors.textDim, fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 15 },
  listCard: { padding: 0 },
  listItem: { flexDirection: 'row', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: Colors.border },
  listItemText: { flex: 1, color: Colors.textMuted, fontSize: 15, fontWeight: '600', marginLeft: 15 },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  logoutText: { color: Colors.textDim, fontSize: 14, fontWeight: '600', marginLeft: 12 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: Colors.card, borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 35, paddingBottom: 60 },
  sheetHandle: { width: 45, height: 5, backgroundColor: Colors.border, borderRadius: 3, alignSelf: 'center', marginBottom: 35 },
  sheetTitle: { color: Colors.text, fontSize: 18, fontWeight: '900', letterSpacing: 1, marginBottom: 30, textAlign: 'center' },
  
  settingGroup: { marginBottom: 30 },
  settingLabel: { color: Colors.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 15 },
  toggleRow: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 4 },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  toggleBtnActive: { backgroundColor: Colors.border },
  toggleText: { color: Colors.textDim, fontSize: 11, fontWeight: '900' },
  toggleTextActive: { color: Colors.text },
  
  selectBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 15 },
  selectText: { color: Colors.text, fontSize: 14, fontWeight: '600' },

  closeBtn: { backgroundColor: Colors.info, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  closeBtnText: { color: Colors.background, fontSize: 15, fontWeight: '900' },
});
