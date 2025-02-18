import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase.config';

export async function updateQuestionsVersion() {
  try {
    await setDoc(doc(db, 'questions', 'metadata'), {
      version: Date.now()
    });
    return true;
  } catch (error) {
    console.error('Error updating questions version:', error);
    return false;
  }
} 