import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

class OfflineManager {
  private db: any = null;

  async initialize() {
    try {
      this.db = await SQLite.openDatabaseAsync('mythic_sprint.db');
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS run_telemetry (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp TEXT,
          latitude REAL,
          longitude REAL,
          pace REAL,
          distance REAL,
          synced INTEGER DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS player_economy (
          id INTEGER PRIMARY KEY DEFAULT 1,
          rations INTEGER DEFAULT 100,
          scrap INTEGER DEFAULT 50,
          karma INTEGER DEFAULT 0,
          med_bay_lv INTEGER DEFAULT 1,
          comms_tower_lv INTEGER DEFAULT 1,
          forge_lv INTEGER DEFAULT 1
        );
        INSERT OR IGNORE INTO player_economy (id, rations, scrap, karma, med_bay_lv, comms_tower_lv, forge_lv) 
        VALUES (1, 100, 50, 0, 1, 1, 1);
      `);
    } catch (e) {
      console.error('OfflineManager Native Initialization Error:', e);
    }
  }

  async saveTelemetry(data: { latitude: number, longitude: number, pace: number, distance: number }) {
    if (!this.db) return;

    try {
      const timestamp = new Date().toISOString();
      await this.db.runAsync(
        'INSERT INTO run_telemetry (timestamp, latitude, longitude, pace, distance) VALUES (?, ?, ?, ?, ?)',
        [timestamp, data.latitude, data.longitude, data.pace, data.distance]
      );
    } catch (e) {
      console.error('Failed to save native telemetry:', e);
    }
  }

  async prefetchAssets() {
    const criticalAssets = [
      'https://example.com/audio/threat_generic.mp3',
      'https://example.com/audio/milestone_generic.mp3'
    ];
    
    for (const url of criticalAssets) {
      const filename = url.split('/').pop();
      // @ts-ignore
      const path = `${FileSystem.documentDirectory}${filename}`;
      const info = await FileSystem.getInfoAsync(path);
      if (!info.exists) {
        try {
          await FileSystem.downloadAsync(url, path);
        } catch (e) {
          console.log('Prefetch Download Failed:', e);
        }
      }
    }
  }

  async getUnsyncedData() {
    if (!this.db) return [];
    try {
      return await this.db.getAllAsync('SELECT * FROM run_telemetry WHERE synced = 0');
    } catch (e) {
      return [];
    }
  }

  async markAsSynced(ids: number[]) {
    if (!this.db || ids.length === 0) return;
    try {
      const placeholders = ids.map(() => '?').join(',');
      await this.db.runAsync(`UPDATE run_telemetry SET synced = 1 WHERE id IN (${placeholders})`, ids);
    } catch (e) {
      console.error('Native Sync update failed:', e);
    }
  }
  async getEconomy() {
    if (!this.db) return { rations: 0, scrap: 0, karma: 0 };
    try {
      const result: any = await this.db.getFirstAsync('SELECT * FROM player_economy WHERE id = 1');
      return result || { rations: 100, scrap: 50, karma: 0 };
    } catch (e) {
      return { rations: 100, scrap: 50, karma: 0 };
    }
  }

  async updateEconomy(rationsDelta: number, scrapDelta: number, karmaDelta: number) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        'UPDATE player_economy SET rations = rations + ?, scrap = scrap + ?, karma = karma + ? WHERE id = 1',
        [rationsDelta, scrapDelta, karmaDelta]
      );
    } catch (e) {
      console.error('Failed to update player economy:', e);
    }
  }

  async upgradeNode(nodeColumn: string, cost: number, costType: 'rations' | 'scrap') {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        `UPDATE player_economy SET ${nodeColumn} = ${nodeColumn} + 1, ${costType} = ${costType} - ? WHERE id = 1`,
        [cost]
      );
    } catch (e) {
      console.error('Safehouse Upgrade Failed:', e);
    }
  }
}

export const offlineManager = new OfflineManager();
