"use client";

import React, { useEffect, useRef } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import Widget from "./Widget";

interface DashboardGridProps {
    layout: Layout[];
    widgets: any[];
    onLayoutChange: (layout: Layout[]) => void;
    editMode: boolean;
    setWidgets: (updater: (prev: any[]) => any[]) => void;
}

export default function DashboardGrid({
    layout,
    widgets,
    onLayoutChange,
    editMode,
    setWidgets,
}: DashboardGridProps) {
    const saveTimeout = useRef<NodeJS.Timeout | null>(null);

    // Auto-save ke backend
    const autoSave = async (updatedWidgets: any[]) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        await fetch("http://localhost:5000/api/widgets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ widgets: updatedWidgets }),
        });
        console.log("💾 Dashboard auto-saved");
    };

    const handleLayoutChange = (newLayout: Layout[]) => {
        onLayoutChange(newLayout);

        // Update posisi di state
        const updatedWidgets = widgets.map((w) => {
            const found = newLayout.find((l) => l.i === w.id.toString());
            return found
                ? { ...w, x: found.x, y: found.y, width: found.w, height: found.h }
                : w;
        });

        setWidgets(updatedWidgets);

        // Debounce auto-save biar tidak sering request
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => {
            autoSave(updatedWidgets);
        }, 1000);
    };

    return (
        <div className="p-4">
            <GridLayout
                className="layout"
                layout={layout}
                cols={12}
                rowHeight={100}
                width={1200}
                margin={[16, 16]}
                isDraggable={editMode}
                isResizable={editMode}
                onLayoutChange={handleLayoutChange}
            >
                {widgets.map((widget) => {
                    const gridData = {
                        i: widget.id.toString(),
                        x: widget.x ?? 0,
                        y: widget.y ?? 0,
                        w: widget.width ?? 3,
                        h: widget.height ?? 2,
                    };
                    return (
                        <div key={gridData.i} data-grid={gridData}>
                            <Widget widget={widget} setWidgets={setWidgets} />
                        </div>
                    );
                })}
            </GridLayout>
        </div>
    );
}
