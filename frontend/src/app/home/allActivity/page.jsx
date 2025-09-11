"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Flame, 
  TrendingUp, 
  Filter,
  Search,
  Activity as ActivityIcon,
  BarChart3,
  Plus,
  RefreshCw
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Activity type configurations with icons and colors
const ACTIVITY_CONFIG = {
  RUNNING: { 
    icon: "🏃‍♂️", 
    color: "from-red-500 to-orange-500", 
    bgColor: "bg-red-500/20",
    name: "Running"
  },
  WALKING: { 
    icon: "🚶‍♂️", 
    color: "from-green-500 to-teal-500", 
    bgColor: "bg-green-500/20",
    name: "Walking"
  },
  CYCLING: { 
    icon: "🚴‍♂️", 
    color: "from-blue-500 to-cyan-500", 
    bgColor: "bg-blue-500/20",
    name: "Cycling"
  },
  SWIMMING: { 
    icon: "🏊‍♂️", 
    color: "from-cyan-500 to-blue-500", 
    bgColor: "bg-cyan-500/20",
    name: "Swimming"
  },
  WEIGHT_TRAINING: { 
    icon: "🏋️‍♂️", 
    color: "from-red-600 to-red-500", 
    bgColor: "bg-red-600/20",
    name: "Weight Training"
  },
  YOGA: { 
    icon: "🧘‍♀️", 
    color: "from-purple-500 to-pink-500", 
    bgColor: "bg-purple-500/20",
    name: "Yoga"
  },
  HIIT: { 
    icon: "💪", 
    color: "from-red-500 to-red-600", 
    bgColor: "bg-red-500/20",
    name: "HIIT"
  },
  CARDIO: { 
    icon: "❤️", 
    color: "from-pink-500 to-red-500", 
    bgColor: "bg-pink-500/20",
    name: "Cardio"
  },
  STRETCHING: { 
    icon: "🤸‍♂️", 
    color: "from-indigo-500 to-purple-500", 
    bgColor: "bg-indigo-500/20",
    name: "Stretching"
  },
  OTHER: { 
    icon: "⚡", 
    color: "from-gray-500 to-gray-600", 
    bgColor: "bg-gray-500/20",
    name: "Other"
  },
};

