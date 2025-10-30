"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useParams } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DeviceData {
  id: number;
  value: number;
  createdAt: string;
}

export default function DeviceDetailPage() {
  const { id } = useParams();
  const { token } = useAuthStore();
  const [data, setData] = useState<DeviceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(`http://localhost:5000/api/devices/${id}/data`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.reverse()); // urut dari lama ke baru
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, token]);

  if (loading) return <p className="text-center mt-10">Loading device data...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Device {id} Data</h1>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="createdAt"
            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleString()}
          />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
