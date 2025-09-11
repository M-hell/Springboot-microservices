"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft,
  Brain,
  Target,
  Lightbulb,
  Shield,
  TrendingUp,
  RefreshCw,
  Calendar,
  Sparkles,
  Activity as ActivityIcon,
  Clock,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useRouter } from "next/navigation";
import useUserStore from "@/zustand/useProvider";
import axios from "axios";
import { toast } from "react-toastify";

// Activity type configurations for recommendations
const ACTIVITY_CONFIG = {
  RUNNING: { icon: "🏃‍♂️", color: "from-red-500 to-orange-500", name: "Running" },
  WALKING: { icon: "🚶‍♂️", color: "from-green-500 to-teal-500", name: "Walking" },
  CYCLING: { icon: "🚴‍♂️", color: "from-blue-500 to-cyan-500", name: "Cycling" },
  SWIMMING: { icon: "🏊‍♂️", color: "from-cyan-500 to-blue-500", name: "Swimming" },
  WEIGHT_TRAINING: { icon: "🏋️‍♂️", color: "from-red-600 to-red-500", name: "Weight Training" },
  YOGA: { icon: "🧘‍♀️", color: "from-purple-500 to-pink-500", name: "Yoga" },
  HIIT: { icon: "💪", color: "from-red-500 to-red-600", name: "HIIT" },
  CARDIO: { icon: "❤️", color: "from-pink-500 to-red-500", name: "Cardio" },
  STRETCHING: { icon: "🤸‍♂️", color: "from-indigo-500 to-purple-500", name: "Stretching" },
  OTHER: { icon: "⚡", color: "from-gray-500 to-gray-600", name: "Other" },
};

