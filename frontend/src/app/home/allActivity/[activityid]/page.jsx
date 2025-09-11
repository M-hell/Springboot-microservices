"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Flame, 
  TrendingUp, 
  BarChart3,
  Target,
  Zap,
  Shield,
  Lightbulb,
  Activity as ActivityIcon,
  Share2,
  Edit3,
  Award
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

// Activity type configurations
const ACTIVITY_CONFIG = {
  RUNNING: { 
    icon: "🏃‍♂️", 
    color: "from-red-500 to-orange-500", 
    bgColor: "bg-red-500/20",
    name: "Running",
    emoji: "🏃‍♂️"
  },
  WALKING: { 
    icon: "🚶‍♂️", 
    color: "from-green-500 to-teal-500", 
    bgColor: "bg-green-500/20",
    name: "Walking",
    emoji: "🚶‍♂️"
  },
  CYCLING: { 
    icon: "🚴‍♂️", 
    color: "from-blue-500 to-cyan-500", 
    bgColor: "bg-blue-500/20",
    name: "Cycling",
    emoji: "🚴‍♂️"
  },
  SWIMMING: { 
    icon: "🏊‍♂️", 
    color: "from-cyan-500 to-blue-500", 
    bgColor: "bg-cyan-500/20",
    name: "Swimming",
    emoji: "🏊‍♂️"
  },
  WEIGHT_TRAINING: { 
    icon: "🏋️‍♂️", 
    color: "from-red-600 to-red-500", 
    bgColor: "bg-red-600/20",
    name: "Weight Training",
    emoji: "🏋️‍♂️"
  },
  YOGA: { 
    icon: "🧘‍♀️", 
    color: "from-purple-500 to-pink-500", 
    bgColor: "bg-purple-500/20",
    name: "Yoga",
    emoji: "🧘‍♀️"
  },
  HIIT: { 
    icon: "💪", 
    color: "from-red-500 to-red-600", 
    bgColor: "bg-red-500/20",
    name: "HIIT",
    emoji: "💪"
  },
  CARDIO: { 
    icon: "❤️", 
    color: "from-pink-500 to-red-500", 
    bgColor: "bg-pink-500/20",
    name: "Cardio",
    emoji: "❤️"
  },
  STRETCHING: { 
    icon: "🤸‍♂️", 
    color: "from-indigo-500 to-purple-500", 
    bgColor: "bg-indigo-500/20",
    name: "Stretching",
    emoji: "🤸‍♂️"
  },
  OTHER: { 
    icon: "⚡", 
    color: "from-gray-500 to-gray-600", 
    bgColor: "bg-gray-500/20",
    name: "Other",
    emoji: "⚡"
  },
};

// Metric display configurations
const METRIC_LABELS = {
  distance: { label: "Distance", unit: "km", icon: <TrendingUp className="w-4 h-4" /> },
  averageSpeed: { label: "Avg Speed", unit: "km/h", icon: <Zap className="w-4 h-4" /> },
  maxHeartRate: { label: "Max Heart Rate", unit: "bpm", icon: <ActivityIcon className="w-4 h-4" /> }, // Fixed: Use ActivityIcon
  elevationGain: { label: "Elevation Gain", unit: "m", icon: <TrendingUp className="w-4 h-4" /> },
  laps: { label: "Laps", unit: "", icon: <Target className="w-4 h-4" /> },
  strokeRate: { label: "Stroke Rate", unit: "strokes/min", icon: <BarChart3 className="w-4 h-4" /> },
  sets: { label: "Sets", unit: "", icon: <Target className="w-4 h-4" /> },
  reps: { label: "Reps", unit: "", icon: <BarChart3 className="w-4 h-4" /> },
  weightPerRep: { label: "Weight per Rep", unit: "kg", icon: <Award className="w-4 h-4" /> },
  durationFocus: { label: "Focus Duration", unit: "min", icon: <Clock className="w-4 h-4" /> },
  calmnessScore: { label: "Calmness Score", unit: "/10", icon: <Target className="w-4 h-4" /> },
  rounds: { label: "Rounds", unit: "", icon: <Target className="w-4 h-4" /> },
  workIntervalSec: { label: "Work Interval", unit: "sec", icon: <Clock className="w-4 h-4" /> },
  restIntervalSec: { label: "Rest Interval", unit: "sec", icon: <Clock className="w-4 h-4" /> },
  flexibilityScore: { label: "Flexibility Score", unit: "/10", icon: <Target className="w-4 h-4" /> },
  targetAreas: { label: "Target Areas", unit: "", icon: <Target className="w-4 h-4" /> },
};

