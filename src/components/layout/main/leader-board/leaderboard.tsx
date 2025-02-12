
import type React from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import type { LeaderboardProps } from "./types"

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries = [] }) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-sm text-gray-500 border-b">
              <th className="px-6 py-3 text-left">POSITION</th>
              <th className="px-6 py-3 text-left">PLAYER</th>
              <th className="px-6 py-3 text-right">REWARD</th>
              <th className="px-6 py-3 text-right">POINTS</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr
                key={entry.position}
                className={`
                  hover:bg-gray-50 transition-colors
                  ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                `}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{entry.position}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={entry.player.avatar || "/placeholder.svg"}
                      alt={`${entry.player.name}'s avatar`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{entry.player.name}</span>
                      <span className="text-sm text-gray-500">{entry.player.timestamp}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {entry.reward.trend === "up" ? (
                      <ChevronUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-gray-900">+{entry.reward.value.toLocaleString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-[#38BDF8]">{entry.points.toLocaleString()} pt</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 