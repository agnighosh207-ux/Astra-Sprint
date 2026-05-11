class OfflineManager {
  async initialize() {
    console.log('OfflineManager: Initialized (Web Mock)');
  }

  async saveTelemetry(data: any) {
    // No-op on web to prevent SQL errors
  }

  async prefetchAssets() {
    // No-op
  }

  async getUnsyncedData() {
    return [];
  }

  async markAsSynced(ids: number[]) {
    // No-op
  }
}

export const offlineManager = new OfflineManager();