function ActivityDetailsPage() {
  const { activityid } = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendationLoading, setRecommendationLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        
        if (!backendUrl) {
          throw new Error("Backend URL not configured");
        }

        if (!activityid) {
          throw new Error("Activity ID not provided");
        }

        // Fetch activity details
        const activityRes = await axios.get(
          `${backendUrl}/api/activities/${activityid}`,
          { 
            withCredentials: true,
            timeout: 10000 
          }
        );
        
        if (!activityRes.data) {
          throw new Error("Activity not found");
        }
        
        setActivity(activityRes.data);

        // Fetch AI recommendation (non-blocking)
        setRecommendationLoading(true);
        try {
          const recRes = await axios.get(
            `${backendUrl}/api/recommendations/activity/${activityid}`,
            { 
              withCredentials: true,
              timeout: 15000 
            }
          );
          setRecommendation(recRes.data);
        } catch (recError) {
          console.warn("Could not fetch recommendations:", recError);
          // Don't show error toast for recommendations - it's optional
        } finally {
          setRecommendationLoading(false);
        }

      } catch (error) {
        console.error("Error fetching activity details:", error);
        toast.error("Failed to load activity details ❌", {
          className: "bg-gradient-to-r from-red-600 to-red-700 text-white",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activityid]);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
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

  const formatMetricValue = (key, value) => {
    const metric = METRIC_LABELS[key];
    if (!metric) return value;
    
    if (typeof value === 'number' && key !== 'targetAreas') {
      return `${value.toLocaleString()} ${metric.unit}`.trim();
    }
    return `${value} ${metric.unit}`.trim();
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
          <p className="text-white text-xl font-semibold">Loading activity details...</p>
          <p className="text-white/60 text-sm mt-2">Please wait a moment</p>
        </motion.div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-black/25 backdrop-blur-sm rounded-3xl p-8 border border-red-400/30 max-w-md mx-auto"
        >
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-red-300 text-2xl font-semibold mb-2">Activity Not Found</h2>
          <p className="text-white/60 mb-6">The activity you're looking for doesn't exist or has been removed.</p>
          <motion.button
            onClick={() => router.push("/home/allActivity")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-xl text-white font-medium hover:from-red-500 hover:to-red-400 transition-all duration-200"
          >
            Back to Activities
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const config = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.OTHER;

  return (
    <div className="h-full w-full flex flex-col space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        {/* Back Button */}
        <motion.button
          onClick={() => router.push("/home/allActivity")}
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">All Activities</span>
        </motion.button>

        
      </motion.div>

      {/* Activity Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center"
      >
        <div className={`inline-flex items-center justify-center w-16 h-16 ${config.bgColor} rounded-2xl mb-4 text-3xl`}>
          {config.emoji}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-xl">
          {config.name} Session
        </h1>
        <p className="text-white/70 text-lg">
          {formatDate(activity.startTime)} at {formatTime(activity.startTime)}
        </p>
      </motion.div>

      <div className="flex-1 overflow-y-auto space-y-6">
        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-black/25 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-6 h-6 text-blue-400" />
              <span className="text-2xl font-bold text-white">{activity.duration}</span>
            </div>
            <p className="text-white/60 font-medium">Minutes</p>
          </div>

          <div className="bg-black/25 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <Flame className="w-6 h-6 text-red-400" />
              <span className="text-2xl font-bold text-white">{activity.caloriesBurned}</span>
            </div>
            <p className="text-white/60 font-medium">Calories Burned</p>
          </div>

          <div className="bg-black/25 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-6 h-6 text-green-400" />
              <span className="text-2xl font-bold text-white">{formatTime(activity.startTime)}</span>
            </div>
            <p className="text-white/60 font-medium">Start Time</p>
          </div>
        </motion.div>

        {/* Additional Metrics */}
        {activity.additionalMetrics && Object.keys(activity.additionalMetrics).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-black/25 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <span>Detailed Metrics</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(activity.additionalMetrics).map(([key, value], index) => {
                const metric = METRIC_LABELS[key];
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-white/30 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70">
                        {metric?.icon || <Target className="w-4 h-4" />}
                      </span>
                      <span className="text-lg font-bold text-white">
                        {formatMetricValue(key, value)}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm font-medium">
                      {metric?.label || key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* AI Recommendations */}
        <AnimatePresence>
          {(recommendation || recommendationLoading) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-black/25 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                <span>AI-Powered Insights</span>
              </h2>

              {recommendationLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                    />
                    <span className="text-white/70">Generating personalized insights...</span>
                  </div>
                </div>
              ) : recommendation ? (
                <div className="space-y-6">
                  {/* Main Recommendation */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                      <span>Overview</span>
                    </h3>
                    <p className="text-white/90 leading-relaxed whitespace-pre-line">
                      {recommendation.recommendation}
                    </p>
                  </div>

                  {/* Improvements */}
                  {recommendation.improvements && recommendation.improvements.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <Target className="w-5 h-5 text-green-400" />
                        <span>Areas for Improvement</span>
                      </h3>
                      <ul className="space-y-3">
                        {recommendation.improvements.map((item, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start space-x-3"
                          >
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                            <p className="text-white/80 leading-relaxed">{item}</p>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggestions */}
                  {recommendation.suggestions && recommendation.suggestions.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <Lightbulb className="w-5 h-5 text-blue-400" />
                        <span>Suggestions</span>
                      </h3>
                      <ul className="space-y-3">
                        {recommendation.suggestions.map((item, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start space-x-3"
                          >
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                            <p className="text-white/80 leading-relaxed">{item}</p>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Safety Tips */}
                  {recommendation.safety && recommendation.safety.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-orange-400" />
                        <span>Safety Reminders</span>
                      </h3>
                      <ul className="space-y-3">
                        {recommendation.safety.map((item, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start space-x-3"
                          >
                            <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                            <p className="text-white/80 leading-relaxed">{item}</p>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/60">No AI recommendations available for this activity.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Enhancement */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.4, 0.2],
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
            opacity: [0.3, 0.5, 0.3],
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

export default ActivityDetailsPage;
