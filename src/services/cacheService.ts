import { openDB } from 'idb';
import type { Question } from '../types/question';

const CACHE_DB_NAME = 'app-cache';
const CACHE_STORE_NAME = 'assets';
const QUESTIONS_STORE_NAME = 'questions';
const QUESTIONS_META_STORE_NAME = 'questions-meta';
const EXAM_RESULTS_STORE_NAME = 'exam-results';
const EXAM_RESULTS_META_STORE_NAME = 'exam-results-meta';
const DB_VERSION = 2;

export const CacheService = {
  async initDB() {
    return openDB(CACHE_DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Tạo stores nếu chưa tồn tại
        if (!db.objectStoreNames.contains(CACHE_STORE_NAME)) {
          db.createObjectStore(CACHE_STORE_NAME);
        }
        if (!db.objectStoreNames.contains(QUESTIONS_STORE_NAME)) {
          db.createObjectStore(QUESTIONS_STORE_NAME);
        }
        if (!db.objectStoreNames.contains(QUESTIONS_META_STORE_NAME)) {
          db.createObjectStore(QUESTIONS_META_STORE_NAME);
        }
        if (!db.objectStoreNames.contains(EXAM_RESULTS_STORE_NAME)) {
          db.createObjectStore(EXAM_RESULTS_STORE_NAME);
        }
        if (!db.objectStoreNames.contains(EXAM_RESULTS_META_STORE_NAME)) {
          db.createObjectStore(EXAM_RESULTS_META_STORE_NAME);
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
  },

  async cacheQuestions(questions: Question[]) {
    const db = await this.initDB();
    const tx = db.transaction([QUESTIONS_STORE_NAME, QUESTIONS_META_STORE_NAME], 'readwrite');
    
    // Lưu câu hỏi
    await tx.objectStore(QUESTIONS_STORE_NAME).put(questions, 'all');
    
    // Lưu metadata (thời gian cache)
    await tx.objectStore(QUESTIONS_META_STORE_NAME).put({
      timestamp: Date.now(),
      version: Date.now() // Version để kiểm tra update
    }, 'meta');
    
    await tx.done;
  },

  async getCachedQuestions(): Promise<{questions: Question[] | null, version: number}> {
    const db = await this.initDB();
    const questions = await db.get(QUESTIONS_STORE_NAME, 'all');
    const meta = await db.get(QUESTIONS_META_STORE_NAME, 'meta');
    
    return {
      questions: questions || null,
      version: meta?.version || 0
    };
  }
  
}; 