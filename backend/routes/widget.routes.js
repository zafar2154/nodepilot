import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createWidget,
  getWidgets,
  updateWidget,
  deleteWidget,
  updateWidgetDevice,
} from '../controllers/widget.controller.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', getWidgets);
router.post('/', createWidget);
router.put('/:id', updateWidget);
router.delete('/:id', deleteWidget);
router.put('/:id/device', updateWidgetDevice);

export default router;
