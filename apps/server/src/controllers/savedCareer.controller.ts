import type { Response } from 'express';
import mongoose from 'mongoose';
import SavedCareer from '../models/SavedCareer';
import Career from '../models/career.model';
import type { AuthenticatedRequest } from '../middleware/middleware';

export const saveCareer = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const userId = req.user?.userId;
    const { careerId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!careerId || !mongoose.isValidObjectId(careerId)) {
      return res.status(400).json({ message: 'A valid careerId is required' });
    }

    const career = await Career.findOne({ _id: careerId, isActive: true }).lean();
    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }

    let saved: any;
    try {
      const created = await SavedCareer.create({ userId, careerId });
      saved = created.toObject();
    } catch (err: any) {
      if (err?.code === 11000) {
        // Already saved — treat as idempotent success.
        saved = await SavedCareer.findOne({ userId, careerId }).lean();
      } else {
        throw err;
      }
    }

    return res.status(201).json({ saved: { ...saved, career } });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const unsaveCareer = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const userId = req.user?.userId;
    const { careerId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!careerId || !mongoose.isValidObjectId(careerId)) {
      return res.status(400).json({ message: 'A valid careerId is required' });
    }

    const result = await SavedCareer.findOneAndDelete({ userId, careerId });

    if (!result) {
      return res.status(404).json({ message: 'Saved career not found' });
    }

    return res.status(200).json({ removed: true, careerId });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSavedCareers = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const savedCareers = await SavedCareer.find({ userId })
      .sort({ savedAt: -1 })
      .populate('careerId')
      .lean();

    const formatted = savedCareers
      .filter((entry: any) => entry.careerId)
      .map((entry: any) => ({
        _id: entry._id,
        userId: entry.userId,
        careerId: entry.careerId._id,
        savedAt: entry.savedAt,
        career: entry.careerId,
      }));

    return res.status(200).json({ savedCareers: formatted });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};