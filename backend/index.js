import app from './app.js';
import 'dotenv/config';
import { WebSocketServer } from 'ws';
import http from 'http';
import { PrismaClient } from '@prisma/client'; // <-- 1. Impor Prisma

const prisma = new PrismaClient(); // <-- 2. Buat instance Prisma
const PORT = process.env.PORT || 5000;

// Buat HTTP server dari Express
const server = http.createServer(app);

// Buat WebSocket server di atas HTTP yang sama
const wss = new WebSocketServer({ server });

// Simpan koneksi client (ESP32 dan user)
const clients = {
  devices: new Map(),
  users: new Map(),
};

wss.on('connection', (ws) => {
  console.log('⚡ New WebSocket connection');

  ws.on('message', async (msg) => {
    try {
      const data = JSON.parse(msg);
      console.log('📩 Received:', data);

      // Register device (ESP32)
      if (data.type === 'register_device') {
        const vPin = data.deviceId;
        clients.devices.set(vPin, ws); // <-- Gunakan vPin sebagai Kunci
        ws.deviceId = vPin; // Simpan vPin di koneksi ws
        console.log(`📡 Device with vPin ${vPin} registered`);
      }

      // Register user (frontend dashboard)
      else if (data.type === 'register_user') {
        clients.users.set(data.userId, ws);
        ws.userId = data.userId;
        console.log(`👤 User ${data.userId} registered`);
      }

      // Data sensor dari ESP32
      else if (data.type === 'sensor_data') {
        const vPin = data.deviceId; // Ini adalah vPin (misal: 50)
        const value = data.value;

        // 1. Cari internal 'id' berdasarkan 'vPin'
        const device = await prisma.device.findUnique({
          where: { vPin: vPin },
          select: { id: true }, // Hanya butuh 'id'
        });

        if (device) {
          // 2. Simpan ke DB menggunakan internal 'id'
          await prisma.deviceData.create({
            data: { value: value, deviceId: device.id },
          });

          // 3. Broadcast ke frontend MENGGUNAKAN internal 'id'
          //    (Frontend Widget.tsx terhubung ke internal 'id')
          const forwardData = JSON.stringify({
            type: 'sensor_data',
            deviceId: device.id, // <-- Kirim internal 'id', BUKAN vPin
            value: value,
          });

          for (const [id, userWs] of clients.users) {
            if (userWs.readyState === 1) {
              userWs.send(forwardData);
            }
          }
        } else {
          console.warn(`⚠️ Received data for unknown vPin: ${vPin}`);
        }
      }

      // Command dari user ke ESP32
      else if (data.type === 'set_device_state') {
        const internalId = data.deviceId;

        // 1. Cari 'vPin' berdasarkan internal 'id'
        const device = await prisma.device.findUnique({
          where: { id: internalId },
          select: { vPin: true },
        });
        if (device) {
          // 2. Cari koneksi ESP32 menggunakan 'vPin'
          const target = clients.devices.get(device.vPin);
          if (target && target.readyState === 1) {
            // 3. Kirim data ke ESP32 (ESP32 hanya mengerti vPin)
            const forwardData = JSON.stringify({
              type: 'set_device_state',
              deviceId: device.vPin, // <-- Kirim vPin, BUKAN internal 'id'
              value: data.value,
            });
            target.send(forwardData);
            console.log(`🚀 Sent command to device with vPin ${device.vPin}`);
          }
        }
      }
    } catch (err) {
      console.error('Error handling message:', err);
    }
  });

  ws.on('close', () => {
    if (ws.deviceId) clients.devices.delete(ws.deviceId);
    if (ws.userId) clients.users.delete(ws.userId);
    console.log('❌ Connection closed');
  });
});

// Jalankan server gabungan
server.listen(PORT, () => {
  console.log(`✅ Server + WebSocket running at http://localhost:${PORT}`);
});
