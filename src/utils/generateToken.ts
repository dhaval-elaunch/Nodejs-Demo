import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
};
