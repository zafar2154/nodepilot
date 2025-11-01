"use client";

import React from "react";

const availableWidgets = [
    { type: "switch", label: "Switch" },
    { type: "label", label: "Label" },
    { type: "chart", label: "Chart" },
];

export default function WidgetPanel({ onAddWidget }: { onAddWidget: (type: string) => void }) {
    return (
        <div className="p-4 border-r bg-muted flex flex-col gap-2">
            <h2 className="font-bold mb-2">Widgets</h2>
            {availableWidgets.map((w) => (
                <button
                    key={w.type}
                    onClick={() => onAddWidget(w.type)}
                    className="border p-2 rounded hover:bg-accent"
                >
                    ➕ {w.label}
                </button>
            ))}
        </div>
    );
}
