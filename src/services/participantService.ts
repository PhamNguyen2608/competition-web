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

// Thêm export cho interface
export interface LeaderboardParticipant {
  userId: string;
  name: string;
  score: number;
  completedAt: Timestamp;
  attemptCount: number;
}

export const ParticipantService = {
  async addParticipant(data: Omit<Participant, 'completedAt' | 'isFirstAttempt'>) {
    try {
      // Kiểm tra số lần thi từ exam_results
      const examResults = await ExamResultService.getUserResults();
      
      // Nếu đã thi quá 3 lần, không cho thêm participant mới
      if (examResults.length > 3) {
        console.warn('Đã vượt quá giới hạn số lần thi, không thêm participant mới');
        return false;
      }

      const isFirstAttempt = examResults.length === 1;

      const participantData = {
        ...data,
        completedAt: Timestamp.now(),
        isFirstAttempt
      }

      await addDoc(collection(db, 'participants'), participantData)
      return true;
    } catch (error) {
      console.error('Error adding participant:', error)
      return false;
    }
  },

  async getTotalParticipants() {
    try {
      const q = query(
        collection(db, 'exam_results'),
        where('attemptCount', '==', 1) // Chỉ đếm người thi lần đầu
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting total participants:', error);
      return 0;
    }
  },

  async getParticipantsBySubDistrict() {
    try {
      // Khởi tạo object thống kê cho mỗi tiểu khu
      const subDistrictStats = TIEU_KHU.reduce((acc, tk) => {
        acc[tk.code] = 0;
        return acc;
      }, {} as Record<string, number>);

      // Lấy tất cả kết quả thi lần đầu
      const q = query(
        collection(db, 'exam_results'),
        where('attemptCount', '==', 1) // Chỉ đếm lần thi đầu tiên
      );
      const snapshot = await getDocs(q);

      // Đếm số người tham gia cho mỗi tiểu khu
      await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          const userDocRef = doc(db, "users", data.userId);
          const userDocSnapshot = await getDoc(userDocRef);
          
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data() as UserData;
            if (userData.tieuKhu) {
              subDistrictStats[userData.tieuKhu] = 
                (subDistrictStats[userData.tieuKhu] || 0) + 1;
            }
          }
        })
      );

      // Chuyển đổi thành mảng và sắp xếp theo số người tham gia giảm dần
      const sortedStats = Object.entries(subDistrictStats)
        .sort(([, a], [, b]) => b - a)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, number>);

      return sortedStats;
    } catch (error) {
      console.error('Error getting participants by sub-district:', error);
      return {};
    }
  },

  async getLeaderboard() {
    try {
      const uniqueUsers = new Map<string, LeaderboardParticipant>();
      
      // Lấy tất cả kết quả thi
      const q = query(
        collection(db, 'exam_results'),
        where('attemptCount', '<=', 3) // Chỉ lấy 3 lần thi đầu tiên
      );
      
      const snapshot = await getDocs(q);
      console.log('Total exam results:', snapshot.size);

      if (snapshot.empty) {
        console.log('No exam results found in collection');
        return [];
      }

      // Duyệt qua các kết quả
      for (const docSnapshot of snapshot.docs) {
        const data = docSnapshot.data();
        const userId = data.userId;
        
        // Lấy thông tin user
        const userDocRef = doc(db, "users", userId);
        const userDocSnapshot = await getDoc(userDocRef);
        
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data() as UserData;
          
          // Kiểm tra và cập nhật điểm cao nhất
          const existingResult = uniqueUsers.get(userId);
          if (!existingResult || 
              data.score > existingResult.score || 
              (data.score === existingResult.score && 
               data.completedAt.toMillis() < existingResult.completedAt.toMillis())) {
            uniqueUsers.set(userId, {
              userId,
              name: userData.displayName || 'Anonymous',
              score: data.score,
              completedAt: data.completedAt,
              attemptCount: data.attemptCount
            });
          }
        }
      }

      // Chuyển đổi Map thành mảng và sắp xếp
      const leaderboard = Array.from(uniqueUsers.values())
        .sort((a, b) => {
          // Sắp xếp theo điểm từ cao xuống thấp
          if (b.score !== a.score) return b.score - a.score;
          // Nếu điểm bằng nhau, sắp xếp theo thời gian hoàn thành sớm hơn
          return a.completedAt.toMillis() - b.completedAt.toMillis();
        });

      return leaderboard;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }
}

