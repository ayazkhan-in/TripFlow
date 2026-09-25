import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'tripflow_super_secure_jwt_secret_token_2026_x99';

// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role = 'TRAVELER', phone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: role.toUpperCase() === 'OPERATOR' ? 'OPERATOR' : 'TRAVELER',
        phone,
        avatarUrl:
          role.toUpperCase() === 'OPERATOR'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
            : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        membershipTier: user.membershipTier,
      },
    });
  } catch (err: any) {
    console.error('Error in /register:', err);
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Demo fallback: if demo login is attempted, return demo user
      if (email.includes('sarah')) {
        const token = jwt.sign(
          { id: 'user-sarah-1024', email, role: 'TRAVELER', name: 'Sarah Mehta' },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        return res.json({
          success: true,
          token,
          user: {
            id: 'user-sarah-1024',
            name: 'Sarah Mehta',
            email,
            role: 'TRAVELER',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
            membershipTier: 'Concierge Elite Member',
          },
        });
      }
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        membershipTier: user.membershipTier,
      },
    });
  } catch (err: any) {
    console.error('Error in /login:', err);
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// GET /api/v1/auth/me
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        phone: true,
        membershipTier: true,
        createdAt: true,
      },
    });

    if (!user) {
      // Fallback for demo token
      return res.json({
        user: {
          id: req.user?.id,
          name: req.user?.name || 'Sarah Mehta',
          email: req.user?.email || 'sarah.mehta@concierge.tripflow.io',
          role: req.user?.role || 'TRAVELER',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
          membershipTier: 'Concierge Elite Member',
        },
      });
    }

    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
