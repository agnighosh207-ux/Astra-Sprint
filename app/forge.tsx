import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence, 
  withDelay,
  Easing,
  withSpring
} from 'react-native-reanimated';
import { Colors } from '../src/constants/Colors';
import { AnimatedBackground } from '../src/components/AnimatedBackground';
import { GlassCard } from '../src/components/GlassCard';

const { width, height } = Dimensions.get('window');

const RECIPES = [
  { 
    id: '1', 
    name: 'ASTRAL STRIDERS', 
    type: 'GEAR', 
    icon: 'footsteps', 
    desc: 'Lightweight biometric shoes. 1.05x Distance Multiplier.', 
    materials: [{ name: 'Scrap', qty: 50 }, { name: 'Lotus', qty: 1 }],
    color: Colors.info 
  },
  { 
    id: '2', 
    name: 'RAKSHASA CORE', 
    type: 'RELIC', 
    icon: 'nuclear', 
    desc: 'A pulsing demonic battery. Reduces Hunt threat level.', 
    materials: [{ name: 'Scrap', qty: 100 }, { name: 'Essence', qty: 5 }],
    color: Colors.danger 
  },
  { 
    id: '3', 
    name: 'CHRONOS WATCH', 
    type: 'GEAR', 
    icon: 'time', 
    desc: 'Manipulates perceived time. 1.1x KCAL Burn Multiplier.', 
    materials: [{ name: 'Scrap', qty: 75 }, { name: 'Lotus', qty: 2 }],
    color: Colors.accent 
  }
];

