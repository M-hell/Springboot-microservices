"use client";

import React, { useMemo, useState } from "react";
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

// Dynamic metric presets per type (feel free to tweak)
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

// Pretty labels for metrics
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
  // datetime-local returns "YYYY-MM-DDTHH:mm"
  if (!datetimeLocal) return null;
  const d = new Date(datetimeLocal);
  // force seconds component
  const iso = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds()
  ).toISOString();
  return iso.slice(0, 19); // "YYYY-MM-DDTHH:mm:ss"
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-300">{label}</label>
      {children}
    </div>
  );
}

export default function CreateActivity() {
  const [type, setType] = useState("WALKING");
  const [duration, setDuration] = useState(30);
  const [caloriesBurned, setCaloriesBurned] = useState(300);
  const [startTime, setStartTime] = useState(""); // datetime-local string
  const [metrics, setMetrics] = useState({
    distance: 5.2,
    averageSpeed: 10.4,
    maxHeartRate: 165,
  });

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState({ ok: null, msg: "" });

  const activeMetricKeys = useMemo(
    () => METRIC_PRESETS[type] ?? [],
    [type]
  );

  const onMetricChange = (key, value) => {
    setMetrics((m) => ({ ...m, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult({ ok: null, msg: "" });

    // Build additionalMetrics only with fields relevant to the selected type and non-empty values
    const additionalMetrics = {};
    activeMetricKeys.forEach((k) => {
      const v = metrics[k];
      if (v !== "" && v !== null && v !== undefined) {
        // Convert number-like strings to numbers where appropriate
        const num = Number(v);
        additionalMetrics[k] = Number.isFinite(num) && v !== "" ? num : v;
      }
    });

    const payload = {
      type,
      duration: Number(duration),
      caloriesBurned: Number(caloriesBurned),
      startTime: toIsoSeconds(startTime) || "2025-01-12T10:00:00", // fallback example
      additionalMetrics,
    };

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response=await axios.post(`${backendUrl}/api/activities`, payload, {
        withCredentials: true,
      });
      console.log(response);
      toast.success("Activity created successfully 🎉");
      

      setResult({ ok: true, msg: "Activity created successfully 🎉" });
      // light reset for UX
      // setDuration(30); setCaloriesBurned(300); keep type & metrics for fast entries
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Failed to create activity";
      setResult({ ok: false, msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 shadow-lg rounded-2xl p-6 mb-6 border border-gray-700 transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-4">Create Activity</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Type">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              {ACTIVITY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Start Time">
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </Field>
        </div>

        {/* Second row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Duration (min)">
            <input
              type="number"
              min={0}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </Field>

          <Field label="Calories Burned">
            <input
              type="number"
              min={0}
              value={caloriesBurned}
              onChange={(e) => setCaloriesBurned(e.target.value)}
              className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </Field>
        </div>

        {/* Dynamic Additional Metrics */}
        <div className="rounded-xl border border-gray-700 p-4 bg-gray-800/60">
          <p className="text-sm text-gray-300 mb-3">
            Additional Metrics (auto-adjusts for activity type)
          </p>

          {activeMetricKeys.length === 0 ? (
            <div className="text-gray-400 text-sm italic">
              No extra metrics for this type. You can submit as-is.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeMetricKeys.map((key) => (
                <Field key={key} label={LABELS[key] ?? key}>
                  <input
                    type={key === "targetAreas" ? "text" : "number"}
                    value={metrics[key] ?? ""}
                    onChange={(e) => onMetricChange(key, e.target.value)}
                    className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder={LABELS[key] ?? key}
                  />
                </Field>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className={`px-5 py-3 rounded-lg font-semibold transition-all
            ${submitting ? "bg-blue-700/60 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
            text-white shadow-md hover:shadow-lg`}
          >
            {submitting ? "Saving..." : "Save Activity"}
          </button>

          {result.msg && (
            <span
              className={`text-sm transition-opacity ${
                result.ok === true
                  ? "text-green-400"
                  : result.ok === false
                  ? "text-red-400"
                  : "text-gray-300"
              }`}
            >
              {result.msg}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
