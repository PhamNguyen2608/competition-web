import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { CacheService } from './cacheService';
import type { Question } from '../types/question';

export class QuestionService {
  private static readonly COLLECTION_NAME = 'questions';
  private static readonly VERSION_DOC = 'metadata';

  static async getQuestions(): Promise<Question[]> {
    try {
      // Kiểm tra version từ Firestore
      const metaDoc = await getDoc(doc(db, this.COLLECTION_NAME, this.VERSION_DOC));
      const serverVersion = metaDoc.exists() ? metaDoc.data()?.version : Date.now();

      // Lấy câu hỏi từ cache
      const { questions: cachedQuestions, version: cachedVersion } = 
        await CacheService.getCachedQuestions();

      // Nếu có cache và version khớp, trả về cache
      if (cachedQuestions && cachedVersion === serverVersion) {
        console.log('Loading questions from cache');
        return cachedQuestions;
      }

      // Nếu không có cache hoặc version khác, tải mới
      console.log('Loading questions from server');
      const questionsRef = collection(db, this.COLLECTION_NAME);
      const snapshot = await getDocs(questionsRef);
      
      const questions = snapshot.docs
        .filter(doc => doc.id !== this.VERSION_DOC) // Loại bỏ document metadata
        .map(doc => ({
          id: parseInt(doc.id),
          ...doc.data()
        })) as Question[];

      // Cache lại câu hỏi
      await CacheService.cacheQuestions(questions);
      
      return questions;
    } catch (error) {
      console.error('Error fetching questions:', error);
      
      // Nếu có lỗi và có cache, trả về cache
      const { questions: cachedQuestions } = await CacheService.getCachedQuestions();
      if (cachedQuestions) {
        console.log('Error occurred, using cached questions');
        return cachedQuestions;
      }
      
      throw error;
    }
  }
} 