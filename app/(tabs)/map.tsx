import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { View, Text, StyleSheet, PanResponder, SafeAreaView, Dimensions, Platform, TouchableOpacity, Animated } from 'react-native';
import Reanimated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../src/constants/Colors';
import MissionMap from '../../src/components/MissionMap';
import { ThreatRadar } from '../../src/components/ThreatRadar';
import { audioManager } from '../../src/utils/AudioManager';
import { offlineManager } from '../../src/utils/OfflineManager';
import { biometricsManager } from '../../src/utils/BiometricsManager';

const { width, height } = Dimensions.get('window');
const BASE_URL = 'http://localhost:3000';

const MemoizedMap = memo(({ region, routeCoordinates, phantomCoord }: any) => (
  <MissionMap region={region} routeCoordinates={routeCoordinates} phantomCoord={phantomCoord} />
));

export default function ActiveMissionScreen() {
  const router = useRouter();
  
  // -- STATE --
  const [distance, setDistance] = useState(0.0);
  const [pace, setPace] = useState(6.5);
  const [avgPace, setAvgPace] = useState(6.0);
  const [bpm, setBpm] = useState<number | null>(null);
  const [rations, setRations] = useState(0);
  const [scrap, setScrap] = useState(0);
  const [routeCoordinates, setRouteCoordinates] = useState<{latitude: number, longitude: number}[]>([]);
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 37.78825, longitude: -122.4324,
    latitudeDelta: 0.01, longitudeDelta: 0.01,
  });

  // -- HUNT SYSTEM STATE --
  const [isHuntActive, setIsHuntActive] = useState(false);
  const [huntTargetPace, setHuntTargetPace] = useState(0);
  const [huntTimer, setHuntTimer] = useState(0);

  // -- PHANTOM SYSTEM STATE --
  const [phantomCoord, setPhantomCoord] = useState<any>(null);
  const [isScavengeAvailable, setIsScavengeAvailable] = useState(false);
  const [lastScavengeLoc, setLastScavengeLoc] = useState<any>(null);
  
  // -- BIOMETRIC SYSTEM STATE --
  const [optimalZoneTime, setOptimalZoneTime] = useState(0);
  const [hasIntervention, setHasIntervention] = useState(false);
  
  // -- REFS --
  const lastMilestoneRef = useRef(0);
  const lastResourceDist = useRef(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const paceHistory = useRef<number[]>([]);

  // Initialize
  useEffect(() => {
    const init = async () => {
      await audioManager.initialize();
      await offlineManager.initialize();
      await biometricsManager.requestPermissions();
      // Advanced Track Load (Ambient vs Chase)
      await audioManager.startAmbient(
        'https://example.com/audio/saffron_synth_chill.mp3',
        'https://example.com/audio/rakshasa_drums_intense.mp3'
      );
    };
    init();
    return () => { audioManager.stopAll(); };
  }, []);

  // BIOMETRIC POLLING (Every 5s)
  useEffect(() => {
    const interval = setInterval(async () => {
      let currentBpm = await biometricsManager.getLiveHeartRate();
      if (currentBpm === null) {
        currentBpm = biometricsManager.calculateSimulatedExertion(pace, avgPace);
      }
      setBpm(currentBpm);
      
      // KINETIC AUDIO SYNC: Update audio rate based on BPM
      if (currentBpm) {
        audioManager.updateKineticRate(currentBpm);
      }

      // Check for Optimal Zone (Simulated range 130-160 for most runners)
      if (currentBpm && currentBpm >= 130 && currentBpm <= 160) {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setOptimalZoneTime(prev => {
          const next = prev + 5;
          if (next >= 300 && !hasIntervention) {
            triggerDivineIntervention();
            return 0; // Reset
          }
          return next;
        });
      } else {
        setOptimalZoneTime(0); // Reset if out of zone
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [pace, avgPace]);

  // HUNT TRIGGER ENGINE
  useEffect(() => {
    // Trigger a hunt every 5-8 minutes (simulated here for 2 mins for demo)
    const triggerHunt = () => {
      if (isHuntActive) return;
      
      const target = pace * 0.8; // 20% faster (pace is mins/km, so lower is faster)
      setHuntTargetPace(target);
      setIsHuntActive(true);
      setHuntTimer(60);

      audioManager.playTransmission("Warning: Rakshasa scent hound detected. Sprint now! Increase pace by 20%!", "high");
      audioManager.setChaseMode(true);
    };

    const timer = setInterval(() => {
      if (!isHuntActive && Math.random() > 0.7) triggerHunt();
    }, 30000); // Check every 30s
    
    return () => clearInterval(timer);
  }, [isHuntActive, pace]);

  // HUNT COUNTDOWN & RESOLUTION
  useEffect(() => {
    if (!isHuntActive) return;
    if (huntTimer > 0) {
      const t = setTimeout(() => setHuntTimer(huntTimer - 1), 1000);
      return () => clearTimeout(t);
    } else {
      // Hunt Finished - Check Success
      if (pace <= huntTargetPace) {
        audioManager.playTransmission("Threat neutralized. Supply crate recovered.", "low");
        setScrap(s => s + 50); // Reward
      } else {
        setRations(r => Math.max(0, Math.floor(r * 0.9))); // 10% penalty
      }
      setIsHuntActive(false);
      audioManager.setChaseMode(false);
    }
  }, [huntTimer, isHuntActive, pace, huntTargetPace]);

  // GPS & TRACKING
  useEffect(() => {
    let sub: any;
    const start = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10, timeInterval: 3000 },
        async (loc) => {
          const newC = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
          
          setRouteCoordinates(prev => {
            if (prev.length > 0) {
              const dM = getDistance(prev[prev.length - 1], newC);
              const nD = distance + (dM / 1000);
              
              if (nD - lastResourceDist.current >= 0.5) {
                lastResourceDist.current = Math.floor(nD * 2) / 2;
                setRations(r => r + 5);
              }
              if (Math.floor(nD) > lastMilestoneRef.current) {
                lastMilestoneRef.current = Math.floor(nD);
                triggerAIEvent('lore', nD);
                // Discover a Point of Interest for Scavenging
                setIsScavengeAvailable(true);
                setLastScavengeLoc(newC);
              }
              setDistance(nD);
            }
            return [...prev, newC];
          });

          setCurrentRegion(p => ({ ...p, ...newC }));
          await offlineManager.saveTelemetry({ ...newC, pace, distance });
        }
      );
    };
    start();
    return () => sub?.remove();
  }, [distance, pace]);

  const triggerDivineIntervention = () => {
    setHasIntervention(true);
    audioManager.playTransmission("Biometric resonance detected. Invoking Divine Intervention. Distance multiplier active.", "low");
    // Multiplier logic would go here
    setTimeout(() => setHasIntervention(false), 60000); // 1 min boost
  };

  const triggerAIEvent = async (type: 'threat' | 'lore', curD: number) => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/generate-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: '7214', pace, avgPace, bpm, distance: curD, biome: 'Sector 4' })
      });
      const data = await res.json();
      if (data.text) audioManager.playTransmission(data.text, type === 'threat' ? 'high' : 'low');
    } catch (e) {
      audioManager.playTransmission(type === 'threat' ? "Threat detected!" : "Artifact zone ahead.");
    }
  };

  const handleScavenge = () => {
    setIsScavengeAvailable(false);
    setScrap(s => s + 25);
    audioManager.playTransmission("Area secured. Salvaged 25 Cyber-Scrap.", "low");
  };

  const sliderWidth = width - 80;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gs) => { if (gs.dx > 0 && gs.dx < sliderWidth - 60) slideAnim.setValue(gs.dx); },
      onPanResponderRelease: async (_, gs) => {
        if (gs.dx > sliderWidth - 100) {
          // PERSIST RESOURCES BEFORE EXIT
          await offlineManager.updateEconomy(rations, scrap, distance > 2 ? 10 : 0);
          router.replace('/(tabs)');
        }
        else Animated.spring(slideAnim, { toValue: 0, useNativeDriver: false }).start();
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MemoizedMap region={currentRegion} routeCoordinates={routeCoordinates} phantomCoord={phantomCoord} />
        
        <View style={styles.headerOverlay}>
          <LinearGradient colors={['rgba(11,15,26,0.9)', 'transparent']} style={styles.headerGradient}>
            <View style={styles.topStatusRow}>
              <View style={[styles.statusBadge, isHuntActive && { borderColor: Colors.danger }]}>
                <Ionicons name={isHuntActive ? "warning" : "shield-checkmark"} size={14} color={isHuntActive ? Colors.danger : Colors.info} />
                <Text style={[styles.statusText, isHuntActive && { color: Colors.danger }]}>
                  {isHuntActive ? `HUNT ACTIVE: ${huntTimer}s` : 'SIGNAL STABLE'}
                </Text>
              </View>
              
              <View style={styles.biometricBadge}>
                <Ionicons name="heart" size={14} color={Colors.danger} />
                <Text style={styles.biometricText}>{bpm || '--'} BPM</Text>
                {optimalZoneTime > 0 && (
                  <View style={styles.optimalDot} />
                )}
              </View>
            </View>

            {isHuntActive && (
              <View style={styles.huntTargetCard}>
                <Text style={styles.huntTargetLabel}>TARGET PACE: <Text style={{ color: Colors.success }}>{huntTargetPace.toFixed(2)}</Text></Text>
                <View style={styles.huntProgressBarBg}>
                  <View style={[styles.huntProgressBarFill, { width: `${(huntTimer / 60) * 100}%` }]} />
                </View>
              </View>
            )}

            {/* Scavenge moved to bottom for better reach */}

            <View style={styles.resourceRow}>
              <View style={styles.resItem}>
                <Ionicons name="fast-food" size={12} color={Colors.warning} />
                <Text style={styles.resText}>{rations}</Text>
              </View>
              <View style={styles.resItem}>
                <Ionicons name="construct" size={12} color={Colors.textMuted} />
                <Text style={styles.resText}>{scrap}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.hudContainer}>
        <BlurView intensity={80} tint="dark" style={styles.hudBlur}>
          <View style={styles.hudTopRow}>
            <View style={styles.metricBlock}>
              <Text style={styles.metricLabel}>DISTANCE</Text>
              <Text style={styles.metricValueMassive}>{distance.toFixed(2)}<Text style={styles.metricUnit}>km</Text></Text>
            </View>

            <ThreatRadar pulseAnim={pulseAnim} isHighThreat={isHuntActive || pace > avgPace * 1.1} />

            <View style={styles.metricBlock}>
              <Text style={styles.metricLabel}>PACE</Text>
              <Text style={styles.metricValueMassive}>{pace.toFixed(1)}</Text>
            </View>
          </View>

          {isScavengeAvailable && (
            <Reanimated.View entering={FadeInDown.springify()} style={styles.scavengeAlert}>
              <TouchableOpacity style={styles.scavengeBtn} onPress={handleScavenge}>
                <LinearGradient colors={[Colors.secondary, Colors.primary]} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.scavengeGradient}>
                  <Ionicons name="sparkles" size={20} color="#000" style={{ marginRight: 10 }} />
                  <Text style={styles.scavengeText}>SCAVENGE LOCAL AREA</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Reanimated.View>
          )}

          <View style={styles.sliderWrapper}>
            <View style={styles.sliderTrack}>
              <Text style={styles.sliderText}>SLIDE TO END TRANSMISSION</Text>
              <Animated.View style={[styles.sliderThumb, { transform: [{ translateX: slideAnim }] }]} {...panResponder.panHandlers}>
                <Ionicons name="chevron-forward" size={28} color="#FFF" />
              </Animated.View>
            </View>
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  mapContainer: { height: height * 0.65, width: '100%', position: 'absolute', top: 0 },
  headerOverlay: { position: 'absolute', top: 0, width: '100%', height: 180 },
  headerGradient: { flex: 1, paddingTop: 50, alignItems: 'center', paddingHorizontal: 25 },
  
  topStatusRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 15 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  statusText: { color: Colors.info, fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginLeft: 8 },
  biometricBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' },
  biometricText: { color: Colors.danger, fontSize: 11, fontWeight: '900', marginLeft: 8 },
  optimalDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success, marginLeft: 8, shadowColor: Colors.success, shadowRadius: 5, shadowOpacity: 0.8 },

  huntTargetCard: { width: '100%', backgroundColor: 'rgba(0,0,0,0.7)', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: Colors.danger, marginBottom: 15 },
  huntTargetLabel: { color: Colors.text, fontSize: 12, fontWeight: '800', marginBottom: 10 },
  huntProgressBarBg: { width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 },
  huntProgressBarFill: { height: '100%', backgroundColor: Colors.danger, borderRadius: 2 },

  scavengeAlert: { width: '100%', position: 'absolute', bottom: 100, alignSelf: 'center', zIndex: 50 },
  scavengeBtn: { borderRadius: 30, overflow: 'hidden', shadowColor: Colors.secondary, shadowRadius: 20, shadowOpacity: 0.8, height: 60 },
  scavengeGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: '100%' },
  scavengeText: { color: '#000', fontSize: 13, fontWeight: '900', letterSpacing: 1.5 },

  resourceRow: { flexDirection: 'row', gap: 10 },
  resItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: Colors.border },
  resText: { color: Colors.text, fontSize: 11, fontWeight: '900', marginLeft: 5 },

  hudContainer: { position: 'absolute', bottom: 0, width: '100%', height: height * 0.40, borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
  hudBlur: { flex: 1, padding: 30, justifyContent: 'space-between' },
  hudTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metricBlock: { flex: 1 },
  metricLabel: { color: Colors.textDim, fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 5 },
  metricValueMassive: { color: Colors.text, fontSize: 42, fontWeight: '900', letterSpacing: -1 },
  metricUnit: { color: Colors.textDim, fontSize: 16, fontWeight: 'bold', marginLeft: 4 },
  
  sliderWrapper: { width: '100%', alignItems: 'center', marginBottom: Platform.OS === 'ios' ? 20 : 10 },
  sliderTrack: { width: '100%', height: 60, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 30, justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  sliderText: { position: 'absolute', width: '100%', textAlign: 'center', color: Colors.textDim, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  sliderThumb: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginLeft: 5, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 15, elevation: 8, zIndex: 2 },
});
