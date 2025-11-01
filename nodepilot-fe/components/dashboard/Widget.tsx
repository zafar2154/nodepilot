"use client";

import React, { useEffect, useState } from "react";
import SwitchWidget from "./widget/SwitchWidget";

export default function Widget({ widget }: { widget: any }) {
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:5000");
        socket.onopen = () => {
            socket.send(JSON.stringify({ type: "register_user", userId: 1 }));
        };
        setWs(socket);

        return () => socket.close();
    }, []);

    // Render berbagai jenis widget
    switch (widget.type) {
        case "switch":
            return (
                <div className="p-4 border rounded-lg bg-card shadow-md flex items-center justify-center">
                    <SwitchWidget ws={ws} deviceId={widget.deviceId} />
                </div>
            );

        case "label":
            return (
                <div className="p-4 border rounded-lg bg-card shadow-md text-center">
                    <h3 className="text-lg">{widget.label || "Value"}</h3>
                    <p className="text-3xl font-bold">42</p>
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
