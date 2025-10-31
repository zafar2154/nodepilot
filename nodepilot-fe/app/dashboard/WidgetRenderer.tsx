"use client";

export default function WidgetRenderer({ type }: { type: string }) {
    switch (type) {
        case "button":
            return <button className="bg-blue-500 text-white px-3 py-2 rounded">Button</button>;
        case "switch":
            return (
                <label className="flex items-center space-x-2">
                    <input type="checkbox" className="toggle" />
                    <span>Switch</span>
                </label>
            );
        case "label":
            return <p className="text-xl font-bold text-center">123</p>;
        case "chart":
            return <div className="border h-32 bg-gray-50 flex items-center justify-center">📊 Chart</div>;
        default:
            return null;
    }
}
