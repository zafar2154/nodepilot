"use client";

import { useState, useEffect } from "react";

interface SwitchWidgetProps {
    ws: WebSocket | null;
    deviceId: number | null;
}

export default function SwitchWidget({ ws, deviceId }: SwitchWidgetProps) {
    const [isOn, setIsOn] = useState(false);

    const toggleSwitch = () => {
        const newState = !isOn;
        setIsOn(newState);

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(
                JSON.stringify({
                    type: "set_device_state",
                    deviceId,
                    value: newState ? "on" : "off",
                })
            );
        }
    };

    // Update dari ESP32 secara realtime
    useEffect(() => {
        if (!ws) return;
        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === "sensor_update" && msg.deviceId === deviceId) {
                if (msg.value.ledState !== undefined) {
                    setIsOn(msg.value.ledState === "on");
                }
            }
        };
    }, [ws]);

    return (
        <div className="flex flex-col items-center space-y-2 select-none">
            <button
                onClick={toggleSwitch}
                className={`relative w-14 h-8 rounded-full transition-all duration-300 ${isOn ? "bg-green-500" : "bg-gray-500"
                    }`}
            >
                <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isOn ? "translate-x-6" : ""
                        }`}
                />
            </button>
        </div>
    );
}
