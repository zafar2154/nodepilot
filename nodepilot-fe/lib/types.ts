// Berdasarkan schema.prisma Anda

/**
 * Tipe data untuk User, sesuai dengan yang dikirim dari backend
 */
export interface User {
  id: number;
  email: string;
}

/**
 * Tipe data untuk Device (Sensor/Aktor)
 */
export interface Device {
  id: number; // ID internal database (misal: 1, 2, 3)
  name: string;
  vPin: number; // "Virtual Pin" yang bisa diedit (misal: 5, 10)
  userId: number;
  status: string; // "on" atau "off"
  createdAt: string;
}

/**
 * Tipe data untuk Widget di dashboard
 */
export interface Widget {
  id: number;
  name: string;
  type: 'switch' | 'label' | 'chart'; // Tipe widget yang diizinkan
  deviceId: number | null; // ID internal dari Device yang terhubung
  value?: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
  userId: number;
}
