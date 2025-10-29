"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-xl font-bold mb-4">Profile Page</h1>
        {user ? (
          <p>Welcome, {user.email}</p>
        ) : (
          <p>Loading user info...</p>
        )}
      </div>
    </ProtectedRoute>
  );
}
