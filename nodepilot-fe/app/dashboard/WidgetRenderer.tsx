"use client";
import SwitchWidget from "@/components/SwitchWidget";
export default function WidgetRenderer({ type, ws }: { type: string; ws: WebSocket }) {
    switch (type) {
        case "button":
            return (
                <button
                    onClick={() => {
                        ws.send(JSON.stringify({
                            type: "set_device_state",
                            deviceId: 1,
                            value: "on",
                        }));
                    }}
                    className="bg-green-500 text-white px-3 py-2 rounded"
                >
                    Turn On LED
                </button>
            );
        case "switch":
            return (
                <label className="flex items-center space-x-2">
                    <SwitchWidget ws={ws} deviceId={1} />
                </label>
            );
        default:
            return null;
    }
}
