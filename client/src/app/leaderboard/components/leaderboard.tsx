"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'

type LeaderboardEntry = {
  rank: number
  name: string
  playTime: string
}

const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, name: "Arjun MelodyMaster", playTime: "320:45:12" },
    { rank: 2, name: "Sita RhythmRider", playTime: "305:30:45" },
    { rank: 3, name: "Vikram BeatBoss", playTime: "299:15:30" },
    { rank: 4, name: "Anjali TuneTitan", playTime: "285:20:10" },
    { rank: 5, name: "Rohit SongSage", playTime: "270:55:40" },
    { rank: 6, name: "Priya GrooveMaster", playTime: "265:10:20" },
    { rank: 7, name: "Karan HarmonyHero", playTime: "250:30:15" },
    { rank: 8, name: "Neha LyricLegend", playTime: "245:45:50" },
    { rank: 9, name: "Akshay ChordChampion", playTime: "240:20:30" },
    { rank: 10, name: "Riya SoloStar", playTime: "235:05:25" },
    { rank: 11, name: "Manoj TuneMaster", playTime: "230:45:10" },
    { rank: 12, name: "Sneha BeatBlender", playTime: "225:30:40" },
    { rank: 13, name: "Raj RhythmKing", playTime: "220:15:25" },
    { rank: 14, name: "Pooja HarmonySeeker", playTime: "215:50:20" },
    { rank: 15, name: "Ankit GrooveWarrior", playTime: "210:25:15" },
    { rank: 16, name: "Meera MelodyQueen", playTime: "205:30:45" },
    { rank: 17, name: "Amit ChordWizard", playTime: "200:40:10" },
    { rank: 18, name: "Isha LyricGuru", playTime: "195:15:35" },
    { rank: 19, name: "Ravi SoloVirtuoso", playTime: "190:20:25" },
    { rank: 20, name: "Deepa BeatExplorer", playTime: "185:10:50" },
    { rank: 21, name: "Ramesh TuneCrafter", playTime: "180:25:35" },
    { rank: 22, name: "Divya MelodyChampion", playTime: "175:40:30" },
    { rank: 23, name: "Shyam RhythmSage", playTime: "170:15:45" },
    { rank: 24, name: "Naina HarmonyQueen", playTime: "165:55:20" },
    { rank: 25, name: "Rahul GrooveMaster", playTime: "160:35:15" },
    { rank: 26, name: "Kavita LyricChampion", playTime: "155:20:25" },
    { rank: 27, name: "Yash BeatRider", playTime: "150:45:40" },
    { rank: 28, name: "Geeta SoloExplorer", playTime: "145:50:10" },
    { rank: 29, name: "Santosh TuneHunter", playTime: "140:30:25" },
    { rank: 30, name: "Pallavi RhythmVirtuoso", playTime: "135:25:35" },
  ];
  

export default function Leaderboard() {
  const [data, setData] = useState<LeaderboardEntry[]>(leaderboardData)

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
                  <td className="px-6 py-4 text-gray-100">{entry.name}</td>
                  <td className="px-6 py-4 text-gray-300 font-mono">{entry.playTime}</td>
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
              <span className="text-xl font-semibold text-gray-100">{entry.name}</span>
            </div>
            <div className="mt-3 text-right text-gray-300 font-mono">{entry.playTime}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}