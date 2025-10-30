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

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/devices", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDevices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="text-center mt-10">Loading devices...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Devices</h1>
      <ul className="space-y-3">
        {devices.map((device) => (
          <li key={device.id} className="border p-3 rounded-lg shadow-sm hover:shadow-md">
            <Link href={`/devices/${device.id}`} className="text-blue-600 hover:underline">
              {device.name}
            </Link>
            <p className="text-sm text-gray-500">Created at: {new Date(device.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
