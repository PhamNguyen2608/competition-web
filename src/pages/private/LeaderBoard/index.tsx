import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { Leaderboard } from "../../../components/layout/main/leader-board/leaderboard"
import { useAppSelector } from "../../../store/hooks"
import { LeaderboardEntry } from "../../../components/layout/main/leader-board/types"
import { ExamStatsService } from "../../../services/examStatsService"
import "./leaderBoard.css"
import { TIEU_KHU } from "../../../lib/constants"
import { LeaderboardParticipant } from "../../../services/examStatsService"

export default function LeaderboardPage() {
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)
  const [totalParticipants, setTotalParticipants] = useState(0)
  const [subDistrictStats, setSubDistrictStats] = useState<Record<string, number>>({})
  const [leaderboard, setLeaderboard] = useState<LeaderboardParticipant[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    let isMounted = true

    const fetchTotalParticipants = async () => {
      try {
        const total = await ExamStatsService.getTotalParticipants()
        if (isMounted) {
          setTotalParticipants(total)
        }
      } catch (error) {
        console.error('Error fetching total participants:', error)
      }
    }

    const fetchStats = async () => {
      const stats = await ExamStatsService.getParticipantsBySubDistrict()
      setSubDistrictStats(stats)
    }

    const fetchLeaderboard = async () => {
      try {
        const { data, total } = await ExamStatsService.getLeaderboard(currentPage, ITEMS_PER_PAGE)
        if (isMounted) {
          setLeaderboard(data)
          setTotalPages(Math.ceil(total / ITEMS_PER_PAGE))
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      }
    }

    fetchTotalParticipants()
    fetchStats()
    fetchLeaderboard()
    
    // Cleanup function
    return () => {
      isMounted = false
    }
  }, [currentPage]) // Re-fetch when page changes

  const leaderboardData: LeaderboardEntry[] = leaderboard.map((item, index) => ({
    position: index + 1,
    player: {
      name: item.name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.userId}`,
      timestamp: item.completedAt.toDate().toISOString()
    },
    points: item.score,
    reward: {
      value: item.score >= 80 ? 5000000 : 
             item.score >= 60 ? 3000000 : 
             item.score >= 40 ? 1000000 : 0,
      trend: "up"
    }
  }));

  // Nếu không phải admin, redirect về trang chủ
  if (!user || user.role !== 'admin') {
    navigate('/')
    return null
  }

  // Add Pagination component
  const Pagination = () => (
    <div className="flex justify-center gap-2 mt-4">
      <button
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
      >
        Trước
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 rounded ${
            currentPage === page 
              ? 'bg-primary text-white' 
              : 'bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
      >
        Sau
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-primary py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-secondary-light transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Quay lại</span>
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Bảng Xếp Hạng Chi Tiết
          </h1>
          <div className="w-24"></div> {/* Spacer để căn giữa tiêu đề */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-4 md:py-8 px-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Stats Section - Thêm padding và giảm font size trên mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 p-4 md:p-6 bg-gradient-to-r from-primary-light to-primary">
            <div className="text-center text-white p-3 md:p-4">
              <p className="text-base md:text-lg opacity-90">Tổng số người tham gia</p>
              <p className="text-2xl md:text-3xl font-bold">{totalParticipants}</p>
            </div>
            <div className="text-center text-white p-3 md:p-4">
              <p className="text-base md:text-lg opacity-90">Điểm cao nhất</p>
              <p className="text-2xl md:text-3xl font-bold">
                {leaderboard.length > 0 ? leaderboard[0].score : 0}
              </p>
            </div>
            <div className="text-center text-white p-3 md:p-4">
              <p className="text-base md:text-lg opacity-90">Tổng giải thưởng</p>
              <p className="text-2xl md:text-3xl font-bold">5,000,000đ</p>
            </div>
          </div>

          {/* Leaderboard Section - Thêm padding nhỏ hơn trên mobile */}
          <div className="p-3 md:p-6">
            <Leaderboard entries={leaderboardData} />
            <Pagination />
          </div>

          <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold mb-4">
                Thống kê theo tiểu khu
              </h3>
              
              {/* Top 3 Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {Object.entries(subDistrictStats)
                  .filter(([, count]) => count > 0)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                  .map(([district, count], index) => {
                    const tieuKhuInfo = TIEU_KHU.find(tk => tk.code === district);
                    const displayName = tieuKhuInfo ? tieuKhuInfo.name : district;
                    const medals = ['🥇', '🥈', '🥉'];
                    
                    return (
                      <div 
                        key={district}
                        className={`p-4 rounded-lg ${
                          index === 0 
                            ? 'bg-yellow-50 border-2 border-yellow-200' 
                            : index === 1 
                              ? 'bg-gray-50 border-2 border-gray-200'
                              : 'bg-orange-50 border-2 border-orange-200'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">{medals[index]}</div>
                          <h4 className="font-medium text-gray-900 text-lg">{displayName}</h4>
                          <div className="text-3xl font-bold text-primary mt-2">{count}</div>
                          <p className="text-sm text-gray-500 mt-1">người tham gia</p>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Scrollable List - Hiển thị tất cả tiểu khu chưa có người tham gia */}
              <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {TIEU_KHU.map((tk, index) => {
                  const count = subDistrictStats[tk.code] || 0;
                  // Chỉ hiển thị những tiểu khu chưa có trong top 3
                  const isInTop3 = Object.entries(subDistrictStats)
                    .filter(([, count]) => count > 0)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .some(([district]) => district === tk.code);

                  if (isInTop3) return null;

                  return (
                    <div 
                      key={tk.code}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{tk.name}</h4>
                          <p className="text-sm text-gray-500">
                            {count} người tham gia
                          </p>
                        </div>
                      </div>
                      {count === 0 && (
                        <div className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">
                          Chưa có người tham gia
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 