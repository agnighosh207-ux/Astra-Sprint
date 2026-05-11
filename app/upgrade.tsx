import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import PricingMatrix from '../src/components/PricingMatrix';

export default function UpgradeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#00FFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ELITE STATUS</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.heroSection}>
          <Ionicons name="diamond-outline" size={60} color="#FF9933" />
          <Text style={styles.heroText}>BECOME AN ELITE OPERATIVE</Text>
          <Text style={styles.heroSubText}>Unlock infinite AI missions, advanced biometric tracking, and exclusive mythical armor sets.</Text>
        </View>

        {/* The New Pricing Matrix Component */}
        <PricingMatrix />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050508' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0, 255, 255, 0.2)' },
  backButton: { marginRight: 20 },
  headerTitle: { color: '#00FFFF', fontSize: 18, fontWeight: 'bold', letterSpacing: 2 },
  content: { flex: 1, paddingTop: 20 },
  heroSection: { alignItems: 'center', marginBottom: 20, paddingHorizontal: 20 },
  heroText: { color: '#FF9933', fontSize: 22, fontWeight: '900', letterSpacing: 1, marginTop: 10, textAlign: 'center' },
  heroSubText: { color: '#AAAAAA', fontSize: 13, textAlign: 'center', marginTop: 8, lineHeight: 20 },
});
