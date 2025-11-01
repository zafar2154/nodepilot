"use client";

import React, { useEffect, useState } from "react";
import SwitchWidget from "./widget/SwitchWidget";
import { useAuthStore } from "@/store/authStore";


export default function Widget({
    widget,
    setWidgets,
}: {
    widget: any;
    setWidgets: (updater: (prev: any[]) => any[]) => void;
}) {
    const { token } = useAuthStore(); // ✅ ambil token dari global store

    const [ws, setWs] = useState<WebSocket | null>(null);
    const [devices, setDevices] = useState<any[]>([]);

    // Hubungkan ke WebSocket
    useEffect(() => {
        const socket = new WebSocket("ws://localhost:5000");
        socket.onopen = () => {
            socket.send(JSON.stringify({ type: "register_user", userId: 1 }));
        };
        setWs(socket);

        return () => socket.close();
    }, []);

    // Ambil daftar device user
    useEffect(() => {
        if (!token) return; // pastikan token ada

        fetch("http://localhost:5000/api/devices", {
            headers: { Authorization: `Bearer ${token}` }, // ✅ sama seperti /devices
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("📦 Devices response:", data);
                setDevices(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.error("❌ Error fetching devices:", err));
    }, [token]);


    const updateDevice = (deviceId: number) => {
        setWidgets((prev) =>
            prev.map((w) =>
                w.id === widget.id ? { ...w, deviceId: Number(deviceId) } : w
            )
        );
    };

    // Render per jenis widget
    switch (widget.type) {
        case "switch":
            return (
                <div className="p-4 border rounded-lg bg-card shadow-md flex flex-col items-center justify-center space-y-2">
                    <SwitchWidget ws={ws} deviceId={widget.deviceId} />
                    <select
                        value={widget.deviceId || ""}
                        onChange={(e) => updateDevice(e.target.value)}
                        className="border rounded p-1 text-sm"
                    >
                        <option value="">Select Device</option>
                        {devices.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                </div>
            );

        case "label":
            return (
                <div className="p-4 border rounded-lg bg-card shadow-md text-center">
                    <h3 className="text-lg">{widget.label || "Label"}</h3>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        42
                    </p>
                </div>
            );

        case "chart":
            return (
                <div className="p-4 border rounded-lg bg-card shadow-md text-center">
                    <h3 className="text-lg font-semibold mb-2">Chart (coming soon)</h3>
                    <p className="text-gray-500">Realtime data graph</p>
                </div>
            );

        default:
            return (
                <div className="p-4 border rounded-lg bg-card shadow-md flex items-center justify-center">
                    Unknown Widget
                </div>
            );
    }
}
