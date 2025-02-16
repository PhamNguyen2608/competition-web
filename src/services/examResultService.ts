import { collection, doc, getDoc, setDoc, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase.config';
import { ExamResult } from '../types/exam';

export class ExamResultService {
  private static readonly COLLECTION_NAME = 'exam_results';

  static async saveResult(result: Omit<ExamResult, 'userId' | 'completedAt' | 'attemptCount'>): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const currentAttempt = await this.getAttemptCount(user.uid);
    const resultId = `${user.uid}_${currentAttempt + 1}`;
    
    const examResult: ExamResult = {
      ...result,
      userId: user.uid,
      completedAt: new Date().toISOString(),
      attemptCount: currentAttempt + 1,
    };

    await setDoc(doc(db, this.COLLECTION_NAME, resultId), examResult);
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
