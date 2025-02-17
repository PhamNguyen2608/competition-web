import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { Leaderboard } from "../../../components/layout/main/leader-board/leaderboard"
import { useAppSelector } from "../../../store/hooks"
import { LeaderboardEntry } from "../../../components/layout/main/leader-board/types"
import { ParticipantService } from "../../../services/participantService"
import "./leaderBoard.css"
import { TIEU_KHU } from "../../../lib/constants"

export default function LeaderboardPage() {
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)
  const [totalParticipants, setTotalParticipants] = useState(0)
  const [subDistrictStats, setSubDistrictStats] = useState<Record<string, number>>({})

  useEffect(() => {
    let isMounted = true

    const fetchTotalParticipants = async () => {
      try {
        const total = await ParticipantService.getTotalParticipants()
        if (isMounted) {
          setTotalParticipants(total)
        }
      } catch (error) {
        console.error('Error fetching total participants:', error)
      }
    }

    const fetchStats = async () => {
      const stats = await ParticipantService.getParticipantsBySubDistrict()
      setSubDistrictStats(stats)
    }

    fetchTotalParticipants()
    fetchStats()
    
    // Cleanup function
    return () => {
      isMounted = false
    }
  }, []) // Có thể thêm dependencies nếu cần refresh data

  const leaderboardData: LeaderboardEntry[] = [
    {
      position: 1,
      player: {
        name: "Nguyễn Văn A",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
        timestamp: "2024-03-15T10:30:00Z"
      },
      reward: {
        value: 5000000,
        trend: "up"
      },
      points: 20284
    },
    {
      position: 2,
      player: {
        name: "Trần Thị B",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
        timestamp: "2024-03-15T09:45:00Z"
      },
      reward: {
        value: 3000000,
        trend: "up"
      },
      points: 19950
    },
    {
      position: 3,
      player: {
        name: "Lê Văn C",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
        timestamp: "2024-03-15T11:20:00Z"
      },
      reward: {
        value: 2000000,
        trend: "down"
      },
      points: 19800
    },
    {
      position: 4,
      player: {
        name: "Phạm Thị D",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
        timestamp: "2024-03-15T08:15:00Z"
      },
      reward: {
        value: 1000000,
        trend: "down"
      },
      points: 19600
    },
    {
      position: 5,
      player: {
        name: "Hoàng Văn E",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
        timestamp: "2024-03-15T12:00:00Z"
      },
      reward: {
        value: 500000,
        trend: "down"
      },
      points: 19400
    }
  ]

  // Nếu không phải admin, redirect về trang chủ
  if (!user || user.role !== 'admin') {
    navigate('/')
    return null
  }

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
              <p className="text-2xl md:text-3xl font-bold">20,284</p>
            </div>
            <div className="text-center text-white p-3 md:p-4">
              <p className="text-base md:text-lg opacity-90">Tổng giải thưởng</p>
              <p className="text-2xl md:text-3xl font-bold">5,000,000đ</p>
            </div>
          </div>

          {/* Leaderboard Section - Thêm padding nhỏ hơn trên mobile */}
          <div className="p-3 md:p-6">
            <Leaderboard entries={leaderboardData} />
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
                  .slice(0, 3)
                  .map(([district, count], index) => {
                    const tieuKhuInfo = TIEU_KHU.find(tk => tk.code === district || tk.name === district);
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

              {/* Scrollable List */}
              <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {Object.entries(subDistrictStats)
                  .filter(([, count]) => count >= 0)
                  .slice(3)
                  .map(([district, count], index) => {
                    const tieuKhuInfo = TIEU_KHU.find(tk => tk.code === district);
                    const displayName = tieuKhuInfo ? tieuKhuInfo.name : district;
                    
                    return (
                      <div 
                        key={district}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {index + 4}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{displayName}</h4>
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