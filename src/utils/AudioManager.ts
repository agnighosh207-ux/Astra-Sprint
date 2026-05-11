import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

class AudioManager {
  private ambientSound: Audio.Sound | null = null;
  private chaseSound: Audio.Sound | null = null;
  private isInitialized = false;
  private isChaseActive = false;

  async initialize() {
    if (this.isInitialized) return;
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
      this.isInitialized = true;
    } catch (e) {
      console.error('Audio Setup Error:', e);
    }
  }

  async startAmbient(url: string, chaseUrl: string) {
    await this.initialize();
    
    // Clear existing
    if (this.ambientSound) await this.ambientSound.unloadAsync();
    if (this.chaseSound) await this.chaseSound.unloadAsync();

    try {
      const { sound: ambient } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      const { sound: chase } = await Audio.Sound.createAsync(
        { uri: chaseUrl },
        { shouldPlay: true, isLooping: true, volume: 0.0 } // Pre-load but silent
      );
      this.ambientSound = ambient;
      this.chaseSound = chase;
    } catch (e) {
      console.log('Audio Load Failed:', e);
    }
  }

  async setChaseMode(active: boolean) {
    if (!this.ambientSound || !this.chaseSound) return;
    this.isChaseActive = active;
    
    if (active) {
      // Crossfade to Chase
      await this.ambientSound.setVolumeAsync(0.0);
      await this.chaseSound.setVolumeAsync(1.0);
    } else {
      // Crossfade back to Ambient
      await this.chaseSound.setVolumeAsync(0.0);
      await this.ambientSound.setVolumeAsync(1.0);
    }
  }

  async playTransmission(text: string, urgencyLevel: 'low' | 'high' = 'low') {
    // 1. Duck Ambient Audio
    if (this.ambientSound) {
      await this.ambientSound.setVolumeAsync(0.2);
    }

    // 2. TTS Execution with Memory Garbage Collection
    const options: Speech.SpeechOptions = {
      pitch: urgencyLevel === 'high' ? 1.2 : 1.0,
      rate: urgencyLevel === 'high' ? 1.1 : 0.9,
      onDone: () => {
        // Restore active audio level
        const volume = this.isChaseActive ? 1.0 : 1.0;
        if (this.ambientSound && !this.isChaseActive) this.ambientSound.setVolumeAsync(1.0).catch(console.error);
        if (this.chaseSound && this.isChaseActive) this.chaseSound.setVolumeAsync(1.0).catch(console.error);
        Speech.stop();
      },
      onError: (e) => {
        console.error('TTS Error:', e);
        if (this.ambientSound) this.ambientSound.setVolumeAsync(1.0).catch(console.error);
      },
    };

    Speech.speak(text, options);
  }

  async stopAll() {
    if (this.ambientSound) {
      await this.ambientSound.stopAsync();
      await this.ambientSound.unloadAsync();
      this.ambientSound = null;
    }
    Speech.stop();
  }
}

export const audioManager = new AudioManager();
