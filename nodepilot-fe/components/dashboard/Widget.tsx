"use client";

import React, { useEffect, useState } from "react";
import SwitchWidget from "./widget/SwitchWidget";
import { useAuthStore } from "@/store/authStore";

// --- Tipe Data (Memperbaiki error 'any') ---
// Tipe ini berdasarkan model Widget di schema.prisma Anda
export interface WidgetType {
    id: number;
    name: string;
    type: string;
    deviceId: number | null;
    value?: string | null;
    x: number;
    y: number;
    width: number;
    height: number;
    userId: number;
}

// Tipe ini berdasarkan model Device di schema.prisma Anda
export interface DeviceType {
    id: number;
    name: string;
    vPin: number;
}

// --- Komponen EditableWidgetName (Dipindah ke luar) ---
// Ini memperbaiki error "Cannot create components during render"
interface EditableWidgetNameProps {
    isEditing: boolean;
    name: string;
    onNameChange: (newName: string) => void;
    onEditStart: () => void;
    onNameSave: () => void;
}

const EditableWidgetName: React.FC<EditableWidgetNameProps> = ({
    isEditing,
    name,
    onNameChange,
    onEditStart,
    onNameSave
}) => {
    if (isEditing) {
        return (
            <input
                type="text"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                onBlur={onNameSave} // Simpan saat fokus hilang
                onKeyDown={(e) => e.key === 'Enter' && onNameSave()}
                className="text-lg font-semibold text-center border rounded w-full"
                autoFocus
            />
        );
    }
    return (
        <h3
            onClick={onEditStart} // Panggil fungsi dari props
            className="text-lg font-semibold text-center cursor-pointer hover:bg-gray-100 p-1"
            title="Click to edit name"
        >
            {name || "Widget"}
        </h3>
    );
};


