"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

interface Device {
  id: number;
  name: string;
  createdAt: string;
}

export default function DeviceListPage() {
  const { token } = useAuthStore();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDevice, setNewDevice] = useState("");

  const fetchDevices = () => {
    if (!token) return;
    fetch("http://localhost:5000/api/devices", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched devices:", data);
        setDevices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchDevices();
  }, [token]);

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevice.trim()) return;

    await fetch("http://localhost:5000/api/devices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newDevice }),
    });

    setNewDevice("");
    fetchDevices();
  };

  if (loading) return <p className="text-center mt-10">Loading devices...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Devices</h1>

      {/* Form Add Device */}
      <form onSubmit={handleAddDevice} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newDevice}
          onChange={(e) => setNewDevice(e.target.value)}
          placeholder="Device name"
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>

      {/* List Devices */}
      <ul className="space-y-3">
        {devices.map((device) => (
          <li
            key={device.id}
            className="border p-3 rounded-lg shadow-sm hover:shadow-md"
          >
            <Link
              href={`/devices/${device.id}`}
              className="text-blue-600 hover:underline"
            >
              {device.name}
            </Link>
            <p className="text-sm text-gray-500">
              Created at: {new Date(device.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
