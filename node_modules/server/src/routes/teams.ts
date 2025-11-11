import { Router } from 'express';
import { TeamModel } from '../models/team';
import { asyncHandler } from '../middleware/error';
import { requireFields, isEmptyObject } from '../utils/validate';

const router = Router();

// GET /api/teams
router.get('/', asyncHandler(async (req, res) => {
  const { region, q } = req.query as { region?: string; q?: string };
  const filter: any = {};
  if (region) filter.region = region;
  if (q) filter.$or = [
    { name: new RegExp(String(q), 'i') },
    { id: new RegExp(String(q), 'i') }
  ];
  const teams = await TeamModel.find(filter).sort({ name: 1 }).lean();
  res.json(teams);
}));

// GET /api/teams/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const team = await TeamModel.findOne({ id: req.params.id }).lean();
  if (!team) return res.status(404).json({ error: 'Not found' });
  res.json(team);
}));

// POST /api/teams
router.post('/', asyncHandler(async (req, res) => {
  const missing = requireFields(req.body, ['id', 'name']);
  if (missing.length) return res.status(400).json({ error: 'Missing fields', missing });
  const created = await TeamModel.create(req.body);
  res.status(201).json(created);
}));

// PUT /api/teams/:id
router.put('/:id', asyncHandler(async (req, res) => {
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
router.delete('/:id', asyncHandler(async (req, res) => {
  const result = await TeamModel.findOneAndDelete({ id: req.params.id });
  if (!result) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
}));

export default router;
