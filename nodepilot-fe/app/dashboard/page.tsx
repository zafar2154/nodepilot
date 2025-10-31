"use client";

import { useState } from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import WidgetBox from "./WidgetBox";
import WidgetRenderer from "./WidgetRenderer";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function DashboardPage() {
    const [layout, setLayout] = useState<any[]>([]);
    const [widgets, setWidgets] = useState<{ id: string; type: string }[]>([]);
    const [editMode, setEditMode] = useState(true);

    const addWidget = (type: string) => {
        const id = Date.now().toString();
        setWidgets([...widgets, { id, type }]);
        setLayout([
            ...layout,
            { i: id, x: 0, y: Infinity, w: 3, h: 2 },
        ]);
    };

    return (
        <div className="flex">
            <WidgetBox onAdd={addWidget} />

            <div className="flex-1 p-4 bg-gray-100 min-h-screen">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">My Dashboard</h1>
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className={`px-4 py-2 rounded ${editMode ? "bg-green-600 text-white" : "bg-gray-300"
                            }`}
                    >
                        {editMode ? "Done Editing" : "Edit Layout"}
                    </button>
                </div>

                <ResponsiveGridLayout
                    className="layout"
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    rowHeight={80}
                    layouts={{ lg: layout }}
                    isDraggable={editMode}
                    isResizable={editMode}
                    onLayoutChange={(newLayout) => setLayout(newLayout)}
                >
                    {widgets.map((w) => (
                        <div
                            key={w.id}
                            data-grid={layout.find((l) => l.i === w.id)}
                            className="bg-white shadow rounded flex items-center justify-center"
                        >
                            <WidgetRenderer type={w.type} />
                        </div>
                    ))}
                </ResponsiveGridLayout>
            </div>
        </div>
    );
}
