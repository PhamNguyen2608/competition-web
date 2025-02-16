import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import type { Question } from '../types/question';

export class QuestionService {
  private static readonly COLLECTION_NAME = 'questions';

  static async getQuestions(): Promise<Question[]> {
    try {
      const questionsRef = collection(db, this.COLLECTION_NAME);
      const snapshot = await getDocs(questionsRef);
      
      return snapshot.docs.map(doc => ({
        id: parseInt(doc.id),
        ...doc.data()
      })) as Question[];
      
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }
} 