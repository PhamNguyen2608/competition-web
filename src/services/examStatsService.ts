import { collection, getDocs, query, where, Timestamp, getDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase.config';
import { TIEU_KHU } from '../lib/constants';

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

// Thêm interface để lưu thông tin thống kê tiểu khu
interface SubDistrictStat {
  code: string;
  count: number;
  firstParticipantTime: number;
}

interface PaginatedLeaderboard {
  data: LeaderboardParticipant[];
  total: number;
}

export const ExamStatsService = {
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
        acc[tk.code] = {
          code: tk.code,
          count: 0,
          firstParticipantTime: Number.MAX_SAFE_INTEGER
        };
        return acc;
      }, {} as Record<string, SubDistrictStat>);

      // Lấy tất cả kết quả thi lần đầu
      const q = query(
        collection(db, 'exam_results'),
        where('attemptCount', '==', 1)
      );
      const snapshot = await getDocs(q);

      // Đếm số người tham gia và lưu thời gian tham gia đầu tiên cho mỗi tiểu khu
      await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          const userDocRef = doc(db, "users", data.userId);
          const userDocSnapshot = await getDoc(userDocRef);
          
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data() as UserData;
            if (userData.tieuKhu) {
              const completedTime = data.completedAt.toMillis();
              subDistrictStats[userData.tieuKhu].count += 1;
              subDistrictStats[userData.tieuKhu].firstParticipantTime = 
                Math.min(subDistrictStats[userData.tieuKhu].firstParticipantTime, completedTime);
            }
          }
        })
      );

      // Chuyển đổi thành mảng và sắp xếp
      const sortedStats = Object.entries(subDistrictStats)
        .sort(([, a], [, b]) => {
          // So sánh số lượng người tham gia trước
          if (b.count !== a.count) return b.count - a.count;
          // Nếu bằng nhau, sắp xếp theo thời gian tham gia sớm nhất
          return a.firstParticipantTime - b.firstParticipantTime;
        })
        .reduce((acc, [key, value]) => {
          acc[key] = value.count;
          return acc;
        }, {} as Record<string, number>);

      return sortedStats;
    } catch (error) {
      console.error('Error getting participants by sub-district:', error);
      return {};
    }
  },

  async getLeaderboard(page: number = 1, limit: number = 10): Promise<PaginatedLeaderboard> {
    try {
      const uniqueUsers = new Map<string, LeaderboardParticipant>();
      
      // Lấy tất cả kết quả thi
      const q = query(
        collection(db, 'exam_results'),
        where('attemptCount', '<=', 3)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return { data: [], total: 0 };
      }

      // Process all results first
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

      // Convert to array and sort
      const allResults = Array.from(uniqueUsers.values())
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.completedAt.toMillis() - b.completedAt.toMillis();
        });

      // Calculate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return {
        data: allResults.slice(startIndex, endIndex),
        total: allResults.length
      };
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return { data: [], total: 0 };
    }
  }
}

