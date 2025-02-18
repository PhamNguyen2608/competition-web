// ./types.ts

import { Timestamp } from 'firebase/firestore';

export interface Player {
  name: string
  avatar?: string
  timestamp: string
}

export interface LeaderboardEntry {
  position: number
  player: {
    name: string
    avatar: string
    timestamp: string
  }
  points: number
}

export interface LeaderboardProps {
  entries?: LeaderboardEntry[]
}
