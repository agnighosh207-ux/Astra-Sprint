import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, LayoutAnimation, UIManager, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Colors } from '../src/constants/Colors';
import { AnimatedBackground } from '../src/components/AnimatedBackground';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQS = [
  { id: '1', question: 'Why did the audio stop?', answer: 'Ensure your app has unrestricted background battery usage permissions. The OS may aggressively kill background audio if battery optimization is enabled.' },
  { id: '2', question: 'How do I upgrade my faction?', answer: 'Navigate to the Factions tab. If you have not pledged loyalty yet, you can select your faction. Factions cannot be changed until the end of the current competitive season.' },
  { id: '3', question: 'Is my location data secure?', answer: 'Absolutely. Location telemetry is only stored locally and temporarily on our encrypted backend to generate AI story prompts. We do not sell or permanently store continuous tracking paths.' },
];

export default function SupportTerminal() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SUPPORT TERMINAL</Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          
          <Animated.View entering={FadeInDown.duration(800)}>
            <TouchableOpacity style={styles.communityCard} activeOpacity={0.9}>
              <LinearGradient colors={[Colors.accent, '#4C1D95']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.communityGradient}>
                <View style={styles.communityContent}>
                  <Ionicons name="logo-discord" size={40} color="#FFF" />
                  <View style={styles.communityTextWrapper}>
                    <Text style={styles.communityTitle}>Join the Vanguard</Text>
                    <Text style={styles.communityDesc}>Connect with other operatives, report bugs, and request features directly from the devs.</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.section}>
            <Text style={styles.sectionTitle}>THE INTEL DATABASE</Text>
            <View style={styles.faqContainer}>
              {FAQS.map(faq => (
                <View key={faq.id} style={styles.faqItem}>
                  <TouchableOpacity style={styles.faqHeader} onPress={() => toggleFaq(faq.id)}>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Ionicons 
                      name={expandedFaq === faq.id ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color={Colors.primary} 
                    />
                  </TouchableOpacity>
                  {expandedFaq === faq.id && (
                    <View style={styles.faqBody}>
                      <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.section}>
            <Text style={styles.sectionTitle}>DIRECT COMM-LINK</Text>
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>OPERATIVE IDENTIFIER</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={18} color={Colors.textDim} style={styles.inputIcon} />
                  <TextInput style={styles.input} placeholder="Name or Callsign" placeholderTextColor={Colors.textDim} />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>TRANSMISSION FREQUENCY</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={18} color={Colors.textDim} style={styles.inputIcon} />
                  <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor={Colors.textDim} keyboardType="email-address" />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>THREAT REPORT</Text>
                <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                  <TextInput 
                    style={styles.textArea} 
                    placeholder="Detail your inquiry or bug report here..." 
                    placeholderTextColor={Colors.textDim} 
                    multiline 
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.submitBtn}>
                <LinearGradient colors={[Colors.success, '#059669']} style={styles.submitGradient}>
                  <Ionicons name="send" size={18} color="#FFF" style={{marginRight: 10}} />
                  <Text style={styles.submitText}>TRANSMIT REPORT</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>

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

  communityCard: { borderRadius: 24, shadowColor: Colors.accent, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10, marginBottom: 40 },
  communityGradient: { borderRadius: 24, padding: 30 },
  communityContent: { flexDirection: 'row', alignItems: 'center' },
  communityTextWrapper: { flex: 1, marginLeft: 25 },
  communityTitle: { color: '#FFF', fontSize: 22, fontWeight: '900', marginBottom: 6 },
  communityDesc: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 14, lineHeight: 22 },

  section: { marginBottom: 45 },
  sectionTitle: { color: Colors.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 2, marginBottom: 20 },
  
  faqContainer: { backgroundColor: Colors.card, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  faqItem: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 22 },
  faqQuestion: { color: Colors.text, fontSize: 16, fontWeight: '700', flex: 1, paddingRight: 15 },
  faqBody: { paddingHorizontal: 22, paddingBottom: 22 },
  faqAnswer: { color: Colors.textMuted, fontSize: 15, lineHeight: 24 },

  formContainer: { backgroundColor: Colors.card, borderRadius: 20, padding: 25, borderWidth: 1, borderColor: Colors.border },
  inputGroup: { marginBottom: 25 },
  inputLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: 'bold', letterSpacing: 1, marginBottom: 10 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 14, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 18 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: Colors.text, paddingVertical: 16, fontSize: 16 },
  textAreaWrapper: { alignItems: 'flex-start', paddingVertical: 18 },
  textArea: { flex: 1, color: Colors.text, fontSize: 16, minHeight: 120 },

  submitBtn: { shadowColor: Colors.success, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 15, elevation: 10, marginTop: 10 },
  submitGradient: { flexDirection: 'row', paddingVertical: 20, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  submitText: { color: '#FFF', fontSize: 15, fontWeight: '900', letterSpacing: 1 },
});
