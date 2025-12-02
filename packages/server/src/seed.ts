import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PlayerModel } from './models/player';
import { TeamModel } from './models/team';

async function readJson<T = any>(p: string): Promise<T> {
  const txt = await readFile(p, 'utf-8');
  return JSON.parse(txt) as T;
}

export async function seedFromProtoData() {
  const base = path.resolve(__dirname, '../../proto/public/data');
  const playersPath = path.join(base, 'player-details.json');
  const teamsPath = path.join(base, 'teams.json');

  try {
    const [playersData, teamsData] = await Promise.all([
      readJson<any[]>(playersPath),
      readJson<any[]>(teamsPath),
    ]);

    // Upsert teams
    for (const t of teamsData) {
      const payload = {
        ...t,
        game: t.game || 'League of Legends',
      };
      await TeamModel.updateOne({ id: t.id }, payload, { upsert: true });
    }

    // Upsert players (use details to include achievements/stats)
    for (const p of playersData) {
      const payload = {
        ...p,
        game: p.game || 'League of Legends',
      };
      await PlayerModel.updateOne({ id: p.id }, payload, { upsert: true });
    }
  } catch (e) {
    console.error('Seed failed:', e);
    throw e;
  }
}
