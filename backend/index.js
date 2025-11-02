import app from './app.js';
import 'dotenv/config';
import { WebSocketServer } from 'ws';
import http from 'http';

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

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      console.log('📩 Received:', data);

      // Register device (ESP32)
      if (data.type === 'register_device') {
        clients.devices.set(data.deviceId, ws);
        ws.deviceId = data.deviceId;
        console.log(`📡 Device ${data.deviceId} registered`);
      }

      // Register user (frontend dashboard)
      else if (data.type === 'register_user') {
        clients.users.set(data.userId, ws);
        ws.userId = data.userId;
        console.log(`👤 User ${data.userId} registered`);
      }

      // Data sensor dari ESP32
      else if (data.type === 'sensor_data') {
        console.log(`🌡️ Data from Device ${data.deviceId}:`, data.value);
        for (const [id, userWs] of clients.users) {
          if (userWs.readyState === 1) {
            userWs.send(JSON.stringify(data));
          }
        }
      }

      // Command dari user ke ESP32
      else if (data.type === 'set_device_state') {
        const target = clients.devices.get(data.deviceId);
        if (target && target.readyState === 1) {
          target.send(JSON.stringify(data));
          console.log(`🚀 Sent command to device ${data.deviceId}`);
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
