import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Modal, Dimensions, ScrollView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import { Colors } from '../../src/constants/Colors';
import { GlassCard } from '../../src/components/GlassCard';
import { AnimatedBackground } from '../../src/components/AnimatedBackground';

const { width } = Dimensions.get('window');

const RELICS = [
  { id: '1', name: 'Power Core', icon: 'flame', color: Colors.danger, rarity: 'RARE', lore: 'A battery from a drone. It keeps you warm.', buff: 'Earn 5% more energy while running.' },
  { id: '2', name: 'Neon Flower', icon: 'flower-outline', color: Colors.primary, rarity: 'BASIC', lore: 'A glowing flower that grows when you run fast.', buff: 'Find hidden items more easily.' },
  { id: '3', name: 'Cyber Hammer', icon: 'hammer', color: Colors.info, rarity: 'LEGENDARY', lore: 'A heavy tool for building your base.', buff: 'Earn 10% more points on your next run.' },
  { id: '4', name: 'Astra Chip', icon: 'hardware-chip', color: Colors.accent, rarity: 'RARE', lore: 'A computer chip that helps you stay hidden.', buff: 'Makes runs safer from threats.' },
  { id: '5', name: 'Speed Boost', icon: 'rocket', color: Colors.success, rarity: 'BASIC', lore: 'Boosters for your shoes.', buff: 'Increases your run speed by 2%.' },
  { id: '6', name: 'Gold Feather', icon: 'leaf', color: Colors.warning, rarity: 'LEGENDARY', lore: 'A rare feather that protects you.', buff: 'Blocks the first threat you find.' },
];

