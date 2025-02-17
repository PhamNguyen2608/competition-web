// ./Leaderboard.tsx

import React, { memo, useMemo } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import type { LeaderboardProps, LeaderboardEntry } from "./types"

interface LeaderboardRowProps {
  entry: LeaderboardEntry
  index: number
}

const LeaderboardRow = memo(({ entry, index }: LeaderboardRowProps) => {
  return (
    <div className={`flex items-center px-3 md:px-6 py-3 md:py-5 hover:bg-gray-50/80 transition-colors ${
      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
    }`}>
      <div className="w-[12%] md:w-[15%]">
        <div className="flex items-center">
          <span className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
            #{entry.position}
          </span>
        </div>
      </div>

      <div className="w-[43%] md:w-[40%]">
        <div className="flex items-center gap-2 md:gap-3">
          <img
            src={entry.player.avatar}
            alt={`${entry.player.name}'s avatar`}
            className="w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 truncate">
              {entry.player.name}
            </span>
            <span className="text-xs md:text-sm text-gray-500 hidden md:block">
              {entry.player.timestamp}
            </span>
          </div>
        </div>
      </div>

      <div className="w-[25%] text-right hidden md:block">
        <div className="flex items-center justify-end gap-1 md:gap-2">
          {entry.reward.trend === "up" ? (
            <ChevronUp className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-green-500" />
          ) : (
            <ChevronDown className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-red-500" />
          )}
          <span className="text-sm md:text-base lg:text-lg font-medium text-gray-900">
            +{entry.reward.value.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="w-[45%] md:w-[20%] text-right">
        <span className="text-sm md:text-base lg:text-lg font-bold text-[#38BDF8]">
          {entry.points.toLocaleString()} pt
        </span>
      </div>
    </div>
  )
})

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries = [] }) => {
  const rows = useMemo(
    () =>
      entries.map((entry, index) => (
        <LeaderboardRow key={entry.position} entry={entry} index={index} />
      )),
    [entries]
  )

  return (
    <div className="w-full">
      <div className="flex items-center px-6 py-4 bg-gray-50">
        <div className="w-[15%] font-semibold text-gray-700 hidden md:block">POSITION</div>
        <div className="w-[12%] font-semibold text-gray-700 md:hidden">#</div>
        <div className="w-[43%] md:w-[40%] font-semibold text-gray-700">PLAYER</div>
        <div className="w-[25%] text-right font-semibold text-gray-700 hidden md:block">REWARD</div>
        <div className="w-[45%] md:w-[20%] text-right font-semibold text-gray-700">POINTS</div>
      </div>
      <div>
        {rows}
      </div>
    </div>
  )
}
