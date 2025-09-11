"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Info, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import CreateActivity from "@/components/CreateActivity";

function Page() {
  const router = useRouter();

  return (
    <div className="h-full w-full flex flex-col">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-6 sm:mb-8"
      >
        {/* Back Button */}
        <motion.button
          onClick={() => router.push("/home")}
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Back to Dashboard</span>
        </motion.button>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="hidden md:flex items-center space-x-4"
        >
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
            <div className="text-white font-semibold text-sm">Today</div>
            <div className="text-white/60 text-xs">Add Activity</div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
            <Target className="w-4 h-4 text-red-400 mx-auto mb-1" />
            <div className="text-white/60 text-xs">Track Progress</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex-1 flex items-start justify-center"
      >
        <div className="w-full">
          <CreateActivity />
        </div>
      </motion.div>

      {/* Helpful Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8 bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-xl">
              <Info className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2">Quick Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/70">
              <div className="flex items-center space-x-2">
                <span className="text-red-400">💡</span>
                <span>Calories auto-adjust based on activity type</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">📊</span>
                <span>Metrics change dynamically per activity</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400">⚡</span>
                <span>Start time defaults to current time</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Background Enhancement */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            y: [0, 15, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-20 right-10 w-24 h-24 bg-red-400/15 rounded-full blur-xl"
        />
      </div>
    </div>
  );
}

export default Page;
