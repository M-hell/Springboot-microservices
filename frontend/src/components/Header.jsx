"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Settings, Menu, X, Home, Activity } from "lucide-react";
import useUserStore from "@/zustand/useProvider";
import { toast } from "react-toastify";

function Header() {
  const { firstName, lastName, clearUser } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Get motivational message based on time
  const getMotivationalMessage = () => {
    const hour = currentTime.getHours();
    if (hour < 6) return "Early bird catches the gains! 🌅";
    if (hour < 12) return "Perfect time to crush your goals! 💪";
    if (hour < 17) return "Keep the momentum going strong! ⚡";
    if (hour < 21) return "Evening workout session awaits! 🔥";
    return "Rest well, tomorrow's gains await! 🌙";
  };

  const handleLogout = () => {
    try {
      clearUser();
      toast.success("Logged out successfully! 👋", {
        className: "bg-gradient-to-r from-red-500 to-red-600 text-white",
      });
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const menuItems = [
    { icon: <Home className="w-4 h-4" />, label: "Dashboard", action: () => router.push("/home") },
    { icon: <Activity className="w-4 h-4" />, label: "Activities", action: () => router.push("/home/allActivity") },
    { icon: <Settings className="w-4 h-4" />, label: "Settings", action: () => toast.info("Settings coming soon!") },
    { icon: <LogOut className="w-4 h-4" />, label: "Logout", action: handleLogout, danger: true },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative bg-black/30 backdrop-blur-xl shadow-2xl border-b border-white/20 overflow-hidden"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10" />
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-2 left-10 w-2 h-2 bg-red-400/30 rounded-full"
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-4 right-20 w-1 h-1 bg-red-300/40 rounded-full"
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="relative z-10 px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Content */}
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <motion.div
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-xl">
                  Fitness<span className="text-red-400">Tracker</span>
                </h1>
                <p className="text-xs sm:text-sm text-white/60 font-medium">
                  AI-Powered Fitness Journey
                </p>
              </div>
            </motion.div>

            {/* User Menu - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {firstName && lastName && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-right mr-4"
                >
                  <p className="text-sm text-white/80">{getGreeting()},</p>
                  <p className="text-lg font-semibold text-white">
                    {firstName} {lastName}
                  </p>
                </motion.div>
              )}
              
              <motion.button
                onClick={toggleMenu}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                <User className="w-5 h-5 text-white" />
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={toggleMenu}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 90 }}
                    exit={{ rotate: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Welcome Message */}
          {firstName && lastName && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-4 md:hidden text-center"
            >
              <p className="text-white/90 text-lg">
                {getGreeting()}, <span className="font-semibold text-white">{firstName}!</span> 👋
              </p>
            </motion.div>
          )}

          {/* Motivational Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-3 text-center"
          >
            <p className="text-white/70 text-sm sm:text-base italic font-medium">
              {getMotivationalMessage()}
            </p>
          </motion.div>
        </div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-4 right-4 mt-2 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl z-50"
            >
              <div className="py-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    onClick={() => {
                      item.action();
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-white/10 transition-all duration-200 first:rounded-t-2xl last:rounded-b-2xl ${
                      item.danger
                        ? "text-red-300 hover:text-red-200 hover:bg-red-500/20"
                        : "text-white/90 hover:text-white"
                    }`}
                  >
                    <span className={item.danger ? "text-red-400" : "text-white/70"}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Close menu when clicking outside */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </motion.header>
  );
}

export default Header;
