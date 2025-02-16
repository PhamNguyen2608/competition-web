import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  updateProfile,
  fetchSignInMethodsForEmail,
  deleteUser,
  getAuth,
} from "firebase/auth";
import { doc, setDoc, getDoc,collection, query, where, getDocs, writeBatch } from "firebase/firestore";
import { auth, db } from '../config/firebase.config';
import { AppUser, RegisterPayload } from '@/types/auth';

interface LoginResult {
  success: boolean;
  user?: AppUser;
  message?: string;
}

class AuthService {
  public async firebaseUserToUser(firebaseUser: FirebaseUser): Promise<AppUser> {
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
    
    if (!userDoc.exists()) {
      await this.logout();
      throw new Error('Tài khoản không tồn tại trong hệ thống');
    }
    
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      phoneNumber: firebaseUser.phoneNumber,
      displayName: firebaseUser.displayName || '',
      emailVerified: firebaseUser.emailVerified,
      role: userDoc.data()?.role || 'user',
      providerId: firebaseUser.providerId
    };
  }

  async login(phoneNumber: string, password: string): Promise<LoginResult> {
    try {
      const email = `${phoneNumber}@gmail.com`;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Lấy document của user trong Firestore
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      // Nếu không tìm thấy document, đăng xuất và báo lỗi
      if (!userDoc.exists()) {
        await this.logout();
        return { 
          success: false, 
          message: "Tài khoản không tồn tại trong hệ thống" 
        };
      }
      
      // Lấy token mới và lưu vào localStorage
      const token = await firebaseUser.getIdToken();
      localStorage.setItem('auth_token', token);
      
      const appUser = await this.firebaseUserToUser(firebaseUser);
      return { success: true, user: appUser };
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Xác định thông báo lỗi phù hợp dựa trên mã lỗi Firebase
      let errorMessage = "Lỗi đăng nhập không xác định";
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Số điện thoại hoặc mật khẩu không đúng";
      }
      
      // Xóa trạng thái auth (nếu có) để đảm bảo không giữ lại thông tin không hợp lệ
      await this.logout();
      
      return { success: false, message: errorMessage };
    }
  }
  

  async logout(): Promise<void> {
    await signOut(auth);
    localStorage.removeItem('auth_token'); // Xóa token khi logout
  }

  async getCurrentUser(): Promise<AppUser | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    
    return this.firebaseUserToUser(currentUser);
  }

  async register(data: RegisterPayload): Promise<void> {
    try {
      const email = `${data.phoneNumber}@gmail.com`;
      
      // Check if email exists
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        throw new Error('Số điện thoại này đã được đăng ký');
      }

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        data.password
      );

      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        phoneNumber: data.phoneNumber,
        displayName: data.name,
        role: 'user',
        createdAt: new Date().toISOString()
      });

      // Update profile
      await updateProfile(userCredential.user, {
        displayName: data.name
      });

      // Immediately sign out and clear any auth state
      await this.logout();
      localStorage.removeItem('auth_token');
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  public async validateUserInDatabase(uid: string): Promise<boolean> {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      return userDoc.exists();
    } catch (error) {
      console.error('Error validating user:', error);
      return false;
    }
  }

  public async fullDeleteUser(uid: string): Promise<void> {
    // Xóa trong Authentication
    await deleteUser(await getAuth().currentUser!);
    
    // Xóa trong Firestore
    const batch = writeBatch(db);
    batch.delete(doc(db, "users", uid));
    await batch.commit();
  }
}

export default new AuthService(); 