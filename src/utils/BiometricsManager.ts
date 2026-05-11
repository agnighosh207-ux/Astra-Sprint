import { Platform } from 'react-native';

// Conditional imports for health libraries (Native only)
let AppleHealthKit: any = null;
let GoogleFit: any = null;

if (Platform.OS === 'ios') {
  AppleHealthKit = require('react-native-health');
} else if (Platform.OS === 'android') {
  GoogleFit = require('react-native-google-fit').default;
}

class BiometricsManager {
  private isAuthorized = false;

  async requestPermissions() {
    if (Platform.OS === 'web') return false;

    if (Platform.OS === 'ios' && AppleHealthKit) {
      const permissions = {
        permissions: {
          read: [AppleHealthKit.Constants.Permissions.HeartRate],
          write: []
        }
      };
      return new Promise((resolve) => {
        AppleHealthKit.initHealthKit(permissions, (error: any) => {
          if (error) resolve(false);
          this.isAuthorized = true;
          resolve(true);
        });
      });
    }

    if (Platform.OS === 'android' && GoogleFit) {
      const options = {
        scopes: [
          'https://www.googleapis.com/auth/fitness.heart_rate.read',
        ],
      };
      const result = await GoogleFit.authorize(options);
      this.isAuthorized = result.success;
      return result.success;
    }

    return false;
  }

  async getLiveHeartRate(): Promise<number | null> {
    // Fallback: If not authorized or on web, return null (triggers simulated exertion)
    if (!this.isAuthorized || Platform.OS === 'web') return null;

    if (Platform.OS === 'ios' && AppleHealthKit) {
      return new Promise((resolve) => {
        const options = {
          unit: 'bpm',
          startDate: new Date(Date.now() - 1000 * 60).toISOString(), // Last 1 min
        };
        AppleHealthKit.getHeartRateSamples(options, (err: any, results: any) => {
          if (err || !results || results.length === 0) resolve(null);
          else resolve(results[0].value);
        });
      });
    }

    if (Platform.OS === 'android' && GoogleFit) {
      const options = {
        startDate: new Date(Date.now() - 1000 * 60).toISOString(),
        endDate: new Date().toISOString(),
      };
      const res = await GoogleFit.getHeartRateSamples(options);
      if (res && res.length > 0) return res[0].value;
    }

    return null;
  }

  calculateSimulatedExertion(currentPace: number, avgPace: number): number {
    // If pace is 20% faster than average, simulated HR is higher
    const baselineHR = 140;
    const paceDiff = (avgPace - currentPace) / avgPace; // Positive if faster
    return Math.floor(baselineHR + (paceDiff * 40)); 
  }
}

export const biometricsManager = new BiometricsManager();
