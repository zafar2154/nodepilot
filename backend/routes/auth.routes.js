import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    message: 'Protected route',
    user: req.user,
  });
});
export default router;
