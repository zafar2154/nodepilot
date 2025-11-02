import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createDevice,
  getDevices,
  addDeviceData,
  getDeviceData,
  setDeviceStatus,
  getDeviceStatus,
  deleteDevice,
  updateDevice,
} from '../controllers/device.controller.js';

const router = express.Router();

router.use(authMiddleware); // semua route butuh login

router.post('/', createDevice);
router.get('/', getDevices);
router.post('/:id/data', addDeviceData);
router.get('/:id/data', getDeviceData);
router.put('/:id', updateDevice);
router.delete('/:id', deleteDevice);
router.post('/:id/control', authMiddleware, setDeviceStatus);
router.get('/:id/control', getDeviceStatus); // esp32 bisa akses tanpa auth kalau mau

export default router;
