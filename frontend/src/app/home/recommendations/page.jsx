"use client";

import { useEffect, useState } from "react";
import useUserStore from "@/zustand/useProvider";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { motion } from "framer-motion";

export default function RecommendationsPage() {
  const { id } = useUserStore();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
        const res = await axios.get(
          `${backendUrl}/api/recommendations/user/${userId}`
        );
        setRecommendations(res.data || []);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setError("Failed to load recommendations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-lg text-gray-600">Loading recommendations...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-lg text-gray-600">Please log in to view recommendations.</div>
        </div>
      </div>
    );
  }

  if (!recommendations.length) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-lg text-gray-600">No recommendations found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Recommendations</h1>
        <p className="text-gray-600">Personalized suggestions based on your activities</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    {rec.activityType || 'Activity'} 
                  </h2>
                </div>
                
                {rec.recommendation && (
                  <div>
                    <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                      {rec.recommendation}
                    </p>
                  </div>
                )}

                {rec.improvements && rec.improvements.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                      📈 Improvements
                    </h3>
                    <ul className="list-disc ml-4 text-blue-800 space-y-1">
                      {rec.improvements.map((imp, idx) => (
                        <li key={idx}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {rec.suggestions && rec.suggestions.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                      💡 Suggestions
                    </h3>
                    <ul className="list-disc ml-4 text-green-800 space-y-1">
                      {rec.suggestions.map((sug, idx) => (
                        <li key={idx}>{sug}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {rec.safety && rec.safety.length > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 mb-2 flex items-center">
                      ⚠️ Safety Tips
                    </h3>
                    <ul className="list-disc ml-4 text-yellow-800 space-y-1">
                      {rec.safety.map((safe, idx) => (
                        <li key={idx}>{safe}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {rec.createdAt && (
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-sm text-gray-500">
                      Created: {new Date(rec.createdAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}