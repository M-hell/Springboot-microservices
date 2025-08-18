"use client";
import React from "react";
import useUserStore from "@/zustand/useProvider";

function Header() {
  const { firstName, lastName } = useUserStore();
  console.log("Header component rendered with user:", firstName, lastName);

  return (
    <div className="bg-gray-800 shadow-lg p-4 text-center">
      <h1 className="text-2xl font-bold text-white">Fitness App</h1>
      {firstName && lastName ? (
        <>
          <p className="text-lg text-gray-200 mt-2">
            Welcome, <span className="font-semibold">{firstName} {lastName}</span> 👋
          </p>
          <p className="text-sm text-gray-400 italic mt-1">
            "Stay fit, work hard, and keep pushing forward 💪"
          </p>
        </>
      ) : (
        <p className="text-sm text-gray-400 mt-2 italic">
          "Stay fit, work hard, and keep pushing forward 💪"
        </p>
      )}
    </div>
  );
}

export default Header;
