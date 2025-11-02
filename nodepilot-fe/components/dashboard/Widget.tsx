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
    const [data, setData] = useState<any>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [currentName, setCurrentName] = useState(widget.name || "");

    // Hubungkan ke WebSocket
    useEffect(() => {
        const socket = new WebSocket("ws://localhost:5000");
        socket.onopen = () => {
            socket.send(JSON.stringify({ type: "register_user", userId: 1 }));
        };
        socket.onmessage = (event) => {
            console.log("📡 WebSocket message:", event.data);

            const msg = JSON.parse(event.data);
            console.log("🧠 Device compare:", msg.deviceId, widget.deviceId);
            if (msg.type === "sensor_data" && msg.deviceId === widget.deviceId) {
                setData(msg.value); // 'msg.value' sekarang adalah angka (misal: 28)
            }
        };
        setWs(socket);

        return () => socket.close();
    }, [widget.deviceId]);

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

    const updateDevice = async (deviceId: number) => {
        setWidgets((prev) =>
            prev.map((w) =>
                w.id === widget.id ? { ...w, deviceId: Number(deviceId) } : w
            )
        );
        // Update ke backend supaya tersimpan di database
        try {
            await fetch(`http://localhost:5000/api/widgets/${widget.id}/device`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ deviceId }),
            });
            console.log(`✅ Widget ${widget.id} bound to device ${deviceId}`);
        } catch (err) {
            console.error("❌ Failed to update widget device:", err);
        }
    };
    const handleNameSave = async () => {
        setIsEditingName(false);
        if (currentName === widget.name) return; // Tidak ada perubahan

        // Update state di frontend
        setWidgets((prev) =>
            prev.map((w) =>
                w.id === widget.id ? { ...w, name: currentName } : w
            )
        );

        // Kirim ke backend
        try {
            await fetch(`http://localhost:5000/api/widgets/${widget.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: currentName }),
            });
        } catch (err) {
            console.error("❌ Failed to update widget name:", err);
            // Rollback jika gagal (opsional)
            setWidgets((prev) =>
                prev.map((w) =>
                    w.id === widget.id ? { ...w, name: widget.name } : w
                )
            );
        }
    };

    // --- Komponen kecil untuk Judul yang bisa di-edit ---
    const EditableWidgetName = () => {
        if (isEditingName) {
            return (
                <input
                    type="text"
                    value={currentName}
                    onChange={(e) => setCurrentName(e.target.value)}
                    onBlur={handleNameSave} // Simpan saat fokus hilang
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                    className="text-lg font-semibold text-center border rounded w-full"
                    autoFocus
                />
            );
        }
        return (
            <h3
                onClick={() => setIsEditingName(true)}
                className="text-lg font-semibold text-center cursor-pointer hover:bg-gray-100 p-1"
                title="Click to edit name"
            >
                {currentName || "Widget"}
            </h3>
        );
    };

    // Render per jenis widget
    switch (widget.type) {
        case "switch":
            return (
                <div className="p-4 border rounded-lg bg-card shadow-md flex flex-col items-center justify-center space-y-2">
                    <EditableWidgetName /> {/* <-- Gunakan komponen baru */}
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
                <div className="p-4 border rounded-lg bg-card shadow-md text-center space-y-2">
                    <h3 className="text-lg font-semibold">{widget.label || "Sensor Data"}</h3>
                    <EditableWidgetName /> {/* <-- Gunakan komponen baru */}
                    {/* 🔽 Dropdown pilih device (sudah benar) */}
                    <select
                        value={widget.deviceId || ""}
                        onChange={(e) => updateDevice(Number(e.target.value))}
                        className="border rounded p-1 text-sm"
                    >
                        <option value="">Select Device</option>
                        {devices.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.name}
                            </option>
                        ))}
                    </select>

                    {/* 3. Ubah cara tampil data (jauh lebih simpel) */}
                    {data !== null ? (
                        <div>
                            <p className="text-3xl font-bold">{data}</p>
                        </div>
                    ) : (
                        <p className="text-gray-400">Waiting for data...</p>
                    )}
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
