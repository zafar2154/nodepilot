import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createWidget,
  getWidgets,
  updateWidget,
  deleteWidget,
} from '../controllers/widget.controller.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', getWidgets);
router.post('/', createWidget);
router.put('/:id', updateWidget);
router.delete('/:id', deleteWidget);

export default router;
