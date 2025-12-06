import { MatchModel, MatchType } from '../models/match';
import { PlayerModel } from '../models/player';
import { TeamModel } from '../models/team';
import {
  MatchQuery,
  VlrggLiveMatch,
  VlrggPlayerStats,
  VlrggRanking,
  VlrggResultMatch,
  VlrggUpcomingMatch,
  getMatches,
  getPlayerStats,
  getRankings,
} from './vlrgg';
import { slugify } from '../utils/text';
import { ensureTeamTag } from '../utils/team-tags';

const DEFAULT_REGIONS = ['na', 'eu', 'ap', 'br', 'latam', 'kr'];
const DEFAULT_MATCH_QUERIES: MatchQuery[] = ['upcoming', 'live_score', 'results'];

export interface SyncOptions {
  regions?: string[];
  timespan?: string;
  matchQueries?: MatchQuery[];
}

export interface SyncSummary {
  players: number;
  teams: number;
  matches: number;
}

export async function syncVlrggData(options: SyncOptions = {}): Promise<SyncSummary> {
  const regions = normalizeRegions(options.regions);
  const timespan = options.timespan ?? process.env.VLRGG_TIMESPAN ?? 'all';
  const matchQueries = options.matchQueries ?? DEFAULT_MATCH_QUERIES;

  const players = await syncPlayers(regions, timespan);
  const teams = await syncTeams(regions);
  const matches = await syncMatches(matchQueries);

  return { players, teams, matches };
}

async function syncPlayers(regions: string[], timespan: string): Promise<number> {
  let processed = 0;
  for (const region of regions) {
    const stats = await getPlayerStats(region, timespan);
    for (const segment of stats) {
      if (!segment.player) continue;
      const id = slugify(`${segment.player}-${region}`);
      const team = segment.org?.trim() || 'Free Agent';

      const statsBlock = buildPlayerStats(segment);
      const payload = {
        id,
        name: segment.player,
        team,
        role: 'Flex',
        game: 'Valorant',
        kda: segment.kill_deaths,
        stats: statsBlock,
      };

      await PlayerModel.updateOne({ id }, payload, { upsert: true });
      processed += 1;
    }
  }
  return processed;
}

async function syncTeams(regions: string[]): Promise<number> {
  let processed = 0;
  for (const region of regions) {
    const rankings = await getRankings(region);
    for (const entry of rankings) {
      if (!entry.team) continue;
      const id = slugify(entry.team);
      const payload = {
        id,
        name: entry.team,
        tag: ensureTeamTag({ name: entry.team, id }),
        region,
        game: 'Valorant',
        rank: parseNumber(entry.rank),
        country: entry.country,
        record: entry.record,
        earnings: entry.earnings,
        logo: toAbsoluteUrl(entry.logo),
        lastPlayed: entry.last_played,
        lastOpponent: entry.last_played_team,
        lastOpponentLogo: toAbsoluteUrl(entry.last_played_team_logo),
      };
      await TeamModel.updateOne({ id }, payload, { upsert: true });
      processed += 1;
    }
  }
  return processed;
}

async function syncMatches(queries: MatchQuery[]): Promise<number> {
  let processed = 0;
  for (const query of queries) {
    const segments = await getMatches(query);
    for (const segment of segments) {
      const matchPage = normalizeMatchPage(segment.match_page);
      const id = extractMatchId(matchPage);
      const payload = mapMatchSegment(segment, query, matchPage, id);
      await MatchModel.updateOne({ id }, payload, { upsert: true });
      processed += 1;
    }
  }
  return processed;
}

