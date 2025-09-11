"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import useUserStore from "@/zustand/useProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError("");
    
    // Validation
    if (!email?.trim() || !password?.trim()) {
      setError("Please fill in all fields");
      toast.error("Please fill in all fields ⚠️");
      return;
    }

    startTransition(async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        
        if (!backendUrl) {
          throw new Error("Backend URL not configured");
        }

        const response = await axios.post(
          `${backendUrl}/api/users/login`,
          { 
            email: email.trim().toLowerCase(), 
            password: password.trim() 
          },
          { 
            withCredentials: true,
            timeout: 10000, // 10 second timeout
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        // Safe data extraction
        const userData = response?.data;
        if (!userData?.id) {
          throw new Error("Invalid response from server");
        }

        setUser({
          email: userData.email || email,
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          id: userData.id,
        });

        toast.success("Welcome back! 🎉", {
          className: "bg-gradient-to-r from-red-500 to-red-600 text-white",
        });
        
        router.push("/home");
      } catch (err) {
        console.error('Login error:', err);
        
        const msg = err.response?.data?.message || 
                   err.response?.data || 
                   err.message ||
                   "Login failed. Please try again.";
        
        setError(msg);
        toast.error("Login failed ❌", {
          className: "bg-gradient-to-r from-red-600 to-red-700 text-white",
        });
      }
    });
  };

  const handleInputChange = (setter) => (e) => {
    const value = e?.target?.value || "";
    setter(value);
    if (error) setError(""); // Clear error when user types
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {/* Main Login Card */}
      <div className="relative w-full max-w-md">
        {/* Glowing background effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-red-500 to-red-400 rounded-3xl blur-lg opacity-30 animate-pulse"></div>
        
        <div className="relative bg-black/40 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full border border-red-500/20 hover:border-red-400/30 transition-all duration-500">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-4 shadow-lg">
              <span className="text-2xl font-bold text-white">💪</span>
            </div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
              Welcome Back
            </h1>
            <p className="text-white/80 text-sm">
              Sign in to continue your fitness journey
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-white/90 text-sm font-medium block">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  autoComplete="email"
                  onChange={handleInputChange(setEmail)}
                  className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500/50 focus:bg-white/20 transition-all duration-300 hover:bg-white/15"
                  required
                  disabled={pending}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-white/90 text-sm font-medium block">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  autoComplete="current-password"
                  onChange={handleInputChange(setPassword)}
                  className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500/50 focus:bg-white/20 transition-all duration-300 hover:bg-white/15"
                  required
                  disabled={pending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/60 hover:text-white/80 transition-colors duration-200"
                  disabled={pending}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-300 text-sm bg-red-500/20 backdrop-blur-sm p-4 rounded-xl border border-red-400/30 animate-fadeIn">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={pending || !email?.trim() || !password?.trim()}
              className={`w-full bg-gradient-to-r from-red-600 to-red-500 text-white p-4 rounded-xl font-semibold border border-red-500/30 hover:from-red-500 hover:to-red-400 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-transparent ${
                pending || !email?.trim() || !password?.trim()
                  ? "opacity-60 cursor-not-allowed hover:scale-100 hover:shadow-none" 
                  : "active:scale-[0.98]"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                {pending ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-white/80 text-sm mb-2">
              New to Fitness Tracker?
            </p>
            <button
              onClick={() => router.push("/register")}
              className="text-red-400 font-semibold hover:text-red-300 transition-colors duration-300 underline decoration-red-400/50 hover:decoration-red-300/80 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-transparent rounded px-1"
              disabled={pending}
            >
              Create your account →
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-white/60 text-xs backdrop-blur-sm bg-black/20 px-6 py-3 rounded-full border border-white/10 hover:bg-black/30 transition-all duration-300">
        <p>© {new Date().getFullYear()} Fitness Tracker. Powered by AI</p>
      </div>

      {/* Background Enhancement */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-red-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-red-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
}
