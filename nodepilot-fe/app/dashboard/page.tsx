"use client";

import React, { useState } from "react";
import WidgetPanel from "@/components/dashboard/WidgetPanel";
import DashboardGrid from "@/components/dashboard/DashboardGrid";

export default function DashboardPage() {
    const [widgets, setWidgets] = useState<any[]>([]);
    const [layout, setLayout] = useState<any[]>([]);
    const [editMode, setEditMode] = useState(true); // 🔥 mode edit/normal

    const addWidget = (type: string) => {
        const id = Date.now().toString();
        const newWidget = {
            id,
            type,
            deviceId: 1,
            layout: { x: 0, y: Infinity, w: 3, h: 2 },
        };
        setWidgets([...widgets, newWidget]);
        setLayout([...layout, { i: id, x: 0, y: 0, w: 3, h: 2 }]);
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <WidgetPanel onAddWidget={addWidget} />
            <div className="flex-1">
                <div className="p-3 flex justify-between items-center border-b">
                    <h1 className="text-xl font-bold">Dashboard</h1>
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className={`px-3 py-2 rounded text-sm ${editMode ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                            }`}
                    >
                        {editMode ? "Editing" : "Control Mode"}
                    </button>
                </div>
                <DashboardGrid
                    layout={layout}
                    widgets={widgets}
                    onLayoutChange={setLayout}
                    editMode={editMode} // 🔥 kirim ke grid
                />
            </div>
        </div>
    );
}
