export interface Player {
  name: string
  avatar?: string
  timestamp: string
}

export interface Reward {
  value: number
  trend: "up" | "down"
}

export interface LeaderboardEntry {
  position: number
  player: Player
  reward: Reward
  points: number
}

export interface LeaderboardProps {
  entries?: LeaderboardEntry[]
} 