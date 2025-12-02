import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/error';
import { MatchQuery } from '../services/vlrgg';
import { syncVlrggData, SyncOptions } from '../services/vlrgg-sync';

const router = Router();

router.post(
  '/vlrgg',
  asyncHandler(async (req: Request, res: Response) => {
    const { regions, timespan, matchQueries } = req.body ?? {};
    const options: SyncOptions = {};

    if (Array.isArray(regions)) {
      options.regions = regions
        .map((value) => String(value).trim().toLowerCase())
        .filter(Boolean);
    }

    if (typeof timespan === 'string') {
      options.timespan = timespan;
    }

    if (Array.isArray(matchQueries)) {
      const allowed: MatchQuery[] = ['upcoming', 'live_score', 'results'];
      options.matchQueries = matchQueries
        .map((value) => String(value).trim().toLowerCase())
        .filter((value): value is MatchQuery => allowed.includes(value as MatchQuery));
    }

    const summary = await syncVlrggData(options);
    res.json({ ok: true, summary });
  }),
);

export default router;
