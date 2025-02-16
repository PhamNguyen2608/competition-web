import { FirebaseService } from "../services/firebase/FirebaseService";

const firebaseService = FirebaseService.getInstance();

export const app = firebaseService.getApp();
export const auth = firebaseService.getAuth();
export const db = firebaseService.getFirestore(); 