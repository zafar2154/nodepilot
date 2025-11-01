import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get all widgets for user devices
export const getWidgets = async (req, res) => {
  try {
    const userId = req.user.id;
    const widgets = await prisma.widget.findMany({
      where: { device: { userId } },
    });
    res.json(widgets);
  } catch {
    res.status(500).json({ error: 'Failed to fetch widgets' });
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
    res.status(500).json({ error: 'Failed to update widget' });
  }
};

export const saveWidgets = async (req, res) => {
  try {
    const { widgets } = req.body;
    if (!Array.isArray(widgets))
      return res.status(400).json({ error: 'Invalid data' });

    // Clear old widgets
    await prisma.widget.deleteMany({ where: { userId: req.user.id } });

    // Save new widgets
    for (const w of widgets) {
      await prisma.widget.create({
        data: {
          type: w.type,
          label: w.label,
          layout: w.layout,
          deviceId: w.deviceId,
          userId: req.user.id,
        },
      });
    }

    res.json({ message: 'Widgets saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save widgets' });
  }
};
