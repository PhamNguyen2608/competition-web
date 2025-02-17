import { collection, addDoc, getDocs, query, where, Timestamp, orderBy, limit, getDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase.config';
import { TIEU_KHU } from '../lib/constants';
import { ExamResultService } from './examResultService';

interface Participant {
  userId: string
  name: string
  score: number
  completedAt: Timestamp
  attemptCount: number
  isFirstAttempt: boolean
  subDistrict: string
}

// Thêm interface để định nghĩa kiểu dữ liệu user
interface UserData {
  uid: string;
  phoneNumber: string;
  displayName: string;
  birthYear?: string;
  gender?: string;
  province: string;
  district: string;
  tieuKhu: string;
  role: string;
  createdAt: Timestamp;
}

export const ParticipantService = {
  async addParticipant(data: Omit<Participant, 'completedAt' | 'isFirstAttempt'>) {
    try {
      // Kiểm tra xem người dùng đã có kết quả thi trước đó chưa
      const examResults = await ExamResultService.getUserResults();
      const isFirstAttempt = examResults.length === 1; // Chỉ là lần đầu nếu đây là kết quả đầu tiên

      const participantData = {
        ...data,
        completedAt: Timestamp.now(),
        isFirstAttempt
      }

      await addDoc(collection(db, 'participants'), participantData)
      return true
    } catch (error) {
      console.error('Error adding participant:', error)
      return false
    }
  },

  async getTotalParticipants() {
    try {
      const uniqueUsers = new Set()
      const q = query(
        collection(db, 'exam_results')
      )
      const snapshot = await getDocs(q)
      
      snapshot.forEach((doc) => {
        const data = doc.data()
        if (data.attemptCount === 1) { // Chỉ đếm lần thi đầu tiên
          uniqueUsers.add(data.userId)
        }
      })

      return uniqueUsers.size
    } catch (error) {
      console.error('Error getting total participants:', error)
      return 0
    }
  },

  async getParticipantsBySubDistrict() {
    try {
      // Khởi tạo map với tất cả tiểu khu từ constants
      const subDistrictStats = new Map(
        TIEU_KHU.map(tk => [tk.code, 0])
      );

      // Lấy tất cả kết quả thi
      const q = query(collection(db, 'exam_results'));
      const snapshot = await getDocs(q);
      
      // Map để theo dõi người dùng đã được đếm
      const countedUsers = new Set<string>();
      
      // Sử dụng Promise.all để đợi tất cả các promises hoàn thành
      await Promise.all(
        snapshot.docs.map(async (examDoc) => {
          const data = examDoc.data();
          // Chỉ đếm lần thi đầu tiên của mỗi người
          if (data.attemptCount === 1 && !countedUsers.has(data.userId)) {
            countedUsers.add(data.userId);
            
            // Lấy thông tin người dùng từ collection users
            const userDoc = await getDoc(doc(db, "users", data.userId));
            if (userDoc.exists()) {
              const userData = userDoc.data() as UserData;
              if (userData.tieuKhu) {
                subDistrictStats.set(
                  userData.tieuKhu,
                  (subDistrictStats.get(userData.tieuKhu) || 0) + 1
                );
              }
            }
          }
        })
      );

      // Chuyển map thành array và sort
      const sortedStats = Array.from(subDistrictStats.entries())
        .sort((a, b) => b[1] - a[1]);

      return Object.fromEntries(sortedStats);
    } catch (error) {
      console.error('Error getting participants by sub-district:', error);
      return {};
    }
  }
}
