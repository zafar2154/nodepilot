"use client";

import { useRef } from "react";
import GridLayout from "react-grid-layout";
import Widget from "./Widget";
import { useAuthStore } from "@/store/authStore";

export default function DashboardGrid({
    layout,
    widgets,
    setWidgets,
    onLayoutChange,
}: {
    layout: any[];
    widgets: any[];
    setWidgets: (updater: any) => void;
    onLayoutChange: (layout: any[]) => void;
}) {
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const { token } = useAuthStore();

    // ✅ Hapus widget
    const deleteWidget = (id: number) => {
        setWidgets((prev) => prev.filter((w) => w.id !== id));
        fetch(`http://localhost:5000/api/widgets/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        }).catch((err) => console.error("❌ Failed to delete widget:", err));
    };

    // ✅ Auto-save posisi widget ke DB dengan debounce
    const handleDebouncedLayoutChange = (newLayout: any[]) => {
        onLayoutChange(newLayout);

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            console.log("💾 Saving layout to backend...");

            newLayout.forEach((item) => {
                const widget = widgets.find((w) => w.id.toString() === item.i);
                if (widget) {
                    fetch(`http://localhost:5000/api/widgets/${widget.id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            x: item.x,
                            y: item.y,
                            width: item.w,
                            height: item.h,
                        }),
                    }).catch((err) =>
                        console.error(
                            `❌ Failed to save layout for widget ${widget.id}:`,
                            err
                        )
                    );
                }
            });
        }, 500);
    };

    return (
        <div className="p-4">
            <GridLayout
                className="layout"
                layout={layout}
                cols={12}
                rowHeight={120}
                width={1200}
                isDraggable={true}
                isResizable={true}
                draggableHandle=".drag-handle"
                onLayoutChange={handleDebouncedLayoutChange}
            >
                {Array.isArray(widgets) &&
                    widgets.map((widget) => (
                        <div
                            key={widget.id}
                            data-grid={layout.find((l) => l.i === widget.id.toString())}
                        >
                            <div
                                className="relative bg-card p-3 rounded-lg shadow-md hover:shadow-lg transition"
                                onMouseDown={(e) => {
                                    if (
                                        !(e.target as HTMLElement).classList.contains("drag-handle")
                                    ) {
                                        e.stopPropagation();
                                    }
                                }}
                            >
                                {/* Tombol hapus */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteWidget(widget.id);
                                    }}
                                    className="absolute top-1 left-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs hover:bg-red-600 z-10"
                                >
                                    ✕
                                </button>

                                {/* Drag handle ☰ */}
                                <div className="drag-handle absolute top-1 right-1 cursor-move select-none flex items-center justify-center w-6 h-6 rounded-full bg-white/80 hover:bg-white text-gray-900 font-bold shadow">
                                    ☰
                                </div>

                                {/* Isi widget */}
                                <div className="mt-4">
                                    <Widget widget={widget} setWidgets={setWidgets} />
                                </div>
                            </div>
                        </div>
                    ))}
            </GridLayout>
        </div>
    );
}
