import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const MISSIONS = [
  { id: '1', title: 'The Vanara Scout', description: 'Escape the Rakshasa perimeter.', isLocked: false },
  { id: '2', title: 'Delivery to the Hooghly', description: 'High-speed stealth run.', isLocked: true },
  { id: '3', title: 'Cyber-Kolkata Grid', description: 'Navigate the neon market.', isLocked: true },
];

export default function MissionsTab() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const handleMissionPress = (isLocked: boolean) => {
    if (isLocked) {
      setModalVisible(true);
    } else {
      router.push('/(tabs)/map');
    }
  };

  const handleUpgrade = () => {
    setModalVisible(false);
    router.push('/upgrade');
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.missionCard, item.isLocked && styles.lockedCard]}
      onPress={() => handleMissionPress(item.isLocked)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.missionTitle, item.isLocked && { color: '#555' }]}>{item.title}</Text>
        {item.isLocked ? (
          <Ionicons name="lock-closed" size={24} color="#FF4500" />
        ) : (
          <Ionicons name="play-circle" size={28} color="#00FFFF" />
        )}
      </View>
      <Text style={[styles.missionDescription, item.isLocked && { color: '#444' }]}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>ACTIVE CAMPAIGNS</Text>
      <FlatList
        data={MISSIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      {/* Premium Upgrade Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient colors={['#111', '#000']} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="shield-checkmark" size={60} color="#FF9933" />
              <Text style={styles.modalTitle}>ELITE CLEARANCE REQUIRED</Text>
            </View>
            
            <Text style={styles.modalBody}>
              This mission contains high-level intel. Upgrade to <Text style={{ color: '#00FFFF', fontWeight: 'bold' }}>Elite Operative</Text> status to unlock this campaign, access infinite AI generated missions, and equip advanced mythical armor.
            </Text>

            <TouchableOpacity style={styles.upgradeBtn} onPress={handleUpgrade}>
              <Text style={styles.upgradeBtnText}>ACCESS MONETIZATION GATEWAY</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeBtnText}>ABORT</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000', paddingTop: 20 },
  headerTitle: { color: '#00FFFF', fontSize: 20, fontWeight: 'bold', letterSpacing: 2, paddingHorizontal: 20, marginBottom: 20 },
  listContainer: { paddingHorizontal: 20 },
  missionCard: { backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: '#00FFFF', borderWidth: 1, borderRadius: 8, padding: 20, marginBottom: 15 },
  lockedCard: { borderColor: '#333', backgroundColor: '#050505', opacity: 0.8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  missionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  missionDescription: { color: '#AAAAAA', fontSize: 14 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', borderRadius: 16, padding: 30, alignItems: 'center', borderColor: '#FF9933', borderWidth: 2, shadowColor: '#FF9933', shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  modalHeader: { alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: '#FF9933', fontSize: 18, fontWeight: '900', letterSpacing: 2, marginTop: 15, textAlign: 'center' },
  modalBody: { color: '#CCCCCC', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  upgradeBtn: { backgroundColor: '#FF9933', width: '100%', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  upgradeBtnText: { color: '#000', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },
  closeBtn: { paddingVertical: 10 },
  closeBtnText: { color: '#888', fontSize: 12, fontWeight: 'bold', letterSpacing: 2 },
});
