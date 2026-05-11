import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { Colors } from '../../src/constants/Colors';
import { GlassCard } from '../../src/components/GlassCard';
import { AnimatedBackground } from '../../src/components/AnimatedBackground';
import * as Haptics from 'expo-haptics';

export default function FactionsTab() {
  const [pledgedFaction, setPledgedFaction] = useState<string | null>(null);
  const [dominancePoints, setDominancePoints] = useState(1250); // Earned from runs
  const [factions, setFactions] = useState([
    { id: 'vanara', name: 'VANARA SCOUTS', distance: '12,450 km', color: Colors.primary, icon: 'leaf', desc: 'Agile forest runners focused on raw endurance and stealth.', dominance: 35 },
    { id: 'asura', name: 'ASURA SYNDICATE', distance: '14,200 km', color: Colors.danger, icon: 'flame', desc: 'Aggressive sprinters. High risk, high reward.', dominance: 42 },
    { id: 'deva', name: 'DEVA PROTOCOL', distance: '11,200 km', color: Colors.secondary, icon: 'pulse', desc: 'Tactical runners relying on biometric AI and precise pacing.', dominance: 23 }
  ]);

  const localRunners = [
    { id: '1', handle: '@NeonYoddha', distance: '45 km', faction: 'Vanara' },
    { id: '2', handle: '@CyberRakshasa', distance: '42 km', faction: 'Asura' },
    { id: '3', handle: '@PhantomKalki', distance: '38 km', faction: 'Deva' },
    { id: '4', handle: '@RogueYaksha', distance: '35 km', faction: 'Vanara' },
    { id: '5', handle: '@IronRun', distance: '31 km', faction: 'Asura' },
  ];

  const handleSupport = (id: string) => {
    if (dominancePoints <= 0) {
      Alert.alert('Low Power', 'Earn more points by completing runs in the City Challenge.');
      return;
    }

    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    setDominancePoints(prev => prev - 250);
    setFactions(current => current.map(f => {
      if (f.id === id) {
        return { ...f, dominance: Math.min(100, f.dominance + 1) };
      }
      return f;
    }));
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>WAR ROOM</Text>
          <View style={styles.pointsBadge}>
            <Ionicons name="flash" size={14} color={Colors.secondary} />
            <Text style={styles.pointsText}>{dominancePoints} ENERGY</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Animated.View entering={FadeInDown.duration(800)}>
            <Text style={styles.sectionTitle}>CITY DOMINANCE</Text>
            <Text style={styles.subtitle}>Help your faction control the local sector</Text>
          </Animated.View>

          {factions.map((faction, idx) => (
            <Animated.View key={faction.id} entering={FadeInDown.delay(200 + idx * 200).duration(800)}>
              <GlassCard style={styles.factionCard} accentColor={faction.color}>
                <View style={styles.factionHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: `${faction.color}20` }]}>
                    <Ionicons name={faction.icon as any} size={24} color={faction.color} />
                  </View>
                  <View style={styles.factionInfo}>
                    <Text style={[styles.factionName, { color: faction.color }]}>{faction.name}</Text>
                    <View style={styles.dominanceContainer}>
                      <View style={styles.dominanceHeader}>
                        <Text style={styles.dominanceLabel}>REGION CONTROL</Text>
                        <Text style={[styles.dominanceVal, { color: faction.color }]}>{faction.dominance}%</Text>
                      </View>
                      <View style={styles.dominanceBarBg}>
                        <View style={[styles.dominanceBarFill, { backgroundColor: faction.color, width: `${faction.dominance}%` }]} />
                      </View>
                    </View>
                  </View>
                </View>
                
                <View style={styles.actionRow}>
                  <TouchableOpacity 
                    style={[styles.actionBtn, { borderColor: faction.color, backgroundColor: `${faction.color}10` }]} 
                    onPress={() => handleSupport(faction.id)}
                  >
                    <Ionicons name="add" size={18} color={faction.color} />
                    <Text style={[styles.actionBtnText, { color: faction.color }]}>DEPLOY ENERGY</Text>
                  </TouchableOpacity>

                  {pledgedFaction === faction.id ? (
                    <View style={styles.pledgedBadge}>
                      <Ionicons name="shield-checkmark" size={18} color={Colors.success} />
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={styles.pledgeSmall} 
                      onPress={() => setPledgedFaction(faction.id)}
                    >
                      <Text style={styles.pledgeSmallText}>JOIN</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </GlassCard>
            </Animated.View>
          ))}

          <Animated.View entering={FadeInDown.delay(800).duration(800)} style={styles.leaderboardSection}>
            <Text style={styles.sectionTitle}>TOP OPERATIVES</Text>
            <Text style={styles.subtitle}>Runners holding the line today</Text>

            <GlassCard style={styles.leaderboardCard}>
              {localRunners.map((runner, index) => (
                <View key={runner.id} style={[styles.runnerRow, index === localRunners.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text style={[styles.rankText, index === 0 && { color: Colors.secondary }]}>#{index + 1}</Text>
                  <View style={styles.runnerInfo}>
                    <Text style={styles.runnerHandle}>{runner.handle}</Text>
                    <Text style={styles.runnerFaction}>{runner.faction} Faction</Text>
                  </View>
                  <Text style={styles.runnerDist}>{runner.distance}</Text>
                </View>
              ))}
            </GlassCard>
          </Animated.View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 25, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: Colors.text, fontSize: 18, fontWeight: '900', letterSpacing: 3 },
  pointsBadge: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  pointsText: { color: Colors.secondary, fontSize: 10, fontWeight: '900', marginLeft: 6 },
  
  scrollContent: { flexGrow: 1, padding: 25, paddingBottom: 120 },

  sectionTitle: { color: Colors.text, fontSize: 22, fontWeight: '900', letterSpacing: -0.5, textAlign: 'center' },
  subtitle: { color: Colors.textMuted, fontSize: 14, textAlign: 'center', marginBottom: 30, marginTop: 4 },

  factionCard: { marginBottom: 20, padding: 20 },
  factionHeader: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  factionInfo: { marginLeft: 15, flex: 1 },
  factionName: { fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  
  dominanceContainer: { marginTop: 10 },
  dominanceHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  dominanceLabel: { color: Colors.textDim, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  dominanceVal: { fontSize: 11, fontWeight: '900' },
  dominanceBarBg: { width: '100%', height: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' },
  dominanceBarFill: { height: '100%', borderRadius: 3 },

  actionRow: { flexDirection: 'row', marginTop: 20, gap: 10 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
  actionBtnText: { fontWeight: '900', fontSize: 12, letterSpacing: 1, marginLeft: 8 },
  
  pledgeSmall: { width: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  pledgeSmallText: { color: Colors.text, fontSize: 10, fontWeight: '900' },
  pledgedBadge: { width: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.1)', borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)' },

  leaderboardSection: { marginTop: 30 },
  leaderboardCard: { padding: 0 },
  runnerRow: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  rankText: { color: Colors.textDim, fontSize: 16, fontWeight: '900', width: 40 },
  runnerInfo: { flex: 1 },
  runnerHandle: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  runnerFaction: { color: Colors.textDim, fontSize: 12, marginTop: 2 },
  runnerDist: { color: Colors.info, fontSize: 16, fontWeight: '900' },
});
