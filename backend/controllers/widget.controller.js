import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ✅ Create Widget
export const createWidget = async (req, res) => {
  try {
    const { name, type, deviceId, x, y, width, height } = req.body;
    const widget = await prisma.widget.create({
      data: {
        name,
        type,
        deviceId: Number(deviceId),
        x: x || 0,
        y: y || 0,
        width: width || 2,
        height: height || 2,
        userId: req.user.id,
      },
    });
    res.json(widget);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create widget' });
  }
};

// ✅ Get all widgets for user
export const getWidgets = async (req, res) => {
  try {
    const widgets = await prisma.widget.findMany({
      where: { userId: req.user.id },
      include: { device: true },
    });
    res.json(widgets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch widgets' });
  }
};

// ✅ Update widget (position, device, etc)
export const updateWidget = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const widget = await prisma.widget.update({
      where: { id: Number(id) },
      data,
    });
    res.json(widget);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update widget' });
  }
};

// ✅ Delete widget
export const deleteWidget = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.widget.delete({ where: { id: Number(id) } });
    res.json({ message: 'Widget deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete widget' });
  }
};
