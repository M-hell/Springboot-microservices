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
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await axios.post(
          `${backendUrl}/api/users/login`,
          { email, password },
          { withCredentials: true }
        );
        console.log(response);

        setUser({
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          id: response.data.id,
        });

        toast.success("Logged in successfully 🎉");
        router.push("/home");
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.response?.data ||
          "Invalid login credentials";
        setError(msg);
        toast.error("Invalid credentials ❌");
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100">
      <div className="bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={pending}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={pending}
          />
          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            disabled={pending}
            className={`bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-all ${
              pending ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {pending ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-4">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-400 hover:underline"
          >
            Register here
          </a>
        </p>
      </div>
      <div className="mt-6 text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Fitness App. All rights reserved.</p>
      </div>
    </div>
  );
}
