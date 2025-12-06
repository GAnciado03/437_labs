import { LitElement, html, unsafeCSS } from 'lit';
import { apiFetch, apiUrl } from '../utils/api.ts';
import detailStyles from '../../styles/team-detail-card.css?inline';

export class TeamDetailCard extends LitElement {
  static styles = unsafeCSS(detailStyles);

  static properties = {
    team: { type: Object },
    players: { state: true },
    selectedGame: { state: true },
    loading: { state: true },
    error: { state: true }
  };

  constructor() {
    super();
    this.team = null;
    this.players = [];
    this.selectedGame = '';
    this.loading = false;
    this.error = '';
  }

  updated(changed) {
    if (changed.has('team')) {
      this.selectedGame = '';
      this.fetchRoster();
    }
  }

  async fetchRoster() {
    const team = this.team;
    if (!team) {
      this.players = [];
      return;
    }
    const candidates = this.buildCandidates(team);
    if (!candidates.length) {
      this.players = [];
      return;
    }
    this.loading = true;
    this.error = '';
    try {
      const results = await Promise.all(
        candidates.map(async (candidate) => {
          try {
            const res = await apiFetch(apiUrl(`/api/players?team=${encodeURIComponent(candidate)}`));
            if (!res.ok) return [];
            const payload = await res.json();
            return Array.isArray(payload) ? payload : [];
          } catch {
            return [];
          }
        })
      );
      const merged = this.mergePlayers(results.flat());
      this.players = merged;
      const games = this.games;
      this.selectedGame = games[0] || '';
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
      this.players = [];
    } finally {
      this.loading = false;
    }
  }

  buildCandidates(team) {
    const set = new Set();
    const push = (value) => {
      if (!value) return;
      const trimmed = value.trim();
      if (!trimmed) return;
      set.add(trimmed);
      set.add(trimmed.toLowerCase());
      set.add(trimmed.toUpperCase());
    };
    push(team.tag);
    push(team.id);
    push(team.name);
    push(this.slugify(team.name));
    push(this.slugify(team.id));
    push(this.abbreviate(team.name));
    return Array.from(set).filter(Boolean);
  }

  slugify(value) {
    if (!value) return '';
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  abbreviate(value) {
    if (!value) return '';
    const letters = value
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0]?.toUpperCase() || '');
    const candidate = letters.join('');
    return candidate.length ? candidate : value;
  }

  mergePlayers(list) {
    const map = new Map();
    for (const player of list) {
      const key = (player?.id || '').toLowerCase();
      if (!key || map.has(key)) continue;
      map.set(key, player);
    }
    return Array.from(map.values());
  }

  get games() {
    const map = new Map();
    const fallback = (this.team?.game || 'Valorant').trim();
    if (fallback) map.set(fallback.toLowerCase(), fallback);
    this.players.forEach((player) => {
      const game = (player?.game || '').trim();
      if (game && !map.has(game.toLowerCase())) {
        map.set(game.toLowerCase(), game);
      }
    });
    return Array.from(map.values());
  }

  get roster() {
    const key = (this.selectedGame || '').toLowerCase();
    if (!key) return this.players;
    return this.players.filter((player) => (player?.game || '').toLowerCase() === key);
  }

  renderGameTabs() {
    const games = this.games;
    if (!games.length) return null;
    return html`
      <div class="game-tabs" role="tablist">
        ${games.map(
          (game) => html`
            <button
              type="button"
              class=${game === this.selectedGame ? 'chip active' : 'chip'}
              @click=${() => (this.selectedGame = game)}
              aria-selected=${String(game === this.selectedGame)}
            >
              ${game}
            </button>
          `
        )}
      </div>
    `;
  }

  renderRosterList() {
    const list = this.roster;
    if (!list.length) return html`<p class="muted">No players listed for this game.</p>`;
    return html`
      <ul class="roster-list">
        ${list.map(
          (player) => html`
            <li>
              <a href="stats.html?id=${player.id}" title="View stats for ${player.name}">
                <strong>${player.name || 'Unknown'}</strong>
                <span>${player.role || 'Flex'}</span>
              </a>
            </li>
          `
        )}
      </ul>
    `;
  }

  render() {
    if (!this.team) return html`<div class="detail-card empty"><p class="muted">Select a team.</p></div>`;
    if (this.loading) return html`<div class="detail-card empty"><p class="muted">Loading roster…</p></div>`;
    if (this.error) return html`<div class="detail-card empty"><p class="muted">Error: ${this.error}</p></div>`;

    const team = this.team;
    return html`
      <article class="detail-card">
        <header>
          <div>
            <p class="eyebrow">${team.tag || team.id}</p>
            <h2>${team.name}</h2>
          </div>
        </header>
        <dl class="meta">
          <div>
            <dt>Region</dt>
            <dd>${team.region || 'Global'}</dd>
          </div>
          <div>
            <dt>Game</dt>
            <dd>${team.game || 'Valorant'}</dd>
          </div>
        </dl>
        ${this.renderGameTabs()}
        <section aria-label="Team roster">${this.renderRosterList()}</section>
      </article>
    `;
  }
}

customElements.define('team-detail-card', TeamDetailCard);
