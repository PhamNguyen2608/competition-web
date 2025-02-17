// ./types.ts

import { Timestamp } from 'firebase/firestore';

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
  player: {
    name: string
    avatar: string
    timestamp: string
  }
  reward: Reward
  points: number
}

export interface LeaderboardProps {
  entries?: LeaderboardEntry[]
}
