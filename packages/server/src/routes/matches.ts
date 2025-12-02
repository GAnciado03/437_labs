import { Router, Request, Response } from 'express';
import type { SortOrder } from 'mongoose';
import { MatchModel, MatchType } from '../models/match';
import { asyncHandler } from '../middleware/error';
import { requireFields, isEmptyObject } from '../utils/validate';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { type, team, limit } = req.query as {
      type?: MatchType;
      team?: string;
      limit?: string;
    };
    const filter: any = {};
    if (type) filter.type = type;
    if (team) {
      filter.$or = [
        { team1: new RegExp(String(team), 'i') },
        { team2: new RegExp(String(team), 'i') },
      ];
    }

    const limitValue = Math.min(Math.max(Number(limit) || 50, 1), 200);
    const sort: Record<string, SortOrder> =
      type === 'result'
        ? { scheduledAt: -1, createdAt: -1 }
        : { scheduledAt: 1, createdAt: -1 };

    const matches = await MatchModel.find(filter)
      .sort(sort)
      .limit(limitValue)
      .lean();
    res.json(matches);
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const match = await MatchModel.findOne({ id: req.params.id }).lean();
    if (!match) return res.status(404).json({ error: 'Not found' });
    res.json(match);
  }),
);

router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const missing = requireFields(req.body, ['id', 'type', 'team1', 'team2', 'matchPage']);
    if (missing.length) {
      return res.status(400).json({ error: 'Missing fields', missing });
    }
    const created = await MatchModel.create(req.body);
    res.status(201).json(created);
  }),
);

router.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    if (isEmptyObject(req.body)) {
      return res.status(400).json({ error: 'Empty update' });
    }
    const updated = await MatchModel.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const deleted = await MatchModel.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  }),
);

export default router;
