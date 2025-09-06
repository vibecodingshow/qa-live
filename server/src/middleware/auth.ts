import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwtUtils';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    username: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access token is required'
    });
  }

  try {
    const decoded = verifyToken(token);
    req.user = {
      userId: decoded.userId,
      username: decoded.username
    };
    next();
  } catch (error) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid or expired token'
    });
  }
};
