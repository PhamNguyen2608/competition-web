import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase.config';

export class PredictionService {
  static async savePrediction(userId: string, predictedCount: number) {
    try {
      // Kiểm tra xem đã dự đoán chưa
      const predictionDoc = await getDoc(doc(db, 'predictions', userId));
      if (predictionDoc.exists()) {
        return false; // Đã dự đoán rồi
      }

      await setDoc(doc(db, 'predictions', userId), {
        userId,
        predictedCount,
        submittedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error saving prediction:', error);
      return false;
    }
  }

  static async hasPredicted(userId: string): Promise<boolean> {
    try {
      const predictionDoc = await getDoc(doc(db, 'predictions', userId));
      return predictionDoc.exists();
    } catch (error) {
      console.error('Error checking prediction:', error);
      return false;
    }
  }
}