"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation"; // <-- Impor useRouter

interface Device {
  id: number;
  vPin: number;
  name: string;
  createdAt: string;
}

export default function DeviceListPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newVPin, setNewVPin] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingVPin, setEditingVPin] = useState("");

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
    if (!newName.trim() || !newVPin.trim()) {
      alert("Name and vPin are required");
      return;
    }

    await fetch("http://localhost:5000/api/devices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newName, vPin: Number(newVPin) }),
    });

    setNewName("");
    setNewVPin("");
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

  // Panggil saat tombol "Edit" diklik
  const startEditing = (device: Device) => {
    setEditingId(device.id);
    setEditingName(device.name);
    setEditingVPin(String(device.vPin));
  };

  // Panggil saat tombol "Cancel" diklik
  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
    setEditingVPin("");
  };

  // Panggil saat tombol "Save" diklik
  const handleUpdateDevice = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/devices/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editingName, vPin: Number(editingVPin) }),
      });

      if (res.ok) {
        cancelEditing(); // Keluar dari mode edit
        fetchDevices(); // Refresh data
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update device");
      }
    } catch (err) {
      alert("An error occurred");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading devices...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => router.push('/dashboard')}
        className="text-blue-600 hover:underline mb-4"
      >
        &larr; Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-4">Manage My Devices</h1>

      {/* Form Add Device */}
      <form onSubmit={handleAddDevice} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New device name"
          className="border p-2 rounded w-3/4"
        />
        <input
          type="number"
          value={newVPin}
          onChange={(e) => setNewVPin(e.target.value)}
          placeholder="vPin"
          className="border p-2 rounded w-1/4"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>

      {/* List Devices */}
      {/* List Devices */}
      <ul className="space-y-3">
        {devices.map((device) => (
          <li key={device.id} className="border p-3 rounded-lg shadow-sm">
            {editingId === device.id ? (
              // Mode Edit
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <input
                  type="number"
                  value={editingVPin}
                  onChange={(e) => setEditingVPin(e.target.value)}
                  className="border p-2 rounded w-full"
                  placeholder="vPin"
                />
                <div className="flex gap-2">
                  {/* --- TOMBOL SAVE & CANCEL (DIKEMBALIKAN) --- */}
                  <button
                    onClick={() => handleUpdateDevice(device.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Mode Tampilan Normal
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-bold text-blue-600 mr-2">[V{device.vPin}]</span>
                  <Link
                    href={`/devices/${device.id}`}
                    className="font-semibold hover:underline"
                  >
                    {device.name}
                  </Link>
                  <p className="text-sm text-gray-500">
                    Internal ID: {device.id} | Created: {new Date(device.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {/* --- TOMBOL EDIT & DELETE (DIKEMBALIKAN) --- */}
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(device)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteDevice(device.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}