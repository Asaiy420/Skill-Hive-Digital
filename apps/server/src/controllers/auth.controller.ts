import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

const jwtSecret = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const user = new User({ name, email, password });
    await user.save();

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });

    res.status(201).json({ message: 'User registered', user: { name: user.name, email: user.email }, token });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });

    res.json({ message: 'Login successful', user: { name: user.name, email: user.email }, token });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Login failed' });
  }
};
