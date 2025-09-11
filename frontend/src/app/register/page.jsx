"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e?.target || {};
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Check password strength
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }

    // Clear error when user types
    if (error) setError("");
  };

  const validateForm = () => {
    const { email, password, firstName, lastName } = formData;
    
    if (!firstName?.trim() || !lastName?.trim()) {
      setError("Please enter your first and last name");
      return false;
    }
    
    if (!email?.trim() || !email.includes('@')) {
      setError("Please enter a valid email address");
      return false;
    }
    
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError("");

    if (!validateForm()) {
      toast.error("Please check your form inputs ⚠️");
      return;
    }

    startTransition(async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        
        if (!backendUrl) {
          throw new Error("Backend URL not configured");
        }

        const sanitizedData = {
          email: formData.email.trim().toLowerCase(),
          password: formData.password.trim(),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
        };

        await axios.post(`${backendUrl}/api/users/register`, sanitizedData, {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        });

        toast.success("Account created successfully! 🎉", {
          className: "bg-gradient-to-r from-green-500 to-green-600 text-white",
        });

        // Redirect to login page after successful registration
        router.push("/");
      } catch (err) {
        console.error("Registration failed:", err);
        
        const msg = err.response?.data?.message || 
                   err.response?.data || 
                   err.message ||
                   "Registration failed. Please try again.";
        
        setError(msg);
        toast.error("Registration failed ❌", {
          className: "bg-gradient-to-r from-red-600 to-red-700 text-white",
        });
      }
    });
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      case 5: return 'bg-emerald-500';
      default: return 'bg-gray-300';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      case 5: return 'Very Strong';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {/* Main Register Card */}
      <div className="relative w-full max-w-lg">
        {/* Glowing background effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-red-500 to-red-400 rounded-3xl blur-lg opacity-30 animate-pulse"></div>
        
        <div className="relative bg-black/40 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full border border-red-500/20 hover:border-red-400/30 transition-all duration-500">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-4 shadow-lg">
              <span className="text-2xl font-bold text-white">🏋️</span>
            </div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
              Join Fitness Tracker
            </h1>
            <p className="text-white/80 text-sm">
              Start your fitness journey with AI-powered workouts
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-white/90 text-sm font-medium block">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  autoComplete="given-name"
                  onChange={handleChange}
                  className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500/50 focus:bg-white/20 transition-all duration-300 hover:bg-white/15"
                  required
                  disabled={pending}
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-white/90 text-sm font-medium block">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  autoComplete="family-name"
                  onChange={handleChange}
                  className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500/50 focus:bg-white/20 transition-all duration-300 hover:bg-white/15"
                  required
                  disabled={pending}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-white/90 text-sm font-medium block">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  autoComplete="email"
                  onChange={handleChange}
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
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  autoComplete="new-password"
                  onChange={handleChange}
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-white/70">Password Strength</span>
                    <span className="text-xs text-white/70">{getPasswordStrengthText()}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
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
              disabled={pending || !formData.firstName?.trim() || !formData.lastName?.trim() || !formData.email?.trim() || !formData.password}
              className={`w-full bg-gradient-to-r from-red-600 to-red-500 text-white p-4 rounded-xl font-semibold border border-red-500/30 hover:from-red-500 hover:to-red-400 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-transparent ${
                pending || !formData.firstName?.trim() || !formData.lastName?.trim() || !formData.email?.trim() || !formData.password
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
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-white/80 text-sm mb-2">
              Already have an account?
            </p>
            <button
              onClick={() => router.push("/")}
              className="text-red-400 font-semibold hover:text-red-300 transition-colors duration-300 underline decoration-red-400/50 hover:decoration-red-300/80 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-transparent rounded px-1"
              disabled={pending}
            >
              Sign in here →
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
        <div className="absolute top-20 right-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-red-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-red-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
}
