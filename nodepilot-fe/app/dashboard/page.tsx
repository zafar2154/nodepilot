"use client";

import { useEffect, useState } from "react";
import WidgetPanel from "@/components/dashboard/WidgetPanel";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
    const { token } = useAuthStore();
    const [widgets, setWidgets] = useState<any[]>([]);
    const [layout, setLayout] = useState<any[]>([]);

    // ✅ Ambil semua widget user
    useEffect(() => {
        if (!token) return;
        fetch("http://localhost:5000/api/widgets", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (!Array.isArray(data)) return;
                setWidgets(data);
                setLayout(
                    data.map((w: any) => ({
                        i: w.id.toString(),
                        x: w.x || 0,
                        y: w.y || 0,
                        w: w.width || 2,
                        h: w.height || 2,
                    }))
                );
            })
            .catch((err) => console.error("❌ Failed to fetch widgets:", err));
    }, [token]);

    // ✅ Tambah widget baru
    const addWidget = async (type: string) => {
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
            const res = await fetch("http://localhost:5000/api/widgets", {
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
    const handleLayoutChange = (newLayout: any[]) => {
        setLayout(newLayout);
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <WidgetPanel onAddWidget={addWidget} />
            <div className="flex-1 p-4">
                <DashboardGrid
                    layout={layout}
                    widgets={widgets}
                    setWidgets={setWidgets}
                    onLayoutChange={handleLayoutChange}
                />
            </div>
        </div>
    );
}
