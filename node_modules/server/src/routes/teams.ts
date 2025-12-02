import { Router, Request, Response } from 'express';
import { TeamModel } from '../models/team';
import { asyncHandler } from '../middleware/error';
import { requireFields, isEmptyObject } from '../utils/validate';

const router = Router();

// GET /api/teams
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { region, q, game, limit } = req.query as { region?: string; q?: string; game?: string; limit?: string };
  const clauses: any[] = [];
  if (region) clauses.push({ region });
  if (q) {
    const query = String(q);
    clauses.push({
      $or: [
        { name: new RegExp(query, 'i') },
        { id: new RegExp(query, 'i') }
      ]
    });
  }
  if (game) {
    const safe = game.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`^${safe}$`, 'i');
    if (game.trim().toLowerCase() === 'valorant') {
      clauses.push({
        $or: [
          { game: regex },
          { game: { $exists: false } },
          { game: '' }
        ]
      });
    } else {
      clauses.push({ game: regex });
    }
  }
  const limitValue = Math.min(Math.max(Number(limit) || 500, 1), 2000);
  const mongoFilter = clauses.length ? { $and: clauses } : {};
  const teams = await TeamModel.find(mongoFilter).sort({ name: 1 }).limit(limitValue).lean();
  res.json(teams);
}));

// GET /api/teams/:id
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const team = await TeamModel.findOne({ id: req.params.id }).lean();
  if (!team) return res.status(404).json({ error: 'Not found' });
  res.json(team);
}));

// POST /api/teams
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const missing = requireFields(req.body, ['id', 'name']);
  if (missing.length) return res.status(400).json({ error: 'Missing fields', missing });
  const created = await TeamModel.create(req.body);
  res.status(201).json(created);
}));

// PUT /api/teams/:id
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  if (isEmptyObject(req.body)) return res.status(400).json({ error: 'Empty update' });
  const updated = await TeamModel.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
}));

// DELETE /api/teams/:id
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const result = await TeamModel.findOneAndDelete({ id: req.params.id });
  if (!result) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
}));

export default router;
