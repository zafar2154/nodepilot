# NodePilot — IoT Realtime Dashboard

NodePilot adalah sistem **Dashboard IoT Realtime** yang memungkinkan pengguna memantau dan mengontrol perangkat (seperti ESP32) secara langsung melalui WebSocket.  
Aplikasi ini dibangun menggunakan **Next.js (frontend)** dan **Express + Prisma (backend)** dengan dukungan **autentikasi JWT** dan **manajemen widget dinamis**.

---

## 🚀 Fitur Utama

- 🔐 **Autentikasi JWT**
  - Register, login, dan logout dengan proteksi halaman dashboard.
- ⚙️ **Manajemen Widget**
  - Tambah, hapus, dan pindahkan widget (drag & drop layout).
  - Jenis widget: `Switch`, `Label`, dan `Chart`.
- 📡 **Realtime Data (WebSocket)**
  - Menampilkan data sensor dari ESP32 secara langsung.
  - Komunikasi dua arah (frontend ↔ backend ↔ device).
- 💡 **Manajemen Device**
  - Tambah, pilih, atau hapus device langsung dari dropdown widget.
- 💾 **Backend REST API**
  - CRUD untuk `users`, `devices`, dan `widgets` via Express + Prisma ORM.

---

## 🛠️ Teknologi yang Digunakan
- **Frontend** = Next.js 14 (App Router), TailwindCSS 
- **Backend** = Express.js, Prisma ORM  
- **Database** = SQLite (default) / MySQL
- **Auth** | JWT (jsonwebtoken, bcryptjs) 
- **Realtime** | WebSocket (`ws`)
- **IoT Device** | ESP32 (Arduino WebSocket Client)
---


## Installation

### 1️⃣ Clone Repository

```bash
https://github.com/zafar2154/nodepilot.git
```
### 2️⃣ Setup Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```
Server backend berjalan di: http://localhost:5000

### 3️⃣ Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Akses frontend di: http://localhost:3000

### code esp32
```bash
https://github.com/zafar2154/nodepilot-esp32.git
```

## License

[MIT](https://choosealicense.com/licenses/mit/)