"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await apiRequest("/auth/profile", "GET", undefined, token || undefined);
      setProfile(res.user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button onClick={loadProfile} className="px-4 py-2 bg-indigo-500 text-white rounded">
        Load Profile
      </button>
      {profile && <pre className="mt-4 bg-gray-100 p-3 rounded">{JSON.stringify(profile, null, 2)}</pre>}
      {error && <p className="mt-3 text-red-500">{error}</p>}
    </div>
  );
}
