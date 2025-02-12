import { Card } from "../../../ui/card"
import { Leaderboard } from "./leaderboard"
import type { LeaderboardEntry } from "./types"

export function LeaderboardCard() {
  // This would typically come from an API or props
  const leaderboardData: LeaderboardEntry[] | undefined =  [
    {
      position: 1,
      player: {
        name: "Lawrence S. Sanders",
        avatar: "/placeholder.svg?height=32&width=32",
        timestamp: "2024-1-23",
      },
      reward: {
        value: 150000,
        trend: "up",
      },
      points: 20284,
    },
    {
      position: 2,
      player: {
        name: "Carol Simpson",
        avatar: "/placeholder.svg?height=32&width=32",
        timestamp: "2024-1-23",
      },
      reward: {
        value: 150000,
        trend: "up",
      },
      points: 14233,
    },
    {
      position: 3,
      player: {
        name: "Teresa Torres",
        avatar: "/placeholder.svg?height=32&width=32",
        timestamp: "2024-1-23",
      },
      reward: {
        value: 145000,
        trend: "up",
      },
      points: 13300,
    },
    {
      position: 4,
      player: {
        name: "Heather McDonald",
        avatar: "/placeholder.svg?height=32&width=32",
        timestamp: "2024-1-23",
      },
      reward: {
        value: 145000,
        trend: "down",
      },
      points: 12532,
    },
    {
      position: 5,
      player: {
        name: "Aaron Ortiz",
        avatar: "/placeholder.svg?height=32&width=32",
        timestamp: "2024-1-23",
      },
      reward: {
        value: 75,
        trend: "up",
      },
      points: 11045,
    },
  ]

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-red-800 mb-4 font-display">BẢNG XẾP HẠNG</h2>
      {leaderboardData && leaderboardData.length > 0 ? (
        <Leaderboard entries={leaderboardData} />
      ) : (
        <div className="text-center text-gray-500">Chưa có dữ liệu bảng xếp hạng</div>
      )}
    </Card>
  )
}

