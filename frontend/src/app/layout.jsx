import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

// Separate viewport export (Next.js 14+ requirement)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#dc2626' },
    { media: '(prefers-color-scheme: dark)', color: '#ef4444' },
  ],
  colorScheme: 'dark light',
};

// Metadata export (without viewport)
export const metadata = {
  title: "Fitness Tracker - AI Powered Workouts",
  description: "Transform your fitness journey with AI-powered workout recommendations and tracking",
  keywords: "fitness, workout, AI, health, exercise, tracking",
  authors: [{ name: "Fitness Tracker Team" }],
  creator: "Fitness Tracker",
  publisher: "Fitness Tracker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen transition-all duration-200`}
        style={{
          fontFamily: 'var(--font-geist-sans)',
          backgroundImage: "url('/Keepie.gif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Enhanced gradient overlay with red theme */}
        <div 
          className="fixed inset-0 pointer-events-none transition-opacity duration-500 ease-in-out z-[1]"
          style={{
            background: `linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(0, 0, 0, 0.75) 40%, rgba(239, 68, 68, 0.05) 100%)`,
          }}
        />

        {/* Secondary overlay for better text readability */}
        <div 
          className="fixed inset-0 pointer-events-none bg-black/35 z-[2]"
        />
        
        {/* Content wrapper with proper z-index */}
        <div className="relative z-10 min-h-screen">
          {/* Enhanced ToastContainer */}
          <ToastContainer 
            position="top-right" 
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            className="mt-16 mr-4 z-50"
            toastClassName="bg-white/95 backdrop-blur-sm border border-red-100 shadow-xl rounded-lg overflow-hidden"
            bodyClassName="text-gray-800 font-medium p-3"
            progressClassName="bg-gradient-to-r from-red-500 to-red-600"
            closeButtonClassName="text-gray-600 hover:text-red-600 transition-colors duration-200"
          />

          {/* Main content with enhanced animations */}
          <main className="relative animate-fadeIn">
            {children}
          </main>

          {/* Animated background elements */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Floating particles effect */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-400/20 rounded-full animate-pulse float-slow" />
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-red-300/30 rounded-full animate-pulse float-medium" />
            <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-red-500/10 rounded-full animate-pulse float-fast" />
          </div>
        </div>
      </body>
    </html>
  );
}
