import { redirect } from 'react-router-dom';
import { auth, db } from '../config/firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import AuthService  from '../services/authService';

  export const protectedLoader = async () => {
  try {
    // Đợi auth state được khởi tạo
    const authState = await new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, 
        async (user) => {
          unsubscribe();
          if (user) {
            // Kiểm tra user trong Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists()) {
              // Nếu user không tồn tại, logout và redirect
              await AuthService.logout();
              reject(new Error('User not found in database'));
            } else {
              resolve(user);
            }
          } else {
            reject(new Error('Not authenticated'));
          }
        },
        (error) => {
          unsubscribe();
          reject(error);
        }
      );

      // Timeout sau 5 giây
      setTimeout(() => {
        unsubscribe();
        reject(new Error('Auth timeout'));
      }, 5000);
    });

    return authState;

  } catch (error) {
    console.error('Protected route error:', error);
    throw redirect('/login');
  }
};
