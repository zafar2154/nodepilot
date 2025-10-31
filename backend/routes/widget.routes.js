import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createWidget,
  getWidgets,
  updateWidgetValue,
} from '../controllers/widget.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createWidget);
router.get('/', getWidgets);
router.post('/:id/value', updateWidgetValue);
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { x, y, width, height } = req.body;

  try {
    const widget = await prisma.widget.update({
      where: { id: Number(id) },
      data: { x, y, width, height },
    });
    res.json(widget);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update widget position' });
  }
});

export default router;
