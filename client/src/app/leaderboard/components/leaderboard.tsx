"use client"
import { use, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
type LeaderboardEntry = {
  rank: number
  fullName: string
  totalPlayingTime: number
}

export default function Leaderboard() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const fetchLeaderBoardData = async () => {
    try {
      const response = await fetch("/api/leaderboard-rank");
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }
      const responseData = await response.json();
      setData(responseData.leaderboard)
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchLeaderBoardData();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 sm:p-8">
      <motion.h1 
        className="text-4xl sm:text-2xl font-extrabold text-center mb-8 text-gray-100"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🎵 Top Devs, Top Beats - The Musical Leaderboard🏆
      </motion.h1>
      <motion.div
        className="max-w-2xl mx-auto mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-gray-800 bg-opacity-40 rounded-lg p-4 backdrop-blur-sm border border-gray-700">
          <p className="text-gray-300 text-sm">
            <span className="text-purple-400 font-semibold">⏱️ How Playtime is Calculated:</span>
            <br />
            Only fully completed song plays are counted toward your total time.
            Partial plays or skips won't contribute to your leaderboard standing.
          </p>
        </div>
      </motion.div>
      {/* Table for larger screens */}
      <div className="hidden md:block">
        <div className="bg-gray-800 bg-opacity-50 rounded-lg shadow-xl overflow-hidden backdrop-blur-sm">
          <table className="w-full">
            <thead className="bg-gray-900 bg-opacity-60">
              <tr>
                <th className="px-6 py-4 text-left text-gray-100 font-semibold">Rank</th>
                <th className="px-6 py-4 text-left text-gray-100 font-semibold">Name</th>
                <th className="px-6 py-4 text-left text-gray-100 font-semibold">Total Play Time</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, index) => (
                <motion.tr 
                  key={entry.rank}
                  className="border-b border-gray-700 hover:bg-gray-700 hover:bg-opacity-40 transition-colors"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                      entry.rank <= 3 ? 'bg-purple-900 text-purple-100' : 'bg-gray-800 text-gray-300'
                    }`}>
                      {entry.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-100">{entry.fullName}</td>
                  <td className="px-6 py-4 text-gray-300 font-mono">{entry.totalPlayingTime}(Mints)</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards for smaller screens */}
      <div className="md:hidden space-y-4">
        {data.map((entry, index) => (
          <motion.div 
            key={entry.rank}
            className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-sm"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex justify-between items-center">
              <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
                entry.rank <= 3 ? 'bg-purple-900 text-purple-100' : 'bg-gray-900 text-gray-300'
              } text-xl font-bold`}>
                {entry.rank}
              </span>
              <span className="text-xl font-semibold text-gray-100">{entry.fullName}</span>
            </div>
            <div className="mt-3 text-right text-gray-300 font-mono">{entry.totalPlayingTime}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}