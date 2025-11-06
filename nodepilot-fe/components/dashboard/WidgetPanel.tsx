"use client";
import Link from "next/link";
export default function WidgetPanel({ onAddWidget }: { onAddWidget: (type: string) => void }) {
    const widgetTypes = [
        { type: "switch", label: "Switch" },
        { type: "label", label: "Label" },
    ];

    return (
        <div className="w-64 bg-card p-4 flex flex-col space-y-3">
            <h2 className="font-bold text-lg mb-2">Add Widget</h2>
            {widgetTypes.map((w) => (
                <button
                    key={w.type}
                    onClick={() => onAddWidget(w.type)}
                    className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
                >
                    ➕ {w.label}
                </button>
            ))}
            <hr className="my-4 border-t" />
            <Link
                href="/devices"
                className="bg-gray-700 text-white rounded p-2 hover:bg-gray-600 text-center"
            >
                ⚙️ Manage Devices
            </Link>
        </div>
    );
}