// src/services/dbInit.ts
import { Capacitor } from '@capacitor/core';
import { initDatabase } from './database';

let dbReadyPromise: Promise<void> | null = null;

export function ensureDatabaseReady(): Promise<void> {
  if (!dbReadyPromise) {
    dbReadyPromise = (async () => {
      // Optional: wait for the plugin to be available if using Capacitor SQLite
      const start = Date.now();
      while (!Capacitor.isPluginAvailable('CapacitorSQLite')) {
        if (Date.now() - start > 8000) {
          throw new Error('CapacitorSQLite plugin not available');
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      await initDatabase();
    })();
  }
  return dbReadyPromise;
}