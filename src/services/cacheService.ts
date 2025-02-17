import { openDB } from 'idb';

const CACHE_DB_NAME = 'app-cache';
const CACHE_STORE_NAME = 'assets';
const DB_VERSION = 1;

export const CacheService = {
  async initDB() {
    return openDB(CACHE_DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(CACHE_STORE_NAME)) {
          db.createObjectStore(CACHE_STORE_NAME);
        }
      },
    });
  },

  async cacheAsset(url: string, blob: Blob) {
    const db = await this.initDB();
    await db.put(CACHE_STORE_NAME, blob, url);
  },

  async getCachedAsset(url: string): Promise<Blob | null> {
    const db = await this.initDB();
    return db.get(CACHE_STORE_NAME, url);
  },

  async loadAndCacheImage(url: string): Promise<string> {
    try {
      // Kiểm tra cache trước
      const cachedBlob = await this.getCachedAsset(url);
      if (cachedBlob) {
        return URL.createObjectURL(cachedBlob);
      }

      // Nếu không có trong cache, tải và cache
      const response = await fetch(url);
      const blob = await response.blob();
      await this.cacheAsset(url, blob);
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error caching image:', error);
      return url; // Fallback về URL gốc nếu có lỗi
    }
  }
}; 