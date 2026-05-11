import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInUp, 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withDelay,
  Easing,
  withSpring
} from 'react-native-reanimated';
import { Colors } from '../src/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../src/components/GlassCard';

const { width, height } = Dimensions.get('window');
const isDesktop = Platform.OS === 'web' && width > 768;

const AnimatedOrb = ({ color, size, delay, duration, initialX, initialY }: any) => {
  const x = useSharedValue(initialX);
  const y = useSharedValue(initialY);

  useEffect(() => {
    x.value = withDelay(delay, withRepeat(withTiming(initialX + 50, { duration, easing: Easing.inOut(Easing.sin) }), -1, true));
    y.value = withDelay(delay, withRepeat(withTiming(initialY + 50, { duration: duration * 1.2, easing: Easing.inOut(Easing.sin) }), -1, true));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return (
    <Animated.View style={[
      styles.orb, 
      { backgroundColor: color, width: size, height: size, borderRadius: size / 2, opacity: 0.12 }, 
      animatedStyle
    ]} />
  );
};

const FeatureCard = ({ title, desc, icon, color, delay }: any) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const borderOpacity = useSharedValue(0.1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    borderColor: withTiming(scale.value > 1 ? color : 'rgba(255,255,255,0.1)'),
    borderWidth: 1,
  }));

  return (
    <TouchableOpacity 
      activeOpacity={1}
      onPressIn={() => {
        scale.value = withSpring(1.03);
        translateY.value = withSpring(-8);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
        translateY.value = withSpring(0);
      }}
      style={styles.featureCardWrapper}
    >
      <Animated.View entering={FadeInUp.delay(delay).duration(800)} style={[styles.featureCard, animatedStyle]}>
        <View style={[styles.iconCircle, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon} size={32} color={color} />
        </View>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function LandingPage() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/auth');
  };

  const eliteBorderAnim = useSharedValue(0.2);
  useEffect(() => {
    eliteBorderAnim.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, []);

  const eliteStyle = useAnimatedStyle(() => ({
    borderColor: Colors.info,
    borderWidth: 2,
    shadowColor: Colors.info,
    shadowOpacity: eliteBorderAnim.value * 0.5,
    shadowRadius: 15,
  }));

  const deployPulse = useSharedValue(1);
  useEffect(() => {
    deployPulse.value = withRepeat(withTiming(1.05, { duration: 1500 }), -1, true);
  }, []);

  const deployStyle = useAnimatedStyle(() => ({
    transform: [{ scale: deployPulse.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Dynamic Mesh Background */}
      <View style={StyleSheet.absoluteFill}>
        <AnimatedOrb color={Colors.secondary} size={400} delay={0} duration={8000} initialX={-100} initialY={-100} />
        <AnimatedOrb color={Colors.info} size={500} delay={1000} duration={10000} initialX={width - 250} initialY={height / 3} />
        <AnimatedOrb color={Colors.accent} size={450} delay={2000} duration={12000} initialX={width / 4} initialY={height - 300} />
        <View style={styles.gridOverlay} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Navbar */}
        <Animated.View entering={FadeInUp.duration(600)} style={styles.navbar}>
          <Text style={styles.logoText}>ASTRA SPRINT</Text>
          <TouchableOpacity onPress={handleStart} style={styles.loginBtn}>
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Animated.View entering={FadeInDown.delay(200).duration(1000)} style={styles.heroGlassContainer}>
            <GlassCard style={styles.heroGlassCard}>
              <View style={styles.badgeContainer}>
                <LinearGradient colors={[Colors.accent, Colors.secondary]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.badgeGradient}>
                  <Text style={styles.badgeText}>OPERATIONAL IN INDIA: VERSION 2.1</Text>
                </LinearGradient>
              </View>
              
              <Text style={styles.heroTitle}>Survive the Run.</Text>
              <Text style={styles.heroTitleGradient}>Become the Legend.</Text>
              
              <Text style={styles.heroSubtitle}>
                The first fitness app that turns your workout into a story. Escape threats in your neighborhood with missions that adapt to your speed.
              </Text>

              <View style={styles.ctaRow}>
                <TouchableOpacity style={styles.primaryCta} onPress={handleStart}>
                  <LinearGradient colors={[Colors.secondary, Colors.primary]} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.primaryCtaGradient}>
                    <Text style={styles.primaryCtaText}>INITIATE MISSION</Text>
                    <Ionicons name="flash" size={18} color="#000" style={{ marginLeft: 10 }} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </GlassCard>
          </Animated.View>
        </View>

        {/* Device Mockup */}
        <Animated.View entering={FadeInDown.delay(800).duration(800)} style={styles.deviceWrapper}>
          <View style={styles.glowBackdrop} />
          <View style={styles.deviceFrame}>
            <View style={styles.deviceScreen}>
              <View style={styles.radarContainer}>
                <View style={styles.radarCircle1} />
                <View style={styles.radarCircle2} />
                <Ionicons name="location" size={40} color={Colors.info} />
              </View>
              <View style={styles.deviceHud}>
                <View style={styles.hudLine} />
                <Text style={styles.hudText}>THREAT LEVEL: HIGH</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Features Grid */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionLabel}>CAPABILITIES</Text>
          <View style={styles.featuresGrid}>
            <FeatureCard title="SMART STORY" desc="The story changes based on how fast you run." icon="mic" color={Colors.info} delay={200} />
            <FeatureCard title="FITNESS SYNC" desc="Hear music that matches your heart rate." icon="pulse" color={Colors.primary} delay={400} />
            <FeatureCard title="GHOST RUNS" desc="Race against your best past times." icon="flash" color={Colors.secondary} delay={600} />
          </View>
        </View>

        {/* Pricing Integration */}
        <View style={styles.pricingSection}>
          <Text style={styles.sectionLabel}>DEPLOYMENT TIERS</Text>
          <View style={styles.pricingGrid}>
            <View style={styles.priceCard}>
              <Text style={styles.priceTier}>CADET</Text>
              <Text style={styles.priceVal}>₹0<Text style={styles.priceMo}>/mo</Text></Text>
              <Text style={styles.priceDesc}>Basic story engine & core tracking.</Text>
            </View>

            <Animated.View style={[styles.priceCard, eliteStyle]}>
              <View style={styles.popularBadge}><Text style={styles.popularText}>BEST VALUE</Text></View>
              <Text style={styles.priceTier}>PREMIUM OPERATIVE</Text>
              <Text style={styles.priceVal}>₹299<Text style={styles.priceMo}>/mo</Text></Text>
              <Text style={styles.priceDesc}>Unlimited missions, HQ upgrades, and smart AI coach. Pay with UPI.</Text>
            </Animated.View>
          </View>
        </View>

        {/* Footer Overhaul */}
        <View style={styles.footerOverhaul}>
          <LinearGradient colors={['rgba(245, 158, 11, 0.2)', 'transparent']} style={styles.footerBorder} />
          <LinearGradient colors={['rgba(11, 15, 26, 0)', 'rgba(236, 72, 153, 0.05)', '#0B0F1A']} style={styles.footerRadial} />
          
          <Animated.View entering={FadeInDown.delay(300)} style={styles.footerContent}>
            <Text style={styles.footerTitle}>READY TO INITIATE?</Text>
            <Text style={styles.footerSub}>Join 50,000+ operatives escaping the mundane.</Text>
            
            <Animated.View style={deployStyle}>
              <TouchableOpacity style={styles.deployBtn} onPress={handleStart}>
                <LinearGradient colors={[Colors.info, Colors.info + 'AA']} style={styles.deployGradient}>
                  <Text style={styles.deployText}>INITIATE DEPLOYMENT</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.footerLinks}>
              <Text style={styles.footerLinkText}>PRIVACY</Text>
              <Text style={styles.footerLinkText}>TERMS</Text>
              <Text style={styles.footerLinkText}>SUPPORT</Text>
            </View>
            <Text style={styles.footerCopyright}>© 2026 ASTRA SPRINT. ALL RIGHTS RESERVED.</Text>
          </Animated.View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F1A' },
  gridOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent', opacity: 0.05, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  orb: { position: 'absolute', filter: 'blur(100px)' } as any,
  
  scrollContent: { flexGrow: 1, paddingBottom: 100 },
  
  navbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: width > 500 ? 40 : 20, paddingVertical: 30 },
  logoText: { color: Colors.text, fontSize: width > 500 ? 18 : 15, fontWeight: '900', letterSpacing: width > 500 ? 4 : 2 },
  loginBtn: { paddingVertical: 8, paddingHorizontal: 22, borderRadius: 20, borderWidth: 1, borderColor: Colors.borderLight },
  loginText: { color: Colors.text, fontSize: 13, fontWeight: '700' },

  heroSection: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  heroGlassContainer: { width: '100%', maxWidth: 800 },
  heroGlassCard: { padding: 40, alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  badgeContainer: { marginBottom: 30 },
  badgeGradient: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 30 },
  badgeText: { color: '#000', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  heroTitle: { color: Colors.text, fontSize: width > 500 ? 68 : 46, fontWeight: '900', letterSpacing: -2, textAlign: 'center' },
  heroTitleGradient: { color: Colors.primary, fontSize: width > 500 ? 68 : 46, fontWeight: '900', letterSpacing: -2, textAlign: 'center', textShadowColor: Colors.primaryGlow, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 30 } as any,
  heroSubtitle: { color: Colors.textMuted, fontSize: width > 500 ? 18 : 15, lineHeight: width > 500 ? 30 : 24, textAlign: 'center', marginTop: 30, paddingHorizontal: 20 },
  ctaRow: { marginTop: 50 },
  primaryCta: { borderRadius: 15, overflow: 'hidden', shadowColor: Colors.primary, shadowRadius: 20, shadowOpacity: 0.5 },
  primaryCtaGradient: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 50 },
  primaryCtaText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 1 },

  deviceWrapper: { alignItems: 'center', marginVertical: 60 },
  glowBackdrop: { position: 'absolute', width: 300, height: 300, backgroundColor: Colors.info, borderRadius: 150, filter: 'blur(120px)', opacity: 0.15 } as any,
  deviceFrame: { width: 280, height: 500, borderRadius: 45, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)', padding: 12, backgroundColor: 'rgba(17, 24, 39, 0.5)', backdropFilter: 'blur(15px)' } as any,
  deviceScreen: { flex: 1, backgroundColor: '#000', borderRadius: 35, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  radarContainer: { width: 150, height: 150, alignItems: 'center', justifyContent: 'center' },
  radarCircle1: { position: 'absolute', width: 80, height: 80, borderRadius: 40, borderWidth: 1, borderColor: Colors.info, opacity: 0.3 },
  radarCircle2: { position: 'absolute', width: 140, height: 140, borderRadius: 70, borderWidth: 1, borderColor: Colors.info, opacity: 0.15 },
  deviceHud: { position: 'absolute', bottom: 40, alignItems: 'center' },
  hudLine: { width: 30, height: 2, backgroundColor: Colors.danger, marginBottom: 10 },
  hudText: { color: Colors.danger, fontSize: 9, fontWeight: '900', letterSpacing: 2 },

  featuresSection: { padding: width > 500 ? 40 : 25, paddingTop: 100 },
  sectionLabel: { color: Colors.textDim, fontSize: 11, fontWeight: '900', letterSpacing: 3, textAlign: 'center', marginBottom: 40 },
  featuresGrid: { flexDirection: Platform.OS === 'web' && width > 800 ? 'row' : 'column', gap: 20 },
  featureCardWrapper: { flex: 1 },
  featureCard: { backgroundColor: 'rgba(17, 24, 39, 0.6)', padding: 35, borderRadius: 25, backdropFilter: 'blur(20px)', alignItems: 'center' } as any,
  iconCircle: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 25 },
  featureTitle: { color: Colors.text, fontSize: 18, fontWeight: '900', marginBottom: 12 },
  featureDesc: { color: Colors.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 22 },

  pricingSection: { padding: width > 500 ? 40 : 25, paddingBottom: 100 },
  pricingGrid: { flexDirection: 'column', gap: 25, justifyContent: 'center', alignItems: 'center' },
  priceCard: { flex: 1, maxWidth: 400, backgroundColor: 'rgba(17, 24, 39, 0.4)', padding: 40, borderRadius: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', alignItems: 'center' },
  popularBadge: { position: 'absolute', top: -12, backgroundColor: Colors.info, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  popularText: { color: '#000', fontSize: 10, fontWeight: '900' },
  priceTier: { color: Colors.textDim, fontSize: 12, fontWeight: '900', letterSpacing: 2, marginBottom: 15 },
  priceVal: { color: Colors.text, fontSize: 42, fontWeight: '900' },
  priceMo: { fontSize: 16, color: Colors.textMuted },
  priceDesc: { color: Colors.textMuted, fontSize: 14, textAlign: 'center', marginTop: 15 },

  footerOverhaul: { padding: width > 500 ? 60 : 30, paddingBottom: 40, alignItems: 'center', overflow: 'hidden' },
  footerBorder: { position: 'absolute', top: 0, left: 40, right: 40, height: 1 },
  footerRadial: { ...StyleSheet.absoluteFillObject },
  footerContent: { alignItems: 'center', width: '100%' },
  footerTitle: { color: Colors.text, fontSize: 32, fontWeight: '900', marginBottom: 10 },
  footerSub: { color: Colors.textMuted, fontSize: 16, marginBottom: 40 },
  deployBtn: { borderRadius: 15, overflow: 'hidden', shadowColor: Colors.info, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 20 },
  deployGradient: { paddingVertical: 20, paddingHorizontal: 50 },
  deployText: { color: '#000', fontSize: 15, fontWeight: '900', letterSpacing: 1 },
  footerLinks: { flexDirection: 'row', gap: 30, marginTop: 60, marginBottom: 25 },
  footerLinkText: { color: Colors.textDim, fontSize: 11, fontWeight: '800' },
  footerCopyright: { color: Colors.textDim, fontSize: 10, opacity: 0.5 },
});
