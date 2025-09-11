"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Flame, 
  Activity as ActivityIcon, 
  TrendingUp, 
  Target,
  CheckCircle,
  AlertCircle,
  Zap
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ACTIVITY_TYPES = [
  "RUNNING",
  "WALKING", 
  "CYCLING",
  "SWIMMING",
  "WEIGHT_TRAINING",
  "YOGA",
  "HIIT",
  "CARDIO",
  "STRETCHING",
  "OTHER",
];

// Enhanced activity type display names and icons
const ACTIVITY_INFO = {
  RUNNING: { name: "Running", icon: "🏃‍♂️", color: "from-red-500 to-orange-500" },
  WALKING: { name: "Walking", icon: "🚶‍♂️", color: "from-green-500 to-teal-500" },
  CYCLING: { name: "Cycling", icon: "🚴‍♂️", color: "from-blue-500 to-cyan-500" },
  SWIMMING: { name: "Swimming", icon: "🏊‍♂️", color: "from-cyan-500 to-blue-500" },
  WEIGHT_TRAINING: { name: "Weight Training", icon: "🏋️‍♂️", color: "from-red-600 to-red-500" },
  YOGA: { name: "Yoga", icon: "🧘‍♀️", color: "from-purple-500 to-pink-500" },
  HIIT: { name: "HIIT", icon: "💪", color: "from-red-500 to-red-600" },
  CARDIO: { name: "Cardio", icon: "❤️", color: "from-pink-500 to-red-500" },
  STRETCHING: { name: "Stretching", icon: "🤸‍♂️", color: "from-indigo-500 to-purple-500" },
  OTHER: { name: "Other", icon: "⚡", color: "from-gray-500 to-gray-600" },
};

const METRIC_PRESETS = {
  RUNNING: ["distance", "averageSpeed", "maxHeartRate"],
  WALKING: ["distance", "averageSpeed", "maxHeartRate"],
  CYCLING: ["distance", "averageSpeed", "elevationGain", "maxHeartRate"],
  SWIMMING: ["laps", "distance", "strokeRate", "maxHeartRate"],
  WEIGHT_TRAINING: ["sets", "reps", "weightPerRep", "maxHeartRate"],
  YOGA: ["durationFocus", "calmnessScore"],
  HIIT: ["rounds", "workIntervalSec", "restIntervalSec", "maxHeartRate"],
  CARDIO: ["distance", "averageSpeed", "maxHeartRate"],
  STRETCHING: ["flexibilityScore", "targetAreas"],
  OTHER: [],
};

const LABELS = {
  distance: "Distance (km)",
  averageSpeed: "Avg Speed (km/h)",
  maxHeartRate: "Max HR (bpm)",
  elevationGain: "Elevation Gain (m)",
  laps: "Laps",
  strokeRate: "Stroke Rate (strokes/min)",
  sets: "Sets",
  reps: "Reps",
  weightPerRep: "Weight/Rep (kg)",
  durationFocus: "Focus (min)",
  calmnessScore: "Calmness (1–10)",
  rounds: "Rounds",
  workIntervalSec: "Work Interval (sec)",
  restIntervalSec: "Rest Interval (sec)",
  flexibilityScore: "Flexibility (1–10)",
  targetAreas: "Target Areas",
};

function toIsoSeconds(datetimeLocal) {
  if (!datetimeLocal) return null;
  const d = new Date(datetimeLocal);
  const iso = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds()
  ).toISOString();
  return iso.slice(0, 19);
}

function Field({ label, children, icon }) {
  return (
    <motion.div 
      className="space-y-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="flex items-center space-x-2 text-white/90 font-medium text-sm">
        {icon && <span className="text-red-400">{icon}</span>}
        <span>{label}</span>
      </label>
      {children}
    </motion.div>
  );
}

