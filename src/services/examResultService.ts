import { collection, doc, getDoc, setDoc, query, where, getDocs, Timestamp, addDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase.config';
import { ExamResult } from '../types/exam';

export class ExamResultService {
  private static readonly COLLECTION_NAME = 'exam_results';

  static async saveResult(data: Omit<ExamResult, 'completedAt' | 'attemptCount'>, duration: number) {
    try {
      // Kiểm tra số lần thi
      const results = await this.getUserResults();
      if (results.length >= 3) {
        throw new Error('Đã vượt quá giới hạn số lần thi (tối đa 3 lần)');
      }

      const attemptCount = results.length + 1;
      
      const examResult = {
        ...data,
        completedAt: Timestamp.now(),
        attemptCount,
        duration
      };

      await addDoc(collection(db, 'exam_results'), examResult);
      return examResult;
    } catch (error) {
      console.error('Error saving exam result:', error);
      throw error;
    }
  }

  static async getUserResults(): Promise<ExamResult[]> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const q = query(
        collection(db, this.COLLECTION_NAME), 
        where('userId', '==', user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as ExamResult);
    } catch (error) {
      console.error('Error fetching exam results:', error);
      throw error;
    }
  }

  private static async getAttemptCount(userId: string): Promise<number> {
    const q = query(collection(db, this.COLLECTION_NAME), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  }
} 
