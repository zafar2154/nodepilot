"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../lib/api";
import { useAuthStore } from "../../lib/store";

export default function LoginPage() {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      setToken(res.data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          Login
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded 
                     bg-gray-50 dark:bg-gray-700 
                     text-gray-900 dark:text-gray-100
                     border-gray-300 dark:border-gray-600"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-3 py-2 border rounded 
                     bg-gray-50 dark:bg-gray-700 
                     text-gray-900 dark:text-gray-100
                     border-gray-300 dark:border-gray-600"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded 
                     hover:bg-blue-700 dark:hover:bg-blue-500"
        >
          Login
        </button>

        <p className="text-sm mt-4 text-center text-gray-700 dark:text-gray-300">
          Belum punya akun?{" "}
          <a href="/register" className="text-blue-600 dark:text-blue-400 underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
