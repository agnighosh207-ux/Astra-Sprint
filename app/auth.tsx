import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Colors } from '../src/constants/Colors';
import { AnimatedBackground } from '../src/components/AnimatedBackground';

export default function AuthScreen() {
  const router = useRouter();

  const handleDevBypass = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
            <View style={styles.content}>
              
              <Animated.View entering={FadeInDown.duration(800)} style={styles.logoContainer}>
                <Ionicons name="finger-print" size={64} color={Colors.primary} />
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(200).duration(800)} style={{ width: '100%', alignItems: 'center' }}>
                <LinearGradient colors={['rgba(30, 41, 59, 0.9)', 'rgba(15, 23, 42, 0.95)']} style={styles.authCard}>
                  <Text style={styles.cardTitle}>Access the Command Center</Text>
                  <Text style={styles.cardSubtitle}>Authenticate to synchronize biometric telemetry.</Text>

                  <View style={styles.clerkStubContainer}>
                    
                    <TouchableOpacity style={styles.socialBtn}>
                      <Ionicons name="logo-google" size={20} color={Colors.text} style={styles.socialIcon} />
                      <Text style={styles.socialBtnText}>Continue with Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialBtn}>
                      <Ionicons name="logo-apple" size={20} color={Colors.text} style={styles.socialIcon} />
                      <Text style={styles.socialBtnText}>Continue with Apple</Text>
                    </TouchableOpacity>

                    <View style={styles.dividerRow}>
                      <View style={styles.dividerLine} />
                      <Text style={styles.dividerText}>OR</Text>
                      <View style={styles.dividerLine} />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>OPERATIVE EMAIL</Text>
                      <TextInput 
                        style={styles.input} 
                        placeholder="name@vanguard.com" 
                        placeholderTextColor={Colors.textDim}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>ACCESS CODE</Text>
                      <TextInput 
                        style={styles.input} 
                        placeholder="••••••••" 
                        placeholderTextColor={Colors.textDim}
                        secureTextEntry
                      />
                    </View>

                    <TouchableOpacity style={styles.primaryAuthBtn}>
                      <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.primaryAuthGradient}>
                        <Text style={styles.primaryAuthText}>INITIALIZE SYNC</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                  </View>
                </LinearGradient>
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(600).duration(800)}>
                <TouchableOpacity style={styles.devBypassBtn} onPress={handleDevBypass}>
                  <Text style={styles.devBypassText}>[DEV OVERRIDE: Skip Login]</Text>
                </TouchableOpacity>
              </Animated.View>

            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  keyboardView: { width: '100%' },
  content: { padding: 25, alignItems: 'center' },
  logoContainer: { marginBottom: 35, alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 20 },
  authCard: { width: '100%', maxWidth: 450, borderRadius: 28, padding: 35, borderWidth: 1, borderColor: Colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.4, shadowRadius: 30, elevation: 15 },
  cardTitle: { color: Colors.text, fontSize: 26, fontWeight: '900', textAlign: 'center', marginBottom: 10, letterSpacing: -0.5 },
  cardSubtitle: { color: Colors.textMuted, fontSize: 15, textAlign: 'center', marginBottom: 35, lineHeight: 22 },
  clerkStubContainer: { width: '100%' },
  socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, paddingVertical: 16, marginBottom: 15 },
  socialIcon: { marginRight: 12 },
  socialBtnText: { color: Colors.text, fontSize: 16, fontWeight: '600' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { color: Colors.textDim, paddingHorizontal: 15, fontSize: 13, fontWeight: 'bold' },
  inputGroup: { marginBottom: 20 },
  inputLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: 'bold', letterSpacing: 1, marginBottom: 8 },
  input: { backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 18, paddingVertical: 16, color: Colors.text, fontSize: 16 },
  primaryAuthBtn: { marginTop: 15, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 15, elevation: 10 },
  primaryAuthGradient: { paddingVertical: 18, borderRadius: 14, alignItems: 'center' },
  primaryAuthText: { color: '#FFF', fontSize: 17, fontWeight: '900', letterSpacing: 1 },
  devBypassBtn: { marginTop: 45, padding: 12 },
  devBypassText: { color: Colors.textDim, fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', letterSpacing: 1 },
});
