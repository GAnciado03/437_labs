import { Router, Request, Response } from 'express';
import { PlayerModel } from '../models/player';
import { asyncHandler } from '../middleware/error';
import { requireFields, isEmptyObject } from '../utils/validate';

const router = Router();

// GET /api/players
// Supports filtering: ?team=T1&role=Mid&q=faker
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { team, role, q, game } = req.query as { team?: string; role?: string; q?: string; game?: string };
  const filter: any = {};
  if (team) filter.team = team;
  if (role) filter.role = role;
  if (game) filter.game = game;
  if (q) filter.$or = [
    { name: new RegExp(String(q), 'i') },
    { id: new RegExp(String(q), 'i') }
  ];
  const players = await PlayerModel.find(filter).sort({ name: 1 }).lean();
  res.json(players);
}));

// GET /api/players/:id
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const p = await PlayerModel.findOne({ id: req.params.id }).lean();
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
}));

// POST /api/players
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const missing = requireFields(req.body, ['id', 'name', 'team', 'role']);
  if (missing.length) return res.status(400).json({ error: 'Missing fields', missing });
  const created = await PlayerModel.create(req.body);
  res.status(201).json(created);
}));

// PUT /api/players/:id
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  if (isEmptyObject(req.body)) return res.status(400).json({ error: 'Empty update' });
  const updated = await PlayerModel.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { new: true, upsert: false }
  );
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
}));

// DELETE /api/players/:id
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const result = await PlayerModel.findOneAndDelete({ id: req.params.id });
  if (!result) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
}));

export default router;