export default function ForgeScreen() {
  const router = useRouter();
  const [selectedRecipe, setSelectedRecipe] = useState(RECIPES[0]);
  const [isForging, setIsForging] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Animation values
  const forgeProgress = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  const startForge = () => {
    setIsForging(true);
    forgeProgress.value = withTiming(1, { duration: 2500, easing: Easing.bezier(0.4, 0, 0.2, 1) });
    glowOpacity.value = withSequence(
      withDelay(500, withTiming(1, { duration: 1000 })),
      withTiming(0, { duration: 500 })
    );

    setTimeout(() => {
      setIsForging(false);
      setShowResult(true);
      forgeProgress.value = 0;
    }, 3000);
  };

  const forgeAnimatedStyle = useAnimatedStyle(() => ({
    height: `${forgeProgress.value * 100}%`,
    opacity: forgeProgress.value,
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: withSpring(glowOpacity.value ? 1.5 : 1) }]
  }));

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>THE FORGE</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Animated.View entering={FadeInDown.duration(500)} style={styles.forgeArea}>
            <GlassCard style={styles.forgeMainCard}>
              <View style={styles.forgeVisual}>
                {/* Central Item Glow */}
                <Animated.View style={[styles.forgeGlow, glowAnimatedStyle]}>
                  <LinearGradient 
                    colors={[selectedRecipe.color, 'transparent']} 
                    style={styles.fullSize}
                  />
                </Animated.View>

                <View style={styles.forgeItemCircle}>
                  <Ionicons name={selectedRecipe.icon as any} size={64} color={isForging ? Colors.textDim : selectedRecipe.color} />
                </View>

                {isForging && (
                  <View style={styles.progressTrack}>
                    <Animated.View style={[styles.progressFill, { backgroundColor: selectedRecipe.color }, forgeAnimatedStyle]} />
                  </View>
                )}
              </View>

              <View style={styles.recipeDetails}>
                <Text style={styles.recipeType}>{selectedRecipe.type}</Text>
                <Text style={styles.recipeName}>{selectedRecipe.name}</Text>
                <Text style={styles.recipeDesc}>{selectedRecipe.desc}</Text>
              </View>

              <View style={styles.materialsRow}>
                {selectedRecipe.materials.map((mat, i) => (
                  <View key={i} style={styles.materialItem}>
                    <Text style={styles.matQty}>{mat.qty}</Text>
                    <Text style={styles.matName}>{mat.name}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity 
                style={[styles.forgeBtn, { backgroundColor: selectedRecipe.color }]} 
                onPress={startForge}
                disabled={isForging}
              >
                <Text style={styles.forgeBtnText}>{isForging ? 'FORGING...' : 'INITIATE FORGE'}</Text>
              </TouchableOpacity>
            </GlassCard>
          </Animated.View>

          <Text style={styles.sectionTitle}>BLUEPRINTS AVAILABLE</Text>
          
          <View style={styles.blueprintList}>
            {RECIPES.map((recipe, idx) => (
              <TouchableOpacity key={recipe.id} onPress={() => setSelectedRecipe(recipe)}>
                <GlassCard 
                  style={[
                    styles.blueprintCard, 
                    selectedRecipe.id === recipe.id ? { borderColor: recipe.color, borderWidth: 2 } : {}
                  ]}
                >
                  <Ionicons name={recipe.icon as any} size={24} color={recipe.color} />
                  <Text style={styles.blueprintName}>{recipe.name}</Text>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>

      {/* Success Modal */}
      {showResult && (
        <View style={styles.modalOverlay}>
          <Animated.View entering={FadeInDown.springify()} style={styles.resultCard}>
            <LinearGradient colors={[selectedRecipe.color, 'transparent']} style={styles.resultGlow} />
            <Ionicons name="checkmark-circle" size={80} color={selectedRecipe.color} />
            <Text style={styles.resultTitle}>FORGE SUCCESSFUL</Text>
            <Text style={styles.resultItemName}>{selectedRecipe.name}</Text>
            <Text style={styles.resultDesc}>Added to your inventory.</Text>
            <TouchableOpacity style={styles.claimBtn} onPress={() => setShowResult(false)}>
              <Text style={styles.claimBtnText}>EQUIP NOW</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 25, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backButton: { padding: 5 },
  headerTitle: { color: Colors.text, fontSize: 14, fontWeight: '900', letterSpacing: 2, marginLeft: 15 },
  scrollContent: { padding: 25, paddingBottom: 60 },

  forgeArea: { marginBottom: 40 },
  forgeMainCard: { padding: 0, overflow: 'hidden' },
  forgeVisual: { height: 250, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  forgeGlow: { position: 'absolute', width: 200, height: 200, borderRadius: 100 },
  fullSize: { flex: 1, borderRadius: 100 },
  forgeItemCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  
  progressTrack: { position: 'absolute', right: 20, top: 40, bottom: 40, width: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 },
  progressFill: { position: 'absolute', bottom: 0, left: 0, right: 0, borderRadius: 2 },

  recipeDetails: { padding: 25, alignItems: 'center' },
  recipeType: { color: Colors.textDim, fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 8 },
  recipeName: { color: Colors.text, fontSize: 24, fontWeight: '900', marginBottom: 12 },
  recipeDesc: { color: Colors.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 20 },

  materialsRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 30, paddingHorizontal: 25 },
  materialItem: { backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  matQty: { color: Colors.text, fontSize: 16, fontWeight: '900' },
  matName: { color: Colors.textDim, fontSize: 10, fontWeight: '800' },

  forgeBtn: { margin: 25, marginTop: 0, paddingVertical: 18, borderRadius: 15, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  forgeBtnText: { color: '#FFF', fontSize: 14, fontWeight: '900', letterSpacing: 1 },

  sectionTitle: { color: Colors.textDim, fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 20 },
  blueprintList: { gap: 15 },
  blueprintCard: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  blueprintName: { color: Colors.text, fontSize: 15, fontWeight: '800', marginLeft: 15 },

  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.9)', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  resultCard: { width: width * 0.85, backgroundColor: Colors.card, borderRadius: 30, padding: 40, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  resultGlow: { ...StyleSheet.absoluteFillObject, borderRadius: 30, opacity: 0.1 },
  resultTitle: { color: Colors.textDim, fontSize: 12, fontWeight: '900', letterSpacing: 2, marginTop: 20 },
  resultItemName: { color: Colors.text, fontSize: 28, fontWeight: '900', marginTop: 10 },
  resultDesc: { color: Colors.textMuted, fontSize: 14, marginTop: 10, textAlign: 'center' },
  claimBtn: { marginTop: 30, backgroundColor: '#FFF', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 12 },
  claimBtnText: { color: '#000', fontWeight: '900', fontSize: 14 },
});
