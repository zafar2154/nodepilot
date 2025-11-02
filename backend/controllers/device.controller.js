import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create Device (FIX: Menerima vPin)
export const createDevice = async (req, res) => {
  try {
    const { name, vPin } = req.body;
    if (!name || vPin === undefined) {
      return res.status(400).json({ error: 'Name and vPin are required' });
    }

    const device = await prisma.device.create({
      data: {
        name,
        vPin: Number(vPin),
        userId: req.user.id,
      },
    });
    res.json(device);
  } catch (err) {
    if (err.code === 'P2002') {
      // Error jika vPin sudah ada
      return res.status(400).json({ error: 'vPin already in use' });
    }
    console.error('Error creating device:', err);
    res.status(500).json({ error: 'Failed to create device' });
  }
};

// Update a device (FIX: Menerima vPin)
export const updateDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, vPin } = req.body;

    const device = await prisma.device.findFirst({
      where: { id: Number(id), userId: req.user.id },
    });

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    const dataToUpdate = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (vPin !== undefined) dataToUpdate.vPin = Number(vPin);

    const updatedDevice = await prisma.device.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    res.json(updatedDevice);
  } catch (err) {
    if (err.code === 'P2002') {
      // Error jika vPin sudah ada
      return res.status(400).json({ error: 'vPin already in use' });
    }
    console.error('Error updating device:', err);
    res.status(500).json({ error: 'Failed to update device' });
  }
};

// Delete a device (FIX: Menghapus data terkait)
export const deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;

    const device = await prisma.device.findFirst({
      where: {
        id: Number(id),
        userId: req.user.id,
      },
    });

    if (!device) {
      return res
        .status(403)
        .json({ error: 'Unauthorized or device not found' });
    }

    // Hapus data dan widget terkait SEBELUM menghapus device
    await prisma.deviceData.deleteMany({
      where: { deviceId: Number(id) },
    });
    await prisma.widget.updateMany({
      where: { deviceId: Number(id) },
      data: { deviceId: null },
    });

    // Hapus Device
    await prisma.device.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Device deleted successfully' });
  } catch (err) {
    console.error('Error deleting device:', err);
    res.status(500).json({ error: 'Failed to delete device' });
  }
};

// Get all devices for logged user
export const getDevices = async (req, res) => {
  try {
    const devices = await prisma.device.findMany({
      where: { userId: req.user.id },
    });
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
};

// Add sensor data to device
export const addDeviceData = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    const device = await prisma.device.findUnique({
      where: { id: Number(id) },
    });
    if (!device || device.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'Unauthorized or device not found' });
    }

    const data = await prisma.deviceData.create({
      data: {
        value,
        deviceId: device.id,
      },
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add data' });
  }
};

// Get data for a device
export const getDeviceData = async (req, res) => {
  try {
    const { id } = req.params;

    const device = await prisma.device.findUnique({
      where: { id: Number(id) },
    });
    if (!device || device.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'Unauthorized or device not found' });
    }

    const data = await prisma.deviceData.findMany({
      where: { deviceId: device.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch device data' });
  }
};

// Toggle LED / device status
export const setDeviceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "on" atau "off"

    const device = await prisma.device.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.json(device);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};

// Get LED status (untuk ESP32)
export const getDeviceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await prisma.device.findUnique({
      where: { id: Number(id) },
      select: { status: true },
    });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch status' });
  }
};
