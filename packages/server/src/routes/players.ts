import { Router, Request, Response, NextFunction } from 'express';
import { PlayerModel } from '../models/player';
import { TeamModel } from '../models/team';
import { asyncHandler } from '../middleware/error';
import { requireFields, isEmptyObject } from '../utils/validate';
import { authenticateUser } from './auth';
import { ensureTeamTag } from '../utils/team-tags';
import { slugify } from '../utils/text';

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET') return next();
  return authenticateUser(req, res, next);
});

// GET /api/players
// Supports filtering: ?team=T1&role=Mid&q=faker
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { team, role, q, game } = req.query as { team?: string; role?: string; q?: string; game?: string };
  const clauses: any[] = [];

  if (team) {
    const regexes = await buildTeamRegexes(team);
    if (regexes.length) {
      clauses.push({
        $or: regexes.map((regex) => ({ team: regex })),
      });
    }
  }

  if (role) clauses.push({ role });

  if (game) {
    const safeGame = escapeRegex(String(game));
    clauses.push({ game: new RegExp(`^${safeGame}$`, 'i') });
  }

  if (q) {
    const query = String(q);
    clauses.push({
      $or: [
        { name: new RegExp(query, 'i') },
        { id: new RegExp(query, 'i') },
      ],
    });
  }

  const filter = clauses.length ? { $and: clauses } : {};
  const players = await PlayerModel.find(filter).sort({ name: 1 }).lean();
  const enriched = players.map((player) => ({
    ...player,
    teamId: player.teamId || slugify(player.team || ''),
  }));
  res.json(enriched);
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

async function buildTeamRegexes(teamParam: string): Promise<RegExp[]> {
  const values = new Set<string>();
  const raw = teamParam.trim();
  if (!raw) return [];
  values.add(raw);
  values.add(slugify(raw));
  const safe = escapeRegex(raw);

  const teamDoc = await TeamModel.findOne({
    $or: [
      { id: raw },
      { id: slugify(raw) },
      { tag: raw },
      { name: new RegExp(`^${safe}$`, 'i') },
      { tag: new RegExp(`^${safe}$`, 'i') },
    ],
  }).lean();

  if (teamDoc) {
    if (teamDoc.id) values.add(teamDoc.id);
    if (teamDoc.name) values.add(teamDoc.name);
    const tag = ensureTeamTag(teamDoc);
    if (tag) values.add(tag);
  }

  return Array.from(values)
    .filter(Boolean)
    .map((value) => new RegExp(`^${escapeRegex(value)}$`, 'i'));
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