// --- Komponen Widget Utama ---
export default function Widget({
    widget,
    setWidgets,
}: {
    // Memperbaiki error 'any'
    widget: WidgetType;
    setWidgets: (updater: (prev: WidgetType[]) => WidgetType[]) => void;
}) {
    const ip = process.env.NEXT_PUBLIC_API;
    // Ambil 'user' untuk ID WebSocket
    const { token, user } = useAuthStore();
    const [ws, setWs] = useState<WebSocket | null>(null);
    // Memperbaiki error 'any'
    const [devices, setDevices] = useState<DeviceType[]>([]);
    const [data, setData] = useState<number | null>(null); // Data sensor adalah angka

    const [isEditingName, setIsEditingName] = useState(false);
    const [currentName, setCurrentName] = useState(widget.name || "");

    // Hubungkan ke WebSocket
    useEffect(() => {
        const WS_URL = process.env.NEXT_PUBLIC_API || `ws://${ip}}`;
        const socket = new WebSocket(WS_URL);

        socket.onopen = () => {
            // FIX: Kirim ID user yang login, bukan '1'
            if (user) {
                socket.send(JSON.stringify({ type: "register_user", userId: user.id }));
            }
        };
        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            // Backend mengirim 'id' internal, BUKAN vPin
            if (msg.type === "sensor_data" && msg.deviceId === widget.deviceId) {
                setData(msg.value); // 'msg.value' adalah angka (misal: 28)
            }
        };

        // FIX: Menangani warning ESLint 'set-state-in-effect'
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setWs(socket);

        return () => socket.close();
        // Tambahkan 'user' sebagai dependency
    }, [widget.deviceId, user]);

    // Ambil daftar device user
    useEffect(() => {
        if (!token) return;

        fetch(`http://${ip}/api/devices`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            // Memberi tipe pada data yang diterima
            .then((data: DeviceType[] | { error: string }) => {
                if (Array.isArray(data)) {
                    setDevices(data);
                } else {
                    console.error("Failed to fetch devices:", data);
                    setDevices([]); // Mencegah error .map
                }
            })
            .catch((err) => {
                console.error("❌ Error fetching devices:", err);
                setDevices([]); // Mencegah error .map
            });
    }, [token]);

    // FIX: 'deviceId' dari <select> adalah string
    const updateDevice = async (deviceIdStr: string) => {
        const newDeviceId = deviceIdStr ? Number(deviceIdStr) : null;

        setWidgets((prev: WidgetType[]) =>
            prev.map((w) =>
                w.id === widget.id ? { ...w, deviceId: newDeviceId } : w
            )
        );
        try {
            await fetch(`http://${ip}/api/widgets/${widget.id}/device`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ deviceId: newDeviceId }),
            });
            console.log(`✅ Widget ${widget.id} bound to device ${newDeviceId}`);
        } catch (err) {
            console.error("❌ Failed to update widget device:", err);
        }
    };

    // Fungsi simpan nama (sudah OK)
    const handleNameSave = async () => {
        setIsEditingName(false);
        if (currentName === widget.name) return;

        setWidgets((prev: WidgetType[]) =>
            prev.map((w) =>
                w.id === widget.id ? { ...w, name: currentName } : w
            )
        );

        try {
            await fetch(`http://${ip}/api/widgets/${widget.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: currentName }),
            });
        } catch (err) {
            console.error("❌ Failed to update widget name:", err);
            setWidgets((prev: WidgetType[]) =>
                prev.map((w) =>
                    w.id === widget.id ? { ...w, name: widget.name } : w
                )
            );
        }
    };


    // Render per jenis widget
    switch (widget.type) {
        case "switch":
            return (
                <div className="p-4 border rounded-lg bg-card shadow-md flex flex-col items-center justify-center space-y-2">
                    <EditableWidgetName
                        isEditing={isEditingName}
                        name={currentName}
                        onNameChange={setCurrentName}
                        onEditStart={() => setIsEditingName(true)}
                        onNameSave={handleNameSave}
                    />

                    {/* FIX: Cek deviceId dan kirim props yang benar */}
                    {widget.deviceId ? (
                        <SwitchWidget
                            ws={ws}
                            // Kirim ID internal (database)
                            deviceId={widget.deviceId}
                            // Data 'on'/'off' berasal dari state (1.0 atau 0.0)
                            isOn={data === 1}
                        />
                    ) : (
                        <p className="text-sm text-gray-400 p-2">Select a device</p>
                    )}

                    <select
                        value={widget.deviceId || ""}
                        onChange={(e) => updateDevice(e.target.value)}
                        className="border rounded p-1 text-sm"
                    >
                        <option value="">Select Device</option>
                        {/* Memperbaiki error 'any' 'd' */}
                        {devices.map((d: DeviceType) => (
                            <option key={d.id} value={d.id}>
                                [V{d.vPin}] {d.name}
                            </option>
                        ))}
                    </select>
                </div>
            );

        case "label":
            return (
                <div className="p-4 border rounded-lg bg-card shadow-md text-center space-y-2">
                    <EditableWidgetName
                        isEditing={isEditingName}
                        name={currentName}
                        onNameChange={setCurrentName}
                        onEditStart={() => setIsEditingName(true)}
                        onNameSave={handleNameSave}
                    />

                    <select
                        value={widget.deviceId || ""}
                        // FIX: 'e.target.value' adalah string
                        onChange={(e) => updateDevice(e.target.value)}
                        className="border rounded p-1 text-sm"
                    >
                        <option value="">Select Device</option>
                        {/* Memperbaiki error 'any' 'd' */}
                        {devices.map((d: DeviceType) => (
                            <option key={d.id} value={d.id}>
                                [V{d.vPin}] {d.name}
                            </option>
                        ))}
                    </select>

                    {data !== null ? (
                        <div>
                            <p className="text-3xl font-bold">{data}</p>
                        </div>
                    ) : (
                        <p className="text-gray-400">Waiting for data...</p>
                    )}
                </div>
            );

        case "chart":
            return (
                <div className="p-4 border rounded-lg bg-card shadow-md text-center">
                    <EditableWidgetName
                        isEditing={isEditingName}
                        name={currentName}
                        onNameChange={setCurrentName}
                        onEditStart={() => setIsEditingName(true)}
                        onNameSave={handleNameSave}
                    />
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

