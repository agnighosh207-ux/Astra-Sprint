import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { offlineManager } from '../src/utils/OfflineManager';
import { audioManager } from '../src/utils/AudioManager';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors } from '../src/constants/Colors';
import { AnimatedBackground } from '../src/components/AnimatedBackground';
import { GlassCard } from '../src/components/GlassCard';

const { width } = Dimensions.get('window');

export default function SafehouseScreen() {
  const router = useRouter();
  const [rations, setRations] = useState(0);
  const [scrap, setScrap] = useState(0);
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null);

  const [levels, setLevels] = useState({
    med_bay_lv: 1,
    comms_tower_lv: 1,
    forge_lv: 1
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const eco = await offlineManager.getEconomy();
    setRations(eco.rations);
    setScrap(eco.scrap);
    setLevels({
      med_bay_lv: eco.med_bay_lv,
      comms_tower_lv: eco.comms_tower_lv,
      forge_lv: eco.forge_lv
    });
  };

  const upgradeNode = async (node: string, cost: number, type: 'rations' | 'scrap') => {
    if (type === 'rations' && rations < cost) return;
    if (type === 'scrap' && scrap < cost) return;

    setIsUpgrading(node);
    audioManager.playTransmission("Initiating construction protocol. Stand by...", "low");

    setTimeout(async () => {
      await offlineManager.upgradeNode(node, cost, type);
      await loadData();
      setIsUpgrading(null);
      audioManager.playTransmission("Node upgrade complete. Syndicate influence expanded.", "low");
    }, 2500);
  };

  const nodes = [
    { 
      id: 'med_bay_lv', 
      name: 'MED-BAY', 
      level: levels.med_bay_lv, 
      icon: 'heart-half', 
      desc: 'Reduces recovery time needed before starting another high-intensity mission.', 
      cost: levels.med_bay_lv * 50, 
      costType: 'rations' as const,
      color: Colors.danger 
    },
    { 
      id: 'comms_tower_lv', 
      name: 'COMMS TOWER', 
      level: levels.comms_tower_lv, 
      icon: 'radio', 
      desc: 'Unlocks new AI radio channels and intercepts hidden lore transmissions.', 
      cost: levels.comms_tower_lv * 40, 
      costType: 'scrap' as const,
      color: Colors.info 
    },
    { 
      id: 'forge_lv', 
      name: 'THE FORGE', 
      level: levels.forge_lv, 
      icon: 'construct', 
      desc: 'Unlocks weapon and armor crafting. Boosts kinetic energy rewards.', 
      cost: levels.forge_lv * 60, 
      costType: 'scrap' as const,
      color: Colors.accent 
    }
  ];

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SYNDICATE HQ</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Resource Display */}
          <View style={styles.resourceRow}>
            <GlassCard style={styles.resCard}>
              <Ionicons name="fast-food" size={20} color={Colors.warning} />
              <View style={{ marginLeft: 15 }}>
                <Text style={styles.resLabel}>RATIONS</Text>
                <Text style={styles.resVal}>{rations}</Text>
              </View>
            </GlassCard>
            <GlassCard style={styles.resCard}>
              <Ionicons name="construct" size={20} color={Colors.textMuted} />
              <View style={{ marginLeft: 15 }}>
                <Text style={styles.resLabel}>SCRAP</Text>
                <Text style={styles.resVal}>{scrap}</Text>
              </View>
            </GlassCard>
          </View>

          <Text style={styles.sectionTitle}>BASE INFRASTRUCTURE</Text>

          {nodes.map((node, idx) => (
            <Animated.View key={node.id} entering={FadeInDown.delay(idx * 150).duration(500)}>
              <GlassCard style={styles.nodeCard} accentColor={node.color}>
                <View style={styles.nodeTop}>
                  <View style={[styles.iconBox, { backgroundColor: `${node.color}20` }]}>
                    <Ionicons name={node.icon as any} size={28} color={node.color} />
                  </View>
                  <View style={styles.nodeMeta}>
                    <Text style={styles.nodeName}>{node.name}</Text>
                    <Text style={[styles.nodeLevel, { color: node.color }]}>RANK {node.level}</Text>
                  </View>
                </View>
                <Text style={styles.nodeDesc}>{node.desc}</Text>
                
                <TouchableOpacity 
                  style={[styles.upgradeBtn, { borderColor: node.color }, (isUpgrading || (node.costType === 'rations' ? rations < node.cost : scrap < node.cost)) && { opacity: 0.5 }]} 
                  onPress={() => upgradeNode(node.id, node.cost, node.costType)}
                  disabled={!!isUpgrading || (node.costType === 'rations' ? rations < node.cost : scrap < node.cost)}
                >
                  <LinearGradient 
                    colors={[`${node.color}30`, 'transparent']} 
                    start={{x:0, y:0}} end={{x:1, y:1}}
                    style={styles.btnGradient}
                  >
                    {isUpgrading === node.id ? (
                      <ActivityIndicator color={node.color} size="small" />
                    ) : (
                      <>
                        <Text style={styles.upgradeText}>UPGRADE NODE</Text>
                        <Text style={styles.costText}>-{node.cost} {node.costType.toUpperCase()}</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </GlassCard>
            </Animated.View>
          ))}

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backButton: { padding: 5 },
  headerTitle: { color: Colors.text, fontSize: 14, fontWeight: '900', letterSpacing: 2, marginLeft: 15 },
  scrollContent: { padding: 25, paddingBottom: 60 },

  resourceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 35 },
  resCard: { flex: 0.48, flexDirection: 'row', alignItems: 'center', padding: 15 },
  resLabel: { color: Colors.textDim, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  resVal: { color: Colors.text, fontSize: 20, fontWeight: '900' },

  sectionTitle: { color: Colors.textDim, fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 25 },
  
  nodeCard: { marginBottom: 25, padding: 0 },
  nodeTop: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.border },
  iconBox: { width: 50, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  nodeMeta: { marginLeft: 15 },
  nodeName: { color: Colors.text, fontSize: 18, fontWeight: '900' },
  nodeLevel: { fontSize: 11, fontWeight: 'bold', marginTop: 2 },
  
  nodeDesc: { color: Colors.textMuted, fontSize: 14, lineHeight: 22, padding: 20 },
  
  upgradeBtn: { margin: 20, marginTop: 0, borderRadius: 12, overflow: 'hidden', borderWidth: 1 },
  btnGradient: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
  upgradeText: { color: Colors.text, fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  costText: { color: Colors.textDim, fontSize: 11, fontWeight: '800' },
});
