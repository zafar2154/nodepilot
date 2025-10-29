"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, isHydrated, setHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setHydrated(); // tandai kalau store sudah siap
  }, [setHydrated]);

  useEffect(() => {
    if (isHydrated && !token) {
      router.push("/login");
    }
  }, [isHydrated, token, router]);

  if (!isHydrated) {
    return <p className="text-center mt-10">⏳ Loading...</p>;
  }

  if (!token) {
    return <p className="text-center mt-10">🔒 Redirecting to login...</p>;
  }

  return <>{children}</>;
}