export default function RecommendationsPage() {
  const { id } = useUserStore();
  const router = useRouter();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const userId = id;

  const fetchRecommendations = async (showRefreshToast = false) => {
    try {
      setLoading(!showRefreshToast);
      setRefreshing(showRefreshToast);
      setError(null);
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      
      if (!backendUrl) {
        throw new Error("Backend URL not configured");
      }

      const res = await axios.get(
        `${backendUrl}/api/recommendations/user/${userId}`,
        { 
          withCredentials: true,
          timeout: 15000 
        }
      );
      
      setRecommendations(res.data || []);
      
      if (showRefreshToast) {
        toast.success("Recommendations refreshed! 🔄", {
          className: "bg-gradient-to-r from-green-500 to-green-600 text-white",
        });
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          error.message ||
                          "Failed to load recommendations. Please try again later.";
      setError(errorMessage);
      
      if (showRefreshToast) {
        toast.error("Failed to refresh recommendations ❌", {
          className: "bg-gradient-to-r from-red-600 to-red-700 text-white",
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchRecommendations();
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleRefresh = () => {
    if (!refreshing && !loading) {
      fetchRecommendations(true);
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
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-xl"
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
          <p className="text-white text-xl font-semibold">Loading AI recommendations...</p>
          <p className="text-white/60 text-sm mt-2">Analyzing your fitness data</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-black/25 backdrop-blur-sm rounded-3xl p-8 border border-red-400/30 max-w-md mx-auto"
        >
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-red-300 text-2xl font-semibold mb-2">Unable to Load Recommendations</h2>
          <p className="text-white/60 mb-6 text-sm">{error}</p>
          <div className="flex gap-3 justify-center">
            <motion.button
              onClick={handleRefresh}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 rounded-xl text-white font-medium hover:from-red-500 hover:to-red-400 transition-all duration-200"
            >
              Try Again
            </motion.button>
            <motion.button
              onClick={() => router.push("/home")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-white/10 rounded-xl text-white font-medium hover:bg-white/20 transition-all duration-200"
            >
              Go Back
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-black/25 backdrop-blur-sm rounded-3xl p-8 border border-yellow-400/30 max-w-md mx-auto"
        >
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-yellow-300 text-2xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-white/60 mb-6">Please log in to view your personalized AI recommendations</p>
          <motion.button
            onClick={() => router.push("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-xl text-white font-medium hover:from-yellow-500 hover:to-yellow-400 transition-all duration-200"
          >
            Sign In
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!recommendations.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-black/25 backdrop-blur-sm rounded-3xl p-8 border border-blue-400/30 max-w-lg mx-auto"
        >
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-blue-300 text-2xl font-semibold mb-2">No Recommendations Yet</h2>
          <p className="text-white/60 mb-6">Complete some activities to get personalized AI-powered fitness recommendations!</p>
          <div className="flex gap-3 justify-center">
            <motion.button
              onClick={() => router.push("/home/addActivity")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl text-white font-medium hover:from-blue-500 hover:to-blue-400 transition-all duration-200"
            >
              Add Activity
            </motion.button>
            <motion.button
              onClick={handleRefresh}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-3 bg-white/10 rounded-xl text-white font-medium hover:bg-white/20 transition-all duration-200"
            >
              <RefreshCw className="w-5 h-5" />
            </motion.button>
          </div>
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
        className="flex items-center justify-between"
      >
        {/* Back Button */}
        <motion.button
          onClick={() => router.push("/home")}
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Dashboard</span>
        </motion.button>

        {/* Refresh Button */}
        <motion.button
          onClick={handleRefresh}
          disabled={refreshing}
          whileHover={{ scale: refreshing ? 1 : 1.05 }}
          whileTap={{ scale: refreshing ? 1 : 0.95 }}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-200 font-medium
            ${refreshing 
              ? "bg-white/5 border-white/10 text-white/50 cursor-not-allowed" 
              : "bg-white/10 border-white/20 text-white hover:bg-white/20"
            }
          `}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
        </motion.button>
      </motion.div>

      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-xl">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-xl">
          AI Fitness Insights
        </h1>
        <p className="text-white/70 text-lg">
          Personalized recommendations powered by artificial intelligence
        </p>
      </motion.div>

      {/* Recommendations Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <div>
              <h2 className="text-white font-semibold text-lg">Your Insights Dashboard</h2>
              <p className="text-white/60 text-sm">
                {recommendations.length} personalized recommendation{recommendations.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm">Last updated</p>
            <p className="text-white/60 text-xs">
              {recommendations[0]?.createdAt ? formatDate(recommendations[0].createdAt) : "Recently"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Recommendations Grid */}
      <div className="flex-1 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <AnimatePresence>
            {recommendations.map((rec, index) => {
              const activityConfig = ACTIVITY_CONFIG[rec.activityType] || ACTIVITY_CONFIG.OTHER;
              
              return (
                <motion.div
                  key={rec.id || index}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    y: -5,
                  }}
                  className="bg-black/25 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300 shadow-lg overflow-hidden"
                >
                  {/* Card Header */}
                  <div className={`bg-gradient-to-r ${activityConfig.color} p-6`}>
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{activityConfig.icon}</div>
                      <div>
                        <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                          {activityConfig.name} Insights
                        </h2>
                        <p className="text-white/80 text-sm">
                          AI-generated recommendations
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-6">
                    {/* Main Recommendation */}
                    {rec.recommendation && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                          <Lightbulb className="w-5 h-5 text-yellow-400" />
                          <span>Overview</span>
                        </h3>
                        <p className="text-white/90 leading-relaxed whitespace-pre-line">
                          {rec.recommendation}
                        </p>
                      </div>
                    )}

                    {/* Improvements */}
                    {rec.improvements && rec.improvements.length > 0 && (
                      <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-5 border border-blue-400/30">
                        <h3 className="text-lg font-semibold text-blue-200 mb-3 flex items-center space-x-2">
                          <Target className="w-5 h-5" />
                          <span>Areas for Improvement</span>
                        </h3>
                        <ul className="space-y-2">
                          {rec.improvements.map((imp, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start space-x-3"
                            >
                              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                              <p className="text-blue-100 leading-relaxed">{imp}</p>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suggestions */}
                    {rec.suggestions && rec.suggestions.length > 0 && (
                      <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-5 border border-green-400/30">
                        <h3 className="text-lg font-semibold text-green-200 mb-3 flex items-center space-x-2">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Suggestions</span>
                        </h3>
                        <ul className="space-y-2">
                          {rec.suggestions.map((sug, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start space-x-3"
                            >
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <p className="text-green-100 leading-relaxed">{sug}</p>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Safety Tips */}
                    {rec.safety && rec.safety.length > 0 && (
                      <div className="bg-orange-500/20 backdrop-blur-sm rounded-xl p-5 border border-orange-400/30">
                        <h3 className="text-lg font-semibold text-orange-200 mb-3 flex items-center space-x-2">
                          <Shield className="w-5 h-5" />
                          <span>Safety Reminders</span>
                        </h3>
                        <ul className="space-y-2">
                          {rec.safety.map((safe, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start space-x-3"
                            >
                              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                              <p className="text-orange-100 leading-relaxed">{safe}</p>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Timestamp */}
                    {rec.createdAt && (
                      <div className="border-t border-white/20 pt-4">
                        <div className="flex items-center justify-center space-x-2 text-white/60 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>Generated: {formatDate(rec.createdAt)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Background Enhancement */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            y: [0, 15, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute bottom-20 right-10 w-24 h-24 bg-pink-500/15 rounded-full blur-xl"
        />
      </div>
    </div>
  );
}
