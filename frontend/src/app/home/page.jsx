"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Activity, List, Sparkles } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  const cards = [
    {
      title: "Add Activity",
      description: "Log your daily workout or activity",
      icon: <Activity className="w-10 h-10 text-blue-400" />,
      route: "/home/addActivity",
    },
    {
      title: "All Activities",
      description: "Track and review your progress",
      icon: <List className="w-10 h-10 text-green-400" />,
      route: "/home/allActivity",
    },
    {
      title: "Recommendations",
      description: "Get personalized fitness tips",
      icon: <Sparkles className="w-10 h-10 text-purple-400" />,
      route: "/home/recommendations",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-white mb-10">
        Welcome to Your Fitness Hub 💪
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.97 }}
            className="bg-gray-800 shadow-xl rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer border border-gray-700 hover:border-blue-500 transition-all"
            onClick={() => router.push(card.route)}
          >
            <div className="mb-4">{card.icon}</div>
            <h2 className="text-2xl font-semibold text-white">{card.title}</h2>
            <p className="text-gray-400 mt-2">{card.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
