import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PlayerModel } from './models/player';
import { TeamModel } from './models/team';
import { ensureTeamTag } from './utils/team-tags';
import { slugify } from './utils/text';

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

    const playerTagMap = buildPlayerTeamTagMap(playersData);

    // Upsert teams
    for (const t of teamsData) {
      const teamId = t.id || slugify(t.name);
      const candidateTag =
        playerTagMap.get(teamId) ||
        playerTagMap.get(slugify(teamId)) ||
        ensureTeamTag(t);
      const payload = {
        ...t,
        id: teamId,
        game: t.game || 'League of Legends',
        ...(candidateTag ? { tag: candidateTag } : {}),
      };
      await TeamModel.updateOne({ id: teamId }, payload, { upsert: true });
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

function buildPlayerTeamTagMap(players: any[]): Map<string, string> {
  const map = new Map<string, string>();
  players.forEach((player) => {
    const tag = pickString(player, [
      'teamTag',
      'team_tag',
      'teamCode',
      'team_code',
      'team',
    ]);
    const idSource = pickString(player, [
      'teamId',
      'team_id',
      'teamSlug',
      'team_slug',
      'team',
    ]);
    if (!tag || !idSource) return;
    const key = slugify(idSource);
    if (!key || map.has(key)) return;
    map.set(key, tag);
  });
  return map;
}

function pickString(source: any, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = source?.[key];
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed) return trimmed;
    }
  }
  return undefined;
}
