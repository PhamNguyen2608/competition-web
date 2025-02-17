import { Card } from "../../../ui/card"
import { Leaderboard } from "./leaderboard"
import type { LeaderboardEntry } from "./types"
import { useAppSelector } from '../../../../store/hooks';
import { Timestamp } from 'firebase/firestore';

export function LeaderboardCard() {
  const { user } = useAppSelector((state) => state.auth);
  
  // Check if user is not admin, return null or message
  if (!user || user.role !== 'admin') {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-bold text-red-800 mb-4 font-display">BẢNG XẾP HẠNG</h2>
        <div className="text-center text-gray-500">
          Bạn không có quyền xem bảng xếp hạng
        </div>
      </Card>
    );
  }

  // Mock data - should be moved to a separate file or fetched from API
  const leaderboardData: LeaderboardEntry[] = [
    {
      position: 1,
      player: {
        name: "Lawrence S. Sanders",
        avatar: "/placeholder.svg?height=32&width=32",
        timestamp: Timestamp.fromDate(new Date("2024-01-23")),
      },
      reward: {
        value: 150000,
        trend: "up" as const,
      },
      points: 20284,
    },
    {
      position: 2,
      player: {
        name: "Carol Simpson",
        avatar: "/placeholder.svg?height=32&width=32",
        timestamp: Timestamp.fromDate(new Date("2024-01-23")),
      },
      reward: {
        value: 150000,
        trend: "up" as const,
      },
      points: 14233,
    },
    {
      position: 3,
      player: {
        name: "Teresa Torres",
        avatar: "/placeholder.svg?height=32&width=32",
        timestamp: Timestamp.fromDate(new Date("2024-01-23")),
      },
      reward: {
        value: 145000,
        trend: "up" as const,
      },
      points: 13300,
    },
    {
      position: 4,
      player: {
        name: "Heather McDonald",
        avatar: "/placeholder.svg?height=32&width=32",
        timestamp: Timestamp.fromDate(new Date("2024-01-23")),
      },
      reward: {
        value: 145000,
        trend: "down" as const,
      },
      points: 12532,
    },
    {
      position: 5,
      player: {
        name: "Aaron Ortiz",
        avatar: "/placeholder.svg?height=32&width=32",
        timestamp: Timestamp.fromDate(new Date("2024-01-23")),
      },
      reward: {
        value: 75,
        trend: "up" as const,
      },
      points: 11045,
    },
  ].map(entry => ({
    ...entry,
    player: {
      ...entry.player,
      avatar: `/placeholder.svg?height=32&width=32&seed=${entry.player.name}`,
      timestamp: entry.player.timestamp.toDate().toISOString(),
    }
  }));

  if (!leaderboardData?.length) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-bold text-red-800 mb-4 font-display">BẢNG XẾP HẠNG</h2>
        <div className="text-center text-gray-500">Chưa có dữ liệu bảng xếp hạng</div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-red-800 mb-4 font-display">BẢNG XẾP HẠNG</h2>
      <Leaderboard entries={leaderboardData} />
    </Card>
  );
}

