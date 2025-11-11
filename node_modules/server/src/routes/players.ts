import { Router } from 'express';
import { PlayerModel } from '../models/player';

const router = Router();

// GET /api/players
router.get('/', async (req, res) => {
  const players = await PlayerModel.find().sort({ name: 1 }).lean();
  res.json(players);
});

// GET /api/players/:id
router.get('/:id', async (req, res) => {
  const p = await PlayerModel.findOne({ id: req.params.id }).lean();
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

// POST /api/players
router.post('/', async (req, res) => {
  try {
    const created = await PlayerModel.create(req.body);
    res.status(201).json(created);
  } catch (e: any) {
    res.status(400).json({ error: String(e) });
  }
});

// PUT /api/players/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await PlayerModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, upsert: false }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (e: any) {
    res.status(400).json({ error: String(e) });
  }
});

// DELETE /api/players/:id
router.delete('/:id', async (req, res) => {
  const result = await PlayerModel.findOneAndDelete({ id: req.params.id });
  if (!result) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

export default router;

