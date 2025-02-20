import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User, { IUser } from '../models/user';

dotenv.config();

interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token = '';

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
    req.user = await User.findById(decoded.id).select('-password') as IUser;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access only' });
  }
};

export default AuthRequest;