export default function CreateActivity() {
  const [type, setType] = useState("WALKING");
  const [duration, setDuration] = useState(30);
  const [caloriesBurned, setCaloriesBurned] = useState(300);
  const [startTime, setStartTime] = useState("");
  const [metrics, setMetrics] = useState({
    distance: 5.2,
    averageSpeed: 10.4,
    maxHeartRate: 165,
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState({ ok: null, msg: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  const activeMetricKeys = useMemo(
    () => METRIC_PRESETS[type] ?? [],
    [type]
  );

  // Set default start time to current time
  useEffect(() => {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setStartTime(localDateTime);
  }, []);

  // Auto-adjust calories based on activity type and duration
  useEffect(() => {
    const calorieRates = {
      RUNNING: 12,
      WALKING: 5,
      CYCLING: 10,
      SWIMMING: 15,
      WEIGHT_TRAINING: 8,
      YOGA: 3,
      HIIT: 18,
      CARDIO: 10,
      STRETCHING: 2,
      OTHER: 6,
    };
    
    const estimatedCalories = Math.round((calorieRates[type] || 6) * (duration || 1));
    setCaloriesBurned(estimatedCalories);
  }, [type, duration]);

  const onMetricChange = (key, value) => {
    setMetrics((m) => ({ ...m, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setSubmitting(true);
    setResult({ ok: null, msg: "" });

    try {
      // Validation
      if (!duration || duration <= 0) {
        throw new Error("Duration must be greater than 0");
      }
      
      if (!caloriesBurned || caloriesBurned <= 0) {
        throw new Error("Calories burned must be greater than 0");
      }

      if (!startTime?.trim()) {
        throw new Error("Please select a start time");
      }

      // Build additionalMetrics
      const additionalMetrics = {};
      activeMetricKeys.forEach((k) => {
        const v = metrics[k];
        if (v !== "" && v !== null && v !== undefined) {
          const num = Number(v);
          additionalMetrics[k] = Number.isFinite(num) && v !== "" ? num : v;
        }
      });

      const payload = {
        type,
        duration: Number(duration),
        caloriesBurned: Number(caloriesBurned),
        startTime: toIsoSeconds(startTime) || new Date().toISOString().slice(0, 19),
        additionalMetrics,
      };

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      
      if (!backendUrl) {
        throw new Error("Backend URL not configured");
      }

      const response = await axios.post(`${backendUrl}/api/activities`, payload, {
        withCredentials: true,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Activity created:", response.data);
      
      setShowSuccess(true);
      setResult({ ok: true, msg: "Activity saved successfully! 🎉" });
      
      toast.success(`${ACTIVITY_INFO[type]?.name} activity created! 🎉`, {
        className: "bg-gradient-to-r from-green-500 to-green-600 text-white",
      });

      // Reset form after successful submission
      setTimeout(() => {
        setShowSuccess(false);
        // Keep type but reset other fields for quick entry
        setDuration(30);
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        setStartTime(localDateTime);
      }, 2000);

    } catch (err) {
      console.error("Activity creation error:", err);
      
      const msg = err.response?.data?.message || 
                 err.response?.data || 
                 err.message ||
                 "Failed to create activity";
      
      setResult({ ok: false, msg });
      toast.error("Failed to create activity ❌", {
        className: "bg-gradient-to-r from-red-600 to-red-700 text-white",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-black/25 backdrop-blur-xl shadow-2xl rounded-3xl p-6 sm:p-8 border border-white/20 hover:border-white/30 transition-all duration-500"
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl mb-4 shadow-xl">
            <ActivityIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-xl">
            Log New Activity
          </h2>
          <p className="text-white/70 text-base sm:text-lg">
            Track your fitness journey with detailed metrics
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Activity Type Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <Field 
              label="Choose Activity Type" 
              icon={<Target className="w-4 h-4" />}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {ACTIVITY_TYPES.map((activityType) => {
                  const info = ACTIVITY_INFO[activityType];
                  const isSelected = type === activityType;
                  return (
                    <motion.button
                      key={activityType}
                      type="button"
                      onClick={() => setType(activityType)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        relative p-4 rounded-xl border transition-all duration-300 text-center
                        ${isSelected 
                          ? `bg-gradient-to-br ${info.color} border-white/50 shadow-lg` 
                          : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40'
                        }
                      `}
                    >
                      <div className="text-2xl mb-2">{info.icon}</div>
                      <div className="text-white text-xs font-medium">{info.name}</div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </Field>
          </motion.div>

          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Field 
              label="Start Time" 
              icon={<Calendar className="w-4 h-4" />}
            >
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500/50 focus:bg-white/20 transition-all duration-300"
                required
                disabled={submitting}
              />
            </Field>

            <Field 
              label="Duration (minutes)" 
              icon={<Clock className="w-4 h-4" />}
            >
              <input
                type="number"
                min={1}
                max={600}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500/50 focus:bg-white/20 transition-all duration-300"
                required
                disabled={submitting}
              />
            </Field>

            <Field 
              label="Calories Burned" 
              icon={<Flame className="w-4 h-4" />}
            >
              <input
                type="number"
                min={1}
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(e.target.value)}
                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500/50 focus:bg-white/20 transition-all duration-300"
                required
                disabled={submitting}
              />
            </Field>
          </motion.div>

          {/* Dynamic Metrics */}
          <AnimatePresence mode="wait">
            {activeMetricKeys.length > 0 && (
              <motion.div
                key={type}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-center space-x-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-red-400" />
                  <h3 className="text-xl font-semibold text-white">
                    {ACTIVITY_INFO[type]?.name} Metrics
                  </h3>
                  <span className="text-2xl">{ACTIVITY_INFO[type]?.icon}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeMetricKeys.map((key, index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <Field label={LABELS[key] ?? key}>
                        <input
                          type={key === "targetAreas" ? "text" : "number"}
                          step={key.includes("Speed") || key.includes("distance") ? "0.1" : "1"}
                          value={metrics[key] ?? ""}
                          onChange={(e) => onMetricChange(key, e.target.value)}
                          className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500/50 focus:bg-white/20 transition-all duration-300"
                          placeholder={`Enter ${LABELS[key] ?? key}`}
                          disabled={submitting}
                        />
                      </Field>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col items-center space-y-4 pt-4"
          >
            <button
              type="submit"
              disabled={submitting || showSuccess}
              className={`
                group relative px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 overflow-hidden
                ${submitting || showSuccess
                  ? "bg-white/20 cursor-not-allowed opacity-60" 
                  : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 active:scale-95"
                }
                text-white shadow-lg border border-red-500/30
              `}
            >
              <div className="flex items-center justify-center space-x-3">
                {submitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    <span>Creating Activity...</span>
                  </>
                ) : showSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Activity Created!</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Save Activity</span>
                  </>
                )}
              </div>
            </button>

            {/* Result Message */}
            <AnimatePresence>
              {result.msg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={`
                    flex items-center space-x-2 px-4 py-3 rounded-xl backdrop-blur-sm border font-medium
                    ${result.ok === true
                      ? "text-green-300 bg-green-500/20 border-green-400/30"
                      : result.ok === false
                      ? "text-red-300 bg-red-500/20 border-red-400/30"
                      : "text-white/70 bg-white/10 border-white/20"
                    }
                  `}
                >
                  {result.ok === true ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : result.ok === false ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : null}
                  <span>{result.msg}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </form>

        {/* Background Enhancement */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          <div className="absolute top-10 right-10 w-20 h-20 bg-red-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-red-400/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </motion.div>
    </div>
  );
}
