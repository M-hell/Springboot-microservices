"use client";

import Header from "@/components/Header";

export default function HomeLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header */}
      <Header />
        {/* Main content area */}
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
          {children}
        </main>
    </div>
  );
}
