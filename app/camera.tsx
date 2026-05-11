import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Accelerometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors } from '../src/constants/Colors';

const { width, height } = Dimensions.get('window');

export default function MythicCameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const viewShotRef = useRef<any>(null);

  // Fake run stats for the overlay
  const runStats = {
    distance: '5.2 KM',
    pace: '5:40 /KM',
    faction: 'YODDHA',
    trophy: 'ASTRAL STRIDERS'
  };

  // Accelerometer data for "fake AR" movement
  const [accelData, setAccelData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    let subscription: any;
    if (Platform.OS !== 'web') {
      Accelerometer.setUpdateInterval(50);
      subscription = Accelerometer.addListener(data => {
        setAccelData(data);
      });
    }
    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  const handleShare = async () => {
    if (!viewShotRef.current?.capture) return;
    
    setIsCapturing(true);
    try {
      const uri = await viewShotRef.current.capture();
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          dialogTitle: 'Share your Mythic Trophy!',
          mimeType: 'image/jpeg',
        });
      }
    } catch (e) {
      console.error('Sharing failed:', e);
    } finally {
      setIsCapturing(false);
    }
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondary} onPress={() => router.back()}>
          <Text style={styles.btnTextSecondary}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate simple offset based on tilt
  const artifactX = -accelData.x * 200;
  const artifactY = accelData.y * 200;

  return (
    <View style={styles.container}>
      <ViewShot ref={viewShotRef} style={styles.container} options={{ format: 'jpg', quality: 0.9 }}>
        
        {/* Camera Feed */}
        {Platform.OS !== 'web' ? (
          <CameraView style={StyleSheet.absoluteFillObject} facing="back" />
        ) : (
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#111' }]} />
        )}

        {/* Floating AR Artifact */}
        <Animated.View style={[
          styles.artifactContainer,
          { transform: [{ translateX: artifactX }, { translateY: artifactY }] }
        ]}>
          <View style={styles.artifactGlow} />
          <Ionicons name="footsteps" size={150} color={Colors.info} style={styles.artifactIcon} />
          <Text style={styles.artifactName}>{runStats.trophy}</Text>
        </Animated.View>

        {/* stylized Stats Overlay */}
        <View style={styles.statsOverlay}>
          <LinearGradient colors={['rgba(0,0,0,0.8)', 'transparent']} style={styles.statsGradient}>
            <View style={styles.headerRow}>
              {!isCapturing && (
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                  <Ionicons name="close" size={28} color="#FFF" />
                </TouchableOpacity>
              )}
              <View style={styles.brandRow}>
                <Ionicons name="flash" size={16} color={Colors.secondary} />
                <Text style={styles.brandText}>MYTHIC SPRINT</Text>
              </View>
            </View>

            <View style={styles.statsBox}>
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>DISTANCE</Text>
                <Text style={styles.statValue}>{runStats.distance}</Text>
              </View>
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>PACE</Text>
                <Text style={styles.statValue}>{runStats.pace}</Text>
              </View>
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>FACTION</Text>
                <Text style={styles.statValue}>{runStats.faction}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Bottom Action Area */}
        {!isCapturing && (
          <View style={styles.bottomArea}>
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
              <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.shareGradient}>
                <Ionicons name="logo-instagram" size={24} color="#FFF" style={{ marginRight: 10 }} />
                <Text style={styles.shareText}>SHARE TO STORY</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ViewShot>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background, padding: 20 },
  permissionText: { color: Colors.text, fontSize: 16, marginBottom: 20, textAlign: 'center' },
  btn: { backgroundColor: Colors.info, paddingVertical: 15, paddingHorizontal: 30, borderRadius: 12, marginBottom: 15 },
  btnText: { color: '#000', fontWeight: '900' },
  btnSecondary: { paddingVertical: 15 },
  btnTextSecondary: { color: Colors.textDim, fontWeight: '800' },

  artifactContainer: { position: 'absolute', top: height / 2 - 100, left: width / 2 - 75, alignItems: 'center', justifyContent: 'center' },
  artifactGlow: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: Colors.info, opacity: 0.3, filter: 'blur(40px)' } as any,
  artifactIcon: { textShadowColor: Colors.info, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 30 } as any,
  artifactName: { color: '#FFF', fontSize: 18, fontWeight: '900', letterSpacing: 2, marginTop: 10, textShadowColor: '#000', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 } as any,

  statsOverlay: { position: 'absolute', top: 0, width: '100%', height: 200 },
  statsGradient: { flex: 1, padding: 25, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { padding: 5 },
  brandRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  brandText: { color: '#FFF', fontSize: 11, fontWeight: '900', letterSpacing: 2, marginLeft: 6 },

  statsBox: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  statCol: { alignItems: 'center' },
  statLabel: { color: Colors.textDim, fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 5 },
  statValue: { color: '#FFF', fontSize: 20, fontWeight: '900', textShadowColor: '#000', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 5 } as any,

  bottomArea: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center', paddingHorizontal: 30 },
  shareBtn: { width: '100%', borderRadius: 15, overflow: 'hidden', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 15 },
  shareGradient: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  shareText: { color: '#FFF', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
});
