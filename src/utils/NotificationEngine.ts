import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { Platform } from 'react-native';

const RETENTION_TASK = 'RETENTION_CHECK_TASK';

class NotificationEngine {
  async initialize() {
    if (Platform.OS === 'web') return;

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      } as any),
    });

    await this.registerBackgroundTasks();
  }

  private async registerBackgroundTasks() {
    if (Platform.OS === 'web') return;

    try {
      await BackgroundFetch.registerTaskAsync(RETENTION_TASK, {
        minimumInterval: 60 * 60 * 12, // 12 hours
        stopOnTerminate: false,
        startOnBoot: true,
      });
    } catch (err) {
      console.log("Task Register Error:", err);
    }
  }

  async scheduleRetentionNotification(hoursInactive: number) {
    if (Platform.OS === 'web') return;

    let title = '';
    let body = '';

    if (hoursInactive >= 48) {
      title = 'Critical Breach Alert';
      body = 'Warning: High threat activity detected in your local area. The Syndicate needs you to clear the perimeter.';
    } else if (hoursInactive >= 24) {
      title = 'Flame Fading';
      body = 'Your Astra Flame is fading. Complete a 2km run today to keep your streak alive.';
    }

    if (title) {
      await Notifications.scheduleNotificationAsync({
        content: { title, body, data: { hoursInactive } },
        trigger: null, // Send immediately for this logic
      });
    }
  }
}

// Define the background task
TaskManager.defineTask(RETENTION_TASK, async () => {
  try {
    // In a real app, fetch last_run_date from Supabase here
    // For now, simulate logic
    const hoursInactive = 25; 
    const engine = new NotificationEngine();
    await engine.scheduleRetentionNotification(hoursInactive);
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const notificationEngine = new NotificationEngine();
