import { slugify } from './text';

export interface TeamLike {
  id?: string | null;
  name?: string | null;
  tag?: string | null;
  short?: string | null;
  shortName?: string | null;
  short_name?: string | null;
  code?: string | null;
  abbreviation?: string | null;
  abbr?: string | null;
  acronym?: string | null;
  [key: string]: unknown;
}

const TAG_FIELDS: Array<keyof TeamLike> = [
  'tag',
  'short',
  'shortName',
  'short_name',
  'code',
  'abbr',
  'abbreviation',
  'acronym',
];

const trimString = (value?: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const coalesceTag = (team?: TeamLike): string | undefined => {
  if (!team) return undefined;
  for (const field of TAG_FIELDS) {
    const candidate = trimString(team[field]);
    if (candidate) return candidate;
  }
  return undefined;
};

const deriveFromId = (team?: TeamLike): string | undefined => {
  const id = trimString(team?.id);
  if (!id) return undefined;
  if (id.includes(' ')) return undefined;
  const simplified = id.replace(/_/g, '-');
  const parts = simplified.split('-').filter(Boolean);
  if (parts.length > 1) {
    if (/^\d+$/.test(parts[0]) && parts[1]) {
      return `${parts[0]}${parts[1][0]?.toUpperCase() ?? ''}`;
    }
    const acronym = parts.map((part) => part[0]?.toUpperCase() ?? '').join('');
    if (acronym.trim()) return acronym;
  }
  const alnum = simplified.replace(/[^a-z0-9]/gi, '');
  if (alnum.length >= 2) return alnum.slice(0, 6).toUpperCase();
  return id.toUpperCase();
};

const deriveFromName = (team?: TeamLike): string | undefined => {
  const name = trimString(team?.name);
  if (!name) return undefined;
  const words = name.split(/\s+/).filter(Boolean);
  if (!words.length) return undefined;
  if (/^\d+$/.test(words[0]) && words[1]) {
    return `${words[0]}${words[1][0]?.toUpperCase() ?? ''}`;
  }
  if (words.length === 1) {
    return words[0].slice(0, 4).toUpperCase();
  }
  const acronym = words.map((word) => word[0]?.toUpperCase() ?? '').join('');
  const cleaned = acronym.replace(/[^A-Z0-9]/g, '');
  if (cleaned.length >= 2) return cleaned.slice(0, 4);
  return words.join('').slice(0, 4).toUpperCase();
};

export function ensureTeamTag(team?: TeamLike, fallback?: string): string | undefined {
  return (
    coalesceTag(team) ||
    trimString(fallback) ||
    deriveFromId(team) ||
    deriveFromName(team)
  );
}

export function slugFromTeam(team?: TeamLike): string {
  if (!team) return '';
  if (team.id) return String(team.id);
  if (team.name) return slugify(String(team.name));
  return '';
}
