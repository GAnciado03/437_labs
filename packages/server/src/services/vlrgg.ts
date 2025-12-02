const DEFAULT_BASE_URL = 'https://vlrggapi.vercel.app';

type QueryParamValue = string | number | undefined;
type QueryParams = Record<string, QueryParamValue>;

export type VlrggRegion = string;
export type MatchQuery = 'upcoming' | 'live_score' | 'results';

interface VlrggEnvelope<T> {
  data?: {
    status?: number;
    segments?: T[];
  };
}

export interface VlrggPlayerStats {
  player: string;
  org?: string;
  rating?: string;
  average_combat_score?: string;
  kill_deaths?: string;
  kill_assists_survived_traded?: string;
  average_damage_per_round?: string;
  kills_per_round?: string;
  assists_per_round?: string;
  first_kills_per_round?: string;
  first_deaths_per_round?: string;
  headshot_percentage?: string;
  clutch_success_percentage?: string;
}

export interface VlrggRanking {
  rank: string;
  team: string;
  country?: string;
  last_played?: string;
  last_played_team?: string;
  last_played_team_logo?: string;
  record?: string;
  earnings?: string;
  logo?: string;
}

export interface VlrggUpcomingMatch {
  team1: string;
  team2: string;
  flag1?: string;
  flag2?: string;
  time_until_match?: string;
  match_series?: string;
  match_event?: string;
  unix_timestamp?: string;
  match_page: string;
}

export interface VlrggLiveMatch extends VlrggUpcomingMatch {
  team1_logo?: string;
  team2_logo?: string;
  score1?: string;
  score2?: string;
  team1_round_ct?: string;
  team1_round_t?: string;
  team2_round_ct?: string;
  team2_round_t?: string;
  map_number?: string;
  current_map?: string;
}

export interface VlrggResultMatch extends VlrggUpcomingMatch {
  score1?: string;
  score2?: string;
  time_completed?: string;
  round_info?: string;
  tournament_name?: string;
  tournament_icon?: string;
}

type MatchResponseMap = {
  upcoming: VlrggUpcomingMatch;
  live_score: VlrggLiveMatch;
  results: VlrggResultMatch;
};

async function request<T>(endpoint: string, params?: QueryParams): Promise<T> {
  const baseUrl = process.env.VLRGG_API_URL || DEFAULT_BASE_URL;
  const url = new URL(endpoint, baseUrl);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    url.searchParams.append(key, String(value));
  });

  const response = await fetch(url, {
    method: 'GET',
    headers: { accept: 'application/json' },
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(
      `vlrgg request failed (${response.status} ${response.statusText}): ${message}`,
    );
  }

  return (await response.json()) as T;
}

export async function getPlayerStats(
  region: VlrggRegion,
  timespan = 'all',
): Promise<VlrggPlayerStats[]> {
  const data = await request<VlrggEnvelope<VlrggPlayerStats>>('/stats', {
    region,
    timespan,
  });
  return data.data?.segments ?? [];
}

export async function getRankings(
  region: VlrggRegion,
): Promise<VlrggRanking[]> {
  const data = await request<{ status?: number; data?: VlrggRanking[] }>(
    '/rankings',
    { region },
  );
  return data.data ?? [];
}

export async function getMatches<T extends MatchQuery>(
  query: T,
): Promise<MatchResponseMap[T][]> {
  const data = await request<VlrggEnvelope<MatchResponseMap[T]>>('/match', {
    q: query,
  });
  return data.data?.segments ?? [];
}
