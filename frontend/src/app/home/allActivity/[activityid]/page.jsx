"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

function ActivityDetailsPage() {
  const { activityid } = useParams();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      try {
        // Fetch activity details
        const activityRes = await axios.get(
          `${backendUrl}/api/activities/${activityid}`
        );
        setActivity(activityRes.data);

        // Fetch AI recommendation
        const recRes = await axios.get(
          `${backendUrl}/api/recommendations/activity/${activityid}`
        );
        setRecommendation(recRes.data);
      } catch (error) {
        console.error("Error fetching activity details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (activityid) fetchData();
  }, [activityid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-white text-lg">Loading activity details...</p>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="p-6 text-white bg-gray-900 min-h-screen">
        <p className="text-red-400">Activity not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">{activity.type} Activity</h1>

      {/* Activity Details */}
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Activity Details</h2>
        <p><strong>Duration:</strong> {activity.duration} min</p>
        <p><strong>Calories Burned:</strong> {activity.caloriesBurned}</p>
        <p><strong>Start Time:</strong> {new Date(activity.startTime).toLocaleString()}</p>

        <h3 className="text-lg font-semibold mt-4">Additional Metrics:</h3>
        <ul className="list-disc list-inside text-gray-300">
          {activity.additionalMetrics &&
            Object.entries(activity.additionalMetrics).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
        </ul>
      </div>

      {/* AI Recommendations */}
      {recommendation && (
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold">AI Recommendations</h2>

          <div>
            <h3 className="font-semibold mb-2">Overview:</h3>
            <p className="text-gray-300 whitespace-pre-line">
              {recommendation.recommendation}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Improvements:</h3>
            <ul className="list-disc list-inside text-gray-300">
              {recommendation.improvements?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Suggestions:</h3>
            <ul className="list-disc list-inside text-gray-300">
              {recommendation.suggestions?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Safety Tips:</h3>
            <ul className="list-disc list-inside text-gray-300">
              {recommendation.safety?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityDetailsPage;
