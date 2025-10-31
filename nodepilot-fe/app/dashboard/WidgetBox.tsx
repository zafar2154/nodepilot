"use client";

export default function WidgetBox({ onAdd }: { onAdd: (type: string) => void }) {
    const widgets = [
        { type: "button", label: "Button" },
        { type: "switch", label: "Switch" },
        { type: "label", label: "Label" },
        { type: "chart", label: "Chart" },
    ];

    return (
        <div className="p-4 border-r w-64 bg-white h-screen overflow-y-auto">
            <h2 className="font-bold text-lg mb-4">Widget Box</h2>
            {widgets.map((w) => (
                <div
                    key={w.type}
                    className="border p-2 mb-2 rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => onAdd(w.type)}
                >
                    {w.label}
                </div>
            ))}
        </div>
    );
}
