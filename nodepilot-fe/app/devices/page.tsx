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
    // ... (fungsi ini sudah ada)
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
    // ... (fungsi ini sudah ada)
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

  // 1. Tambahkan fungsi ini
  const handleDeleteDevice = async (id: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this device and all its data? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/devices/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchDevices(); // Refresh daftar device
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete device");
      }
    } catch (err) {
      alert("An error occurred while deleting the device.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading devices...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Devices</h1>

      {/* Form Add Device (sudah ada) */}
      <form onSubmit={handleAddDevice} className="flex gap-2 mb-6">
        {/* ... (isi form) ... */}
      </form>

      {/* List Devices */}
      <ul className="space-y-3">
        {devices.map((device) => (
          <li
            key={device.id}
            className="border p-3 rounded-lg shadow-sm hover:shadow-md flex justify-between items-center"
          >
            <div>
              <Link
                href={`/devices/${device.id}`}
                className="text-blue-600 hover:underline"
              >
                {device.name}
              </Link>
              <p className="text-sm text-gray-500">
                Created at: {new Date(device.createdAt).toLocaleString()}
              </p>
            </div>

            {/* 2. Tambahkan tombol delete di sini */}
            <button
              onClick={() => handleDeleteDevice(device.id)}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}