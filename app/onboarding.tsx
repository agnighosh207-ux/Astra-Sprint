import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, FadeInRight, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { Colors } from '../src/constants/Colors';
import { GlassCard } from '../src/components/GlassCard';

const { width } = Dimensions.get('window');

const DIFFICULTIES = [
  { id: 'cadet', title: 'CADET', desc: 'Standard AI generation. Good for beginners.', color: Colors.success },
  { id: 'operative', title: 'OPERATIVE', desc: 'Dynamic threats based on heart rate.', color: Colors.info },
  { id: 'mythic', title: 'MYTHIC', desc: 'Extreme survival. Missed paces result in total faction loss.', color: Colors.danger }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('operative');
  const [isInitializing, setIsInitializing] = useState(false);

  const scanLineY = useSharedValue(0);

  useEffect(() => {
    scanLineY.value = withRepeat(
      withTiming(300, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
  }));

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsInitializing(true);
      setTimeout(() => {
        router.push('/(tabs)');
      }, 2000);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.content}>
          
          <View style={styles.header}>
            <View style={styles.stepIndicator}>
              <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
              <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
              <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]} />
              <View style={[styles.stepLine, step >= 3 && styles.stepLineActive]} />
              <View style={[styles.stepDot, step >= 3 && styles.stepDotActive]} />
            </View>
            <Text style={styles.sysText}>SYSTEM.SETUP_SEQ // {step}/3</Text>
          </View>

          {step === 1 && (
            <Animated.View entering={FadeInRight.duration(500)} style={styles.stepContainer}>
              <Ionicons name="finger-print" size={80} color={Colors.info} style={styles.stepIcon} />
              <Text style={styles.stepTitle}>BIOMETRIC HANDSHAKE</Text>
              <Text style={styles.stepDesc}>
                Astra Sprint uses your device's accelerometer and optionally your smartwatch health data to generate hyper-personalized survival narratives.
              </Text>
              <View style={styles.terminalBox}>
                <Text style={styles.terminalText}>&gt; Requesting pedometer access...</Text>
                <Text style={styles.terminalText}>&gt; Requesting location services...</Text>
                <Text style={[styles.terminalText, { color: Colors.success, marginTop: 10 }]}>&gt; ALL SENSORS NOMINAL.</Text>
              </View>
            </Animated.View>
          )}

          {step === 2 && (
            <Animated.View entering={FadeInRight.duration(500)} style={styles.stepContainer}>
              <Ionicons name="hardware-chip" size={80} color={Colors.secondary} style={styles.stepIcon} />
              <Text style={styles.stepTitle}>SELECT AI INTENSITY</Text>
              <Text style={styles.stepDesc}>
                Calibrate the hostility of the AI Threat Engine. How intense should the audio chases be?
              </Text>

              <View style={styles.difficultyList}>
                {DIFFICULTIES.map((diff) => (
                  <TouchableOpacity 
                    key={diff.id} 
                    style={[styles.diffCard, selectedDifficulty === diff.id && { borderColor: diff.color, backgroundColor: `${diff.color}15` }]}
                    onPress={() => setSelectedDifficulty(diff.id)}
                  >
                    <View style={styles.diffHeader}>
                      <Ionicons name={selectedDifficulty === diff.id ? "radio-button-on" : "radio-button-off"} size={20} color={selectedDifficulty === diff.id ? diff.color : Colors.textDim} />
                      <Text style={[styles.diffTitle, selectedDifficulty === diff.id && { color: diff.color }]}>{diff.title}</Text>
                    </View>
                    <Text style={styles.diffDesc}>{diff.desc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}

          {step === 3 && (
            <Animated.View entering={FadeInUp.duration(500)} style={styles.stepContainer}>
              <View style={styles.scanContainer}>
                <Ionicons name="body-outline" size={150} color={Colors.info} />
                <Animated.View style={[styles.scanLine, scanLineStyle]} />
              </View>
              
              <Text style={styles.stepTitle}>PROFILING OPERATIVE...</Text>
              
              {isInitializing ? (
                <View style={styles.terminalBox}>
                  <Text style={styles.terminalText}>&gt; Initializing local database...</Text>
                  <Text style={styles.terminalText}>&gt; Generating starter Relics...</Text>
                  <Text style={styles.terminalText}>&gt; Syncing narrative LLM cache...</Text>
                  <Text style={[styles.terminalText, { color: Colors.info, marginTop: 10, fontWeight: 'bold' }]}>&gt; WELCOME TO ASTRA SPRINT.</Text>
                </View>
              ) : (
                <Text style={styles.stepDesc}>
                  Your profile is ready. The Syndicate is waiting. Brace yourself for the first deployment.
                </Text>
              )}
            </Animated.View>
          )}

        </View>

        <View style={styles.footer}>
          {!isInitializing && (
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <LinearGradient colors={[Colors.info, '#0891B2']} style={styles.nextGradient}>
                <Text style={styles.nextText}>{step === 3 ? 'INITIATE SYSTEM' : 'ACKNOWLEDGE'}</Text>
                <Ionicons name="arrow-forward" size={20} color="#000" style={{ marginLeft: 10 }} />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: 30, paddingTop: Platform.OS === 'ios' ? 20 : 50 },
  
  header: { alignItems: 'center', marginBottom: 40 },
  stepIndicator: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  stepDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.border },
  stepDotActive: { backgroundColor: Colors.info, shadowColor: Colors.info, shadowOpacity: 0.8, shadowRadius: 10, shadowOffset: { width: 0, height: 0 } },
  stepLine: { width: 40, height: 2, backgroundColor: Colors.border, marginHorizontal: 5 },
  stepLineActive: { backgroundColor: Colors.info },
  sysText: { color: Colors.textDim, fontSize: 10, fontWeight: '900', letterSpacing: 2 },

  stepContainer: { flex: 1, alignItems: 'center' },
  stepIcon: { marginBottom: 20 },
  stepTitle: { color: Colors.text, fontSize: 24, fontWeight: '900', letterSpacing: 1, marginBottom: 15, textAlign: 'center' },
  stepDesc: { color: Colors.textMuted, fontSize: 15, lineHeight: 24, textAlign: 'center', marginBottom: 30 },

  terminalBox: { width: '100%', backgroundColor: 'rgba(0,0,0,0.5)', borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 20, marginTop: 20 },
  terminalText: { color: Colors.textDim, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontSize: 12, marginBottom: 8 },

  difficultyList: { width: '100%' },
  diffCard: { width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: Colors.border, borderRadius: 15, padding: 20, marginBottom: 15 },
  diffHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  diffTitle: { color: Colors.text, fontSize: 16, fontWeight: '900', letterSpacing: 1, marginLeft: 10 },
  diffDesc: { color: Colors.textMuted, fontSize: 13, lineHeight: 20, marginLeft: 30 },

  scanContainer: { height: 200, width: 200, alignItems: 'center', justifyContent: 'center', marginBottom: 30, overflow: 'hidden' },
  scanLine: { position: 'absolute', top: -50, width: '100%', height: 4, backgroundColor: Colors.info, shadowColor: Colors.info, shadowOpacity: 1, shadowRadius: 20, elevation: 10 },

  footer: { padding: 30, paddingBottom: Platform.OS === 'ios' ? 40 : 30 },
  nextBtn: { width: '100%', borderRadius: 15, overflow: 'hidden' },
  nextGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  nextText: { color: '#000', fontSize: 15, fontWeight: '900', letterSpacing: 1 },
});