export default function InventoryTab() {
  const [equippedId, setEquippedId] = useState<string | null>(null);
  const [selectedRelic, setSelectedRelic] = useState<any>(null);
  
  const glowScale = useSharedValue(1);

  const triggerGlow = () => {
    glowScale.value = withSequence(
      withTiming(1.1, { duration: 150 }),
      withSpring(1)
    );
  };

  const handleEquip = () => {
    setEquippedId(selectedRelic.id);
    setSelectedRelic(null);
    triggerGlow();
  };

  const equippedRelic = RELICS.find(r => r.id === equippedId);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  const renderRelic = ({ item, index }: { item: any, index: number }) => {
    const isEquipped = item.id === equippedId;
    
    const handlePress = () => {
      if (Platform.OS !== 'web') Haptics.selectionAsync();
      setSelectedRelic(item);
    };

    return (
      <Animated.View 
        entering={FadeInDown.delay(index * 100).duration(800)} 
        style={styles.relicCol}
      >
        <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
          <GlassCard 
            style={[styles.relicCard, isEquipped && { borderColor: item.color, borderWidth: 2 }]}
          >
            <View style={styles.relicContent}>
              <View style={[styles.rarityDot, { backgroundColor: item.color }]} />
              <Ionicons name={item.icon as any} size={36} color={isEquipped ? item.color : Colors.text} />
              <Text style={[styles.relicName, isEquipped && { color: item.color }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.rarityLabel, { color: item.color }]}>{item.rarity}</Text>
            </View>
          </GlassCard>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>MY EQUIPMENT</Text>
          <Text style={styles.headerSubtitle}>Manage your earned Power-Ups</Text>
        </View>
 
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Active Equipment Slot */}
          <Animated.View entering={FadeInDown.duration(800)} style={styles.equipSlotContainer}>
            <Text style={styles.equipLabel}>ACTIVE POWER-UP</Text>
            
            <Animated.View style={[styles.equipBoxWrapper, glowStyle]}>
              <GlassCard style={styles.equipBox} accentColor={equippedRelic?.color}>
                {equippedRelic ? (
                  <View style={styles.equippedInner}>
                    <View style={[styles.equippedIconBox, { backgroundColor: `${equippedRelic.color}20` }]}>
                      <Ionicons name={equippedRelic.icon as any} size={40} color={equippedRelic.color} />
                    </View>
                    <View style={styles.equippedTextWrap}>
                      <Text style={[styles.equippedTitle, { color: equippedRelic.color }]}>{equippedRelic.name}</Text>
                      <Text style={styles.equippedBuff} numberOfLines={2}>{equippedRelic.buff}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.emptyEquipInner}>
                    <Ionicons name="add-circle-outline" size={40} color={Colors.textDim} />
                    <Text style={styles.emptyEquipText}>NO RELIC EQUIPPED</Text>
                  </View>
                )}
              </GlassCard>
            </Animated.View>
          </Animated.View>

          {/* Inventory Grid */}
          <View style={styles.gridSection}>
            <Text style={styles.equipLabel}>MY GEAR COLLECTION</Text>
            <FlatList
              data={RELICS}
              keyExtractor={item => item.id}
              numColumns={2}
              renderItem={renderRelic}
              scrollEnabled={false} // Scrolling is handled by parent ScrollView
              columnWrapperStyle={styles.gridRow}
            />
          </View>
        </ScrollView>

        {/* Relic Detail Bottom Sheet Modal */}
        <Modal visible={!!selectedRelic} transparent animationType="none">
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.modalDismissArea} onPress={() => setSelectedRelic(null)} />
            
            {selectedRelic && (
              <Animated.View entering={FadeInUp.springify().damping(15)} style={styles.bottomSheet}>
                <View style={styles.sheetHandle} />
                
                <View style={styles.sheetHeader}>
                  <View style={[styles.sheetIconBox, { backgroundColor: `${selectedRelic.color}20` }]}>
                    <Ionicons name={selectedRelic.icon as any} size={60} color={selectedRelic.color} />
                  </View>
                  <Text style={styles.sheetTitle}>{selectedRelic.name}</Text>
                </View>

                <View style={styles.sheetContent}>
                  <Text style={styles.sectionLabel}>ITEM STORY</Text>
                  <Text style={styles.loreText}>{selectedRelic.lore}</Text>
 
                  <View style={styles.divider} />
 
                  <Text style={[styles.sectionLabel, { color: selectedRelic.color }]}>POWER-UP EFFECT</Text>
                  <Text style={styles.buffText}>{selectedRelic.buff}</Text>
                </View>

                <TouchableOpacity 
                  style={[styles.equipBtn, { backgroundColor: selectedRelic.color }]} 
                  onPress={handleEquip}
                >
                  <Text style={styles.equipBtnText}>
                    {equippedId === selectedRelic.id ? "ALREADY EQUIPPED" : "INITIALIZE SYNC"}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 25, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  headerTitle: { color: Colors.text, fontSize: 22, fontWeight: '900', letterSpacing: 2 },
  headerSubtitle: { color: Colors.textMuted, fontSize: 13, marginTop: 4, fontWeight: '600' },

  scrollContent: { flexGrow: 1, padding: 25, paddingBottom: 120 },

  equipSlotContainer: { marginBottom: 40 },
  equipLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 15 },
  equipBoxWrapper: { width: '100%' },
  equipBox: { padding: 0 },
  emptyEquipInner: { height: 120, alignItems: 'center', justifyContent: 'center' },
  emptyEquipText: { color: Colors.textDim, fontSize: 12, fontWeight: 'bold', marginTop: 10, letterSpacing: 1 },
  equippedInner: { height: 120, flexDirection: 'row', alignItems: 'center', padding: 20 },
  equippedIconBox: { width: 70, height: 70, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  equippedTextWrap: { flex: 1, marginLeft: 20 },
  equippedTitle: { fontSize: 20, fontWeight: '900', marginBottom: 4, letterSpacing: 0.5 },
  equippedBuff: { color: Colors.textMuted, fontSize: 13, lineHeight: 18 },

  gridSection: { flex: 1 },
  gridRow: { justifyContent: 'space-between', marginBottom: 15 },
  relicCol: { width: '48%' },
  relicCard: { padding: 0 },
  relicContent: { height: 160, alignItems: 'center', justifyContent: 'center', padding: 15 },
  relicName: { color: Colors.text, fontSize: 13, fontWeight: '900', marginTop: 15, textAlign: 'center', letterSpacing: 0.5 },
  rarityDot: { position: 'absolute', top: 12, left: 12, width: 6, height: 6, borderRadius: 3, opacity: 0.8 },
  rarityLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 1.5, marginTop: 4, opacity: 0.7 },
  equippedIndicator: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, shadowColor: '#FFF', shadowOpacity: 1, shadowRadius: 5 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalDismissArea: { flex: 1 },
  bottomSheet: { backgroundColor: Colors.background, borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 35, paddingBottom: 60, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  sheetHandle: { width: 45, height: 5, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, alignSelf: 'center', marginBottom: 35 },
  sheetHeader: { alignItems: 'center', marginBottom: 35 },
  sheetIconBox: { width: 110, height: 110, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20 },
  sheetTitle: { color: Colors.text, fontSize: 28, fontWeight: '900', letterSpacing: 1 },
  
  sheetContent: { backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 24, padding: 25, marginBottom: 35, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  sectionLabel: { color: Colors.textDim, fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 12 },
  loreText: { color: Colors.textMuted, fontSize: 15, lineHeight: 24, fontStyle: 'italic' },
  buffText: { color: Colors.text, fontSize: 16, lineHeight: 24, fontWeight: '700' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 20 },

  equipBtn: { paddingVertical: 20, borderRadius: 18, alignItems: 'center', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 10 },
  equipBtnText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 1.5 },
});
