// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashed });
  res.json(user);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(403).json({ error: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);
  res.json({ token, userId: user._id });
};
