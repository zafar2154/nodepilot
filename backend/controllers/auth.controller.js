import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';

const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed },
    });

    // 🔥 Tambahkan token di sini
    const token = generateToken({ id: user.id, email: user.email });

    res.json({
      message: 'User registered',
      user: { id: user.id, email: user.email },
      token, // ✅ kirim token supaya frontend bisa langsung login
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

    const token = generateToken({ id: user.id, email: user.email });
    res.json({ message: 'Login success', token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
