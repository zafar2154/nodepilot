"use client";

import React, { useEffect, useState } from "react";
import WidgetPanel from "@/components/dashboard/WidgetPanel";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
    const { token } = useAuthStore();
    const [widgets, setWidgets] = useState<any[]>([]);
    const [layout, setLayout] = useState<any[]>([]);
    const [editMode, setEditMode] = useState(true);

    // Ambil data dashboard user dari backend
    useEffect(() => {
        if (!token) return;
        fetch("http://localhost:5000/api/widgets", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setWidgets(data);
                setLayout(
                    data.map((w: any) => ({
                        i: w.id.toString(),
                        x: w.x,
                        y: w.y,
                        w: w.width,
                        h: w.height,
                    }))
                );
            })
            .catch((err) => console.error("Failed to load widgets", err));
    }, [token]);

    // Tambah widget baru dari panel kiri
    const addWidget = (type: string) => {
        const id = Date.now();
        const newWidget = {
            id,
            type,
            name: `${type}-${id}`,
            label: type,
            deviceId: null,
            x: 0,
            y: 0,
            width: 3,
            height: 2,
        };
        setWidgets((prev) => [...prev, newWidget]);
        setLayout((prev) => [
            ...prev,
            { i: id.toString(), x: 0, y: Infinity, w: 3, h: 2 },
        ]);
    };

    // Simpan layout & binding ke DB
    const saveDashboard = async () => {
        await fetch("http://localhost:5000/api/widgets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ widgets }),
        });
        alert("✅ Dashboard saved!");
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <WidgetPanel onAddWidget={addWidget} />
            <div className="flex-1">
                <div className="p-3 flex justify-between items-center border-b">
                    <h1 className="text-xl font-bold">My Dashboard</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setEditMode(!editMode)}
                            className={`px-3 py-2 rounded text-sm ${editMode ? "bg-blue-500 text-white" : "bg-gray-200"
                                }`}
                        >
                            {editMode ? "Editing" : "Control Mode"}
                        </button>
                        <button
                            onClick={saveDashboard}
                            className="px-3 py-2 bg-green-500 text-white rounded"
                        >
                            💾 Save
                        </button>
                    </div>
                </div>

                <DashboardGrid
                    layout={layout}
                    widgets={widgets}
                    onLayoutChange={setLayout}
                    editMode={editMode}
                    setWidgets={setWidgets}
                />
            </div>
        </div>
    );
}
