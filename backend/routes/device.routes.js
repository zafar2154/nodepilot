import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createDevice,
  getDevices,
  addDeviceData,
  getDeviceData,
} from '../controllers/device.controller.js';

const router = express.Router();

router.use(authMiddleware); // semua route butuh login

router.post('/', createDevice);
router.get('/', getDevices);
router.post('/:id/data', addDeviceData);
router.get('/:id/data', getDeviceData);

export default router;