function buildPlayerStats(segment: VlrggPlayerStats) {
  return {
    kda: segment.kill_deaths,
    rating: parseNumber(segment.rating),
    averageCombatScore: parseNumber(segment.average_combat_score),
    averageDamagePerRound: parseNumber(segment.average_damage_per_round),
    killsPerRound: parseNumber(segment.kills_per_round),
    assistsPerRound: parseNumber(segment.assists_per_round),
    firstKillsPerRound: parseNumber(segment.first_kills_per_round),
    firstDeathsPerRound: parseNumber(segment.first_deaths_per_round),
    headshotPercentage: parsePercent(segment.headshot_percentage),
    clutchSuccessPercentage: parsePercent(segment.clutch_success_percentage),
    killAssistsSurvivedTraded: parsePercent(segment.kill_assists_survived_traded),
  };
}

function mapMatchSegment(
  segment: VlrggUpcomingMatch | VlrggLiveMatch | VlrggResultMatch,
  query: MatchQuery,
  matchPage: string,
  id: string,
) {
  const base = {
    id,
    type: mapMatchType(query),
    team1: segment.team1,
    team2: segment.team2,
    flag1: segment.flag1,
    flag2: segment.flag2,
    matchSeries: segment.match_series,
    matchEvent: 'match_event' in segment ? segment.match_event : undefined,
    timeUntilMatch: segment.time_until_match,
    scheduledAt: parseTimestamp(segment.unix_timestamp),
    matchPage,
    raw: segment,
  };

  if ('team1_logo' in segment) {
    Object.assign(base, {
      team1Logo: toAbsoluteUrl(segment.team1_logo),
      team2Logo: toAbsoluteUrl(segment.team2_logo),
      score1: segment.score1,
      score2: segment.score2,
      team1RoundCt: segment.team1_round_ct,
      team1RoundT: segment.team1_round_t,
      team2RoundCt: segment.team2_round_ct,
      team2RoundT: segment.team2_round_t,
      mapNumber: segment.map_number,
      currentMap: segment.current_map,
    });
  } else if ('time_completed' in segment) {
    Object.assign(base, {
      score1: segment.score1,
      score2: segment.score2,
      timeCompleted: segment.time_completed,
      matchSeries: segment.round_info ?? base.matchSeries,
      matchEvent: segment.tournament_name ?? base.matchEvent,
      tournamentName: segment.tournament_name,
      tournamentIcon: toAbsoluteUrl(segment.tournament_icon),
    });
  }

  return base;
}

function mapMatchType(query: MatchQuery): MatchType {
  switch (query) {
    case 'live_score':
      return 'live';
    case 'results':
      return 'result';
    default:
      return 'upcoming';
  }
}

function normalizeRegions(regions?: string[]) {
  if (regions && regions.length) {
    return Array.from(
      new Set(
        regions
          .map((r) => r?.trim().toLowerCase())
          .filter((r): r is string => Boolean(r)),
      ),
    );
  }
  const envRegions = process.env.VLRGG_REGIONS;
  if (envRegions) {
    return envRegions
      .split(',')
      .map((r) => r.trim().toLowerCase())
      .filter(Boolean);
  }
  return DEFAULT_REGIONS;
}

function parseNumber(value?: string | number) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (!value) return undefined;
  const cleaned = value.replace(/[,%]/g, '').trim();
  const asNumber = Number(cleaned);
  return Number.isFinite(asNumber) ? asNumber : undefined;
}

function parsePercent(value?: string | number) {
  return parseNumber(value);
}

function parseTimestamp(value?: string) {
  if (!value) return undefined;
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const iso = normalized.endsWith('Z') ? normalized : `${normalized}Z`;
  const timestamp = Date.parse(iso);
  if (Number.isNaN(timestamp)) return undefined;
  return new Date(timestamp);
}

function extractMatchId(matchPage: string) {
  const match = matchPage.match(/(\d{3,})/);
  if (match) return match[1];
  return slugify(matchPage);
}

function normalizeMatchPage(matchPage: string) {
  if (!matchPage) return '';
  if (matchPage.startsWith('http')) return matchPage;
  const path = matchPage.startsWith('/') ? matchPage : `/${matchPage}`;
  return `https://www.vlr.gg${path}`;
}

function toAbsoluteUrl(url?: string) {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) return `https:${url}`;
  return url;
}
