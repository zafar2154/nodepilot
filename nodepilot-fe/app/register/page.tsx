"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi tidak sama");
      return;
    }

    try {
      const res = await API.post("/auth/register", { email, password });
      setSuccess("Registrasi berhasil! Silakan login.");
      setError("");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Registrasi gagal");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleRegister}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          Register
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

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
          className="w-full mb-4 px-3 py-2 border rounded 
                     bg-gray-50 dark:bg-gray-700 
                     text-gray-900 dark:text-gray-100
                     border-gray-300 dark:border-gray-600"
        />

        <input
          type="password"
          placeholder="Konfirmasi Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-6 px-3 py-2 border rounded 
                     bg-gray-50 dark:bg-gray-700 
                     text-gray-900 dark:text-gray-100
                     border-gray-300 dark:border-gray-600"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded 
                     hover:bg-green-700 dark:hover:bg-green-500"
        >
          Register
        </button>

        <p className="text-sm mt-4 text-center text-gray-700 dark:text-gray-300">
          Sudah punya akun?{" "}
          <a href="/login" className="text-blue-600 dark:text-blue-400 underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
