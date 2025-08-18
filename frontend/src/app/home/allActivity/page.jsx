"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function Page() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchActivities = async () => {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ;
      try {
        const response = await axios.get(`${backendUrl}/api/activities`, {
          withCredentials: true,
        });
        console.log("Fetched activities:", response.data);
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-white text-lg">Loading activities...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Activities</h1>
      {activities.length === 0 ? (
        <p className="text-gray-400">No activities found.</p>
      ) : (
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li
              key={activity.id}
              onClick={() => router.push(`/home/allActivity/${activity.id}`)}
              className="cursor-pointer bg-gray-800 shadow-md p-4 rounded-lg hover:bg-gray-700 hover:scale-105 transition-transform duration-300"
            >
              <p className="text-xl font-semibold">{activity.type}</p>
              <p className="text-gray-300">Calories Burned: {activity.caloriesBurned}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Page;
