import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthRequest extends Request {
  userId?: number;
  usuario?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token não fornecido.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: number; usuario: string };
    req.userId = payload.userId;
    req.usuario = payload.usuario;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}
