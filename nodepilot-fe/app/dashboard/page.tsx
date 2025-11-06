"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import WidgetPanel from "@/components/dashboard/WidgetPanel";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute"; // <-- 1. Impor ProtectedRoute
import { Widget as widgetTypes } from "@/lib/types";
import { Layout } from "react-grid-layout";

export default function DashboardPage() {
    const { token, clearAuth } = useAuthStore(); // Pastikan sudah diganti ke clearAuth
    const [widgets, setWidgets] = useState<widgetTypes[]>([]);
    const [layout, setLayout] = useState<Layout[]>([]);
    const router = useRouter();

    // ✅ Ambil semua widget user
    useEffect(() => {
        if (token) {
            const ip = process.env.NEXT_PUBLIC_API;
            console.log("TOKEN:", token)
            fetch(`http://${ip}/api/widgets`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (!Array.isArray(data)) return;
                    setWidgets(data);
                    setLayout(
                        data.map((w: widgetTypes) => ({
                            i: w.id.toString(),
                            x: w.x || 0,
                            y: w.y || 0,
                            w: w.width || 2,
                            h: w.height || 2,
                        }))
                    );
                })
                .catch((err) => console.error("❌ Failed to fetch widgets:", err));
        }
    }, [token]); // Tetap gunakan token sebagai dependency

    // ✅ Tambah widget baru
    const addWidget = async (type: string) => {
        // ... (kode ini sudah benar)
        const newWidget = {
            name: `${type} widget`,
            type,
            deviceId: null,
            x: 0,
            y: 0,
            width: 2,
            height: 2,
        };

        try {
            const ip = process.env.NEXT_PUBLIC_API;
            const res = await fetch(`http://${ip}/api/widgets`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newWidget),
            });

            const saved = await res.json();
            if (!saved?.id) return;

            setWidgets((prev) => [...prev, saved]);
            setLayout((prev) => [
                ...prev,
                {
                    i: saved.id.toString(),
                    x: saved.x,
                    y: saved.y,
                    w: saved.width,
                    h: saved.height,
                },
            ]);
        } catch (err) {
            console.error("❌ Failed to add widget:", err);
        }
    };

    // ✅ Update layout (dipanggil dari DashboardGrid)
    const handleLayoutChange = (newLayout: Layout[]) => {
        setLayout(newLayout);
    };

    return (
        // 2. Bungkus semua JSX dengan <ProtectedRoute>
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                {/* 🔹 Header */}
                <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm">
                    <h1 className="text-2xl font-semibold tracking-tight">📊 Dashboard</h1>
                    <button
                        onClick={() => {
                            clearAuth(); // Gunakan clearAuth
                            router.push("/");
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Logout
                    </button>
                </header>

                {/* 🔹 Konten utama */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Panel kiri */}
                    <aside className="border-r bg-card p-4 overflow-y-auto">
                        <WidgetPanel onAddWidget={addWidget} />
                    </aside>

                    {/* Area grid */}
                    <main className="flex-1 p-6 overflow-y-auto">
                        <DashboardGrid
                            layout={layout}
                            widgets={widgets}
                            setWidgets={setWidgets}
                            onLayoutChange={handleLayoutChange}
                        />
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}