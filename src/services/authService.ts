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
import { doc, setDoc, getDoc,collection, query, where, getDocs, writeBatch, Timestamp } from "firebase/firestore";
import { auth, db } from '../config/firebase.config';
import { AppUser, RegisterPayload } from '@/types/auth';
import { LOCATION_CONSTANTS } from '../lib/constants';

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
      
      let errorMessage = "Lỗi đăng nhập không xác định";
      
      // Phân biệt các loại lỗi
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "Tài khoản chưa được đăng ký";
          break;
        case "auth/wrong-password":
          errorMessage = "Sai thông tin đăng nhập";
          break;
        case "auth/invalid-email":
        case "auth/invalid-credential":
          errorMessage = "Sai thông tin đăng nhập";
          break;
      }
      
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

      // Create user document in Firestore with fixed location
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        phoneNumber: data.phoneNumber,
        displayName: data.name,
        birthYear: data.birthYear,
        gender: data.gender,
        province: LOCATION_CONSTANTS.PROVINCE.name,
        district: LOCATION_CONSTANTS.DISTRICT.name,
        ward: LOCATION_CONSTANTS.WARD.name,
        tieuKhu: data.tieuKhu,
        role: 'user',
        createdAt: Timestamp.now()
      });

      // Update profile
      await updateProfile(userCredential.user, {
        displayName: data.name
      });

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