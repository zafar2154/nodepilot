import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create Device
export const createDevice = async (req, res) => {
  try {
    const { name } = req.body;
    const device = await prisma.device.create({
      data: {
        name,
        userId: req.user.id,
      },
    });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create device' });
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
