import { Router } from 'express';
import { TeamModel } from '../models/team';

const router = Router();

router.get('/', async (_req, res) => {
  const teams = await TeamModel.find().sort({ name: 1 }).lean();
  res.json(teams);
});

router.get('/:id', async (req, res) => {
  const team = await TeamModel.findOne({ id: req.params.id }).lean();
  if (!team) return res.status(404).json({ error: 'Not found' });
  res.json(team);
});

router.post('/', async (req, res) => {
  try {
    const created = await TeamModel.create(req.body);
    res.status(201).json(created);
  } catch (e: any) {
    res.status(400).json({ error: String(e) });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await TeamModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (e: any) {
    res.status(400).json({ error: String(e) });
  }
});

router.delete('/:id', async (req, res) => {
  const result = await TeamModel.findOneAndDelete({ id: req.params.id });
  if (!result) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

export default router;

