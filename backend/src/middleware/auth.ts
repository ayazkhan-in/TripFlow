import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tripflow_super_secure_jwt_secret_token_2026_x99';

export interface AuthUserPayload {
  id: string;
  email: string;
  role: 'TRAVELER' | 'OPERATOR' | 'ADMIN';
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Fallback: If demo headers are provided or default traveler
    const demoUserId = req.headers['x-demo-user-id'] as string;
    if (demoUserId) {
      req.user = {
        id: demoUserId,
        email: 'sarah.mehta@concierge.tripflow.io',
        role: 'TRAVELER',
        name: 'Sarah Mehta',
      };
      return next();
    }
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired authentication token' });
  }
};

export const optionalAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET) as AuthUserPayload;
    } catch {
      // Ignored for optional auth
    }
  }
  next();
};

export const requireRole = (allowedRoles: Array<'TRAVELER' | 'OPERATOR' | 'ADMIN'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions for this resource' });
    }
    next();
  };
};
