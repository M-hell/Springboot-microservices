"use client";

import { Suspense } from "react";
import Header from "@/components/Header";

// Loading component for suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse"></div>
      <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-4 h-4 bg-gradient-to-r from-red-300 to-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
  </div>
);

export default function HomeLayout({ children }) {
  return (
    <div 
      className="min-h-screen text-white flex flex-col relative transition-all duration-300"
      style={{
        backgroundImage: "url('/Keepie.gif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Enhanced multi-layer overlay system */}
      <div 
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(220, 38, 38, 0.12) 0%,
              rgba(0, 0, 0, 0.72) 35%,
              rgba(239, 68, 68, 0.08) 100%
            )
          `,
        }}
      />
      
      {/* Secondary overlay for optimal text readability */}
      <div 
        className="fixed inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-[2]"
      />
      
      {/* Content wrapper with proper z-index */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with enhanced styling */}
        <div className="flex-shrink-0">
          <Suspense fallback={<div className="h-16 bg-black/20 animate-pulse" />}>
            <Header />
          </Suspense>
        </div>
        
        {/* Main content area with enhanced design */}
        <main className="flex-1 mx-3 sm:mx-4 lg:mx-6 my-3 sm:my-4 animate-fadeIn">
          <div className="h-full bg-black/25 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/15 hover:border-white/25 transition-all duration-500 shadow-2xl overflow-hidden">
            {/* Content container with proper padding and constraints */}
            <div className="h-full max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <Suspense fallback={<LoadingFallback />}>
                <div className="h-full animate-fadeIn">
                  {children}
                </div>
              </Suspense>
            </div>
            
            {/* Subtle bottom gradient for visual depth */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        </main>
        
        {/* Enhanced floating background elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {/* Primary floating elements */}
          <div className="absolute top-20 left-10 w-24 h-24 bg-red-500/8 rounded-full blur-2xl animate-pulse float-slow"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-red-400/6 rounded-full blur-3xl animate-pulse float-medium"></div>
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-red-600/10 rounded-full blur-xl animate-pulse float-fast"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-red-300/12 rounded-full blur-2xl animate-pulse float-slow" style={{ animationDelay: '2s' }}></div>
          
          {/* Secondary ambient elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-red-500/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      {/* Custom CSS for enhanced animations */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .float-slow {
          animation: float 8s ease-in-out infinite;
        }

        .float-medium {
          animation: float 12s ease-in-out infinite reverse;
        }

        .float-fast {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.6;
          }
          33% {
            transform: translateY(-15px) rotate(120deg);
            opacity: 0.8;
          }
          66% {
            transform: translateY(8px) rotate(240deg);
            opacity: 0.4;
          }
        }

        /* Enhanced scrollbar for main content */
        main::-webkit-scrollbar {
          width: 6px;
        }

        main::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        main::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #dc2626, #ef4444);
          border-radius: 3px;
        }

        main::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #b91c1c, #dc2626);
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          .animate-fadeIn {
            opacity: 1;
            transform: translateY(0);
          }
          
          .float-slow, .float-medium, .float-fast {
            animation: none;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          main {
            border-color: rgba(255, 255, 255, 0.5);
          }
          
          .floating-element {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
