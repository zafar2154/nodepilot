import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create new widget
export const createWidget = async (req, res) => {
  try {
    const { name, type, deviceId } = req.body;
    const widget = await prisma.widget.create({
      data: { name, type, deviceId },
    });
    res.json(widget);
  } catch {
    res.status(500).json({ error: "Failed to create widget" });
  }
};

// Get all widgets for user devices
export const getWidgets = async (req, res) => {
  try {
    const userId = req.user.id;
    const widgets = await prisma.widget.findMany({
      where: { device: { userId } },
    });
    res.json(widgets);
  } catch {
    res.status(500).json({ error: "Failed to fetch widgets" });
  }
};

// Update widget value (for button press or data update)
export const updateWidgetValue = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    const widget = await prisma.widget.update({
      where: { id: Number(id) },
      data: { value },
    });
    res.json(widget);
  } catch {
    res.status(500).json({ error: "Failed to update widget" });
  }
};