function Page() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [sortBy, setSortBy] = useState("date");
  const router = useRouter();

  // Calculate summary stats
  const stats = React.useMemo(() => {
    if (activities.length === 0) return { total: 0, calories: 0, duration: 0, avgCalories: 0 };
    
    const totalCalories = activities.reduce((sum, activity) => sum + (activity.caloriesBurned || 0), 0);
    const totalDuration = activities.reduce((sum, activity) => sum + (activity.duration || 0), 0);
    
    return {
      total: activities.length,
      calories: totalCalories,
      duration: totalDuration,
      avgCalories: Math.round(totalCalories / activities.length)
    };
  }, [activities]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        
        if (!backendUrl) {
          throw new Error("Backend URL not configured");
        }

        const response = await axios.get(`${backendUrl}/api/activities`, {
          withCredentials: true,
          timeout: 10000,
        });

        console.log("Fetched activities:", response.data);
        const activitiesData = response.data || [];
        setActivities(activitiesData);
        setFilteredActivities(activitiesData);

      } catch (error) {
        console.error("Error fetching activities:", error);
        toast.error("Failed to load activities ❌", {
          className: "bg-gradient-to-r from-red-600 to-red-700 text-white",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...activities];

    // Filter by type
    if (filterType !== "ALL") {
      filtered = filtered.filter(activity => activity.type === filterType);
    }

    // Search functionality
    if (searchTerm.trim()) {
      filtered = filtered.filter(activity =>
        activity.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ACTIVITY_CONFIG[activity.type]?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort activities
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.startTime || b.createdAt) - new Date(a.startTime || a.createdAt);
        case "calories":
          return (b.caloriesBurned || 0) - (a.caloriesBurned || 0);
        case "duration":
          return (b.duration || 0) - (a.duration || 0);
        default:
          return 0;
      }
    });

    setFilteredActivities(filtered);
  }, [activities, searchTerm, filterType, sortBy]);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "";
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl mb-4 shadow-xl"
          >
            <ActivityIcon className="w-8 h-8 text-white" />
          </motion.div>
          <p className="text-white text-xl font-semibold">Loading your activities...</p>
          <p className="text-white/60 text-sm mt-2">Please wait a moment</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col space-y-4"
      >
        {/* Navigation and Title */}
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => router.push("/home")}
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Dashboard</span>
          </motion.button>

          <motion.button
            onClick={() => router.push("/home/addActivity")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 rounded-xl border border-red-500/30 hover:from-red-500 hover:to-red-400 transition-all duration-200 text-white font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Add Activity</span>
          </motion.button>
        </div>

        {/* Page Title */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-xl"
          >
            Your Fitness Journey
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-white/70 text-lg"
          >
            Track your progress and celebrate your achievements
          </motion.p>
        </div>
      </motion.div>

      {/* Stats Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: "Total Activities", value: stats.total, icon: <BarChart3 className="w-5 h-5" />, color: "text-blue-400" },
          { label: "Calories Burned", value: `${stats.calories.toLocaleString()}`, icon: <Flame className="w-5 h-5" />, color: "text-red-400" },
          { label: "Total Minutes", value: `${stats.duration.toLocaleString()}`, icon: <Clock className="w-5 h-5" />, color: "text-green-400" },
          { label: "Avg Calories", value: stats.avgCalories, icon: <TrendingUp className="w-5 h-5" />, color: "text-purple-400" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
            className="bg-black/25 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`${stat.color}`}>{stat.icon}</span>
              <span className="text-2xl font-bold text-white">{stat.value}</span>
            </div>
            <p className="text-white/60 text-sm font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
      >
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500/50 transition-all duration-300"
          />
        </div>

        {/* Filter by Type */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500/50 transition-all duration-300"
        >
          <option value="ALL" className="bg-gray-800">All Types</option>
          {Object.keys(ACTIVITY_CONFIG).map(type => (
            <option key={type} value={type} className="bg-gray-800">
              {ACTIVITY_CONFIG[type].name}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500/50 transition-all duration-300"
        >
          <option value="date" className="bg-gray-800">Latest First</option>
          <option value="calories" className="bg-gray-800">Most Calories</option>
          <option value="duration" className="bg-gray-800">Longest Duration</option>
        </select>
      </motion.div>

      {/* Activities List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {filteredActivities.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="text-center bg-black/25 backdrop-blur-sm rounded-3xl p-8 border border-white/10 max-w-md mx-auto">
                <div className="text-6xl mb-4">🏃‍♂️</div>
                <h3 className="text-white text-xl font-semibold mb-2">
                  {searchTerm || filterType !== "ALL" ? "No matching activities" : "No activities yet"}
                </h3>
                <p className="text-white/60 mb-6">
                  {searchTerm || filterType !== "ALL" 
                    ? "Try adjusting your search or filter" 
                    : "Start your fitness journey by adding your first activity"
                  }
                </p>
                <motion.button
                  onClick={() => router.push("/home/addActivity")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-xl text-white font-medium hover:from-red-500 hover:to-red-400 transition-all duration-200"
                >
                  Add Your First Activity
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="activities"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {filteredActivities.map((activity, index) => {
                const config = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.OTHER;
                
                return (
                  <motion.div
                    key={activity.id || index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.02,
                      y: -2,
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => activity.id && router.push(`/home/allActivity/${activity.id}`)}
                    className={`
                      cursor-pointer bg-black/25 backdrop-blur-sm rounded-2xl p-6 border border-white/10 
                      hover:border-white/30 hover:bg-black/30 transition-all duration-300 shadow-lg
                      ${activity.id ? 'hover:shadow-xl' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Activity Icon */}
                        <div className={`w-12 h-12 ${config.bgColor} rounded-xl flex items-center justify-center text-2xl`}>
                          {config.icon}
                        </div>

                        {/* Activity Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-xl font-bold text-white">
                              {config.name}
                            </h3>
                            {activity.duration && (
                              <span className="px-2 py-1 bg-white/20 rounded-full text-xs text-white/80">
                                {activity.duration}min
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-white/70 text-sm">
                            {activity.startTime && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(activity.startTime)}</span>
                                <span className="text-white/50">•</span>
                                <span>{formatTime(activity.startTime)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-red-400 font-semibold">
                            <Flame className="w-4 h-4" />
                            <span>{activity.caloriesBurned || 0}</span>
                          </div>
                          <p className="text-white/60 text-xs">calories</p>
                        </div>
                      </div>

                      {/* Arrow */}
                      {activity.id && (
                        <motion.div 
                          className="ml-4 text-white/40"
                          whileHover={{ scale: 1.2, x: 5 }}
                        >
                          <ArrowLeft className="w-5 h-5 rotate-180" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Enhancement */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
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
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute bottom-20 right-10 w-24 h-24 bg-red-400/15 rounded-full blur-xl"
        />
      </div>
    </div>
  );
}

export default Page;
