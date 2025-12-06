import { LitElement, html, unsafeCSS } from 'lit';
import { apiUrl, apiFetch } from '../utils/api.ts';
import playerListStyles from '../../styles/player-list.css?inline';

export class PlayerList extends LitElement {
  static styles = unsafeCSS(playerListStyles);

  static properties = {
    src: { type: String },
    team: { type: String },
    filterName: { type: String, attribute: 'filter-name' },
    filterTeam: { type: String, attribute: 'filter-team' },
    filterGame: { type: String, attribute: 'filter-game' },
    profileLink: { type: String, attribute: 'profile-link' },
    gameTeams: { attribute: false },
    players: { state: true },
    loading: { state: true },
    error: { state: true }
  };

  #abort;

  constructor() {
    super();
    this.src = '/api/players';
    this.team = '';
    this.filterName = '';
    this.filterTeam = '';
    this.filterGame = '';
    this.profileLink = 'player';
    this.gameTeams = {};
    this.players = [];
    this.loading = false;
    this.error = null;
  }

  willUpdate(changed) {
    if (changed.has('src') && this.src) {
      this.fetchData();
    }
  }

  resolveSrc(value) {
    if (!value) return '';
    if (value.startsWith('http')) return value;
    if (value.startsWith('/api/')) return apiUrl(value);
    return value;
  }

  async fetchData() {
    this.#abort?.abort();
    this.#abort = new AbortController();
    this.loading = true;
    this.error = null;
    const useApi = this.src?.startsWith('/api/');
    const target = this.resolveSrc(this.src);
    try {
      const res = await (useApi ? apiFetch(target, { signal: this.#abort.signal }) : fetch(target, { signal: this.#abort.signal }));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      const seen = new Set();
      const unique = [];
      for (const p of list) {
        const key =
          (p?.id && String(p.id).toLowerCase()) ||
          `${(p?.name || '').toLowerCase()}-${(p?.team || '').toLowerCase()}`;
        if (key && !seen.has(key)) {
          seen.add(key);
          unique.push(p);
        }
      }
      this.players = unique;
    } catch (err) {
      if (err?.name !== 'AbortError') this.error = String(err);
    } finally {
      this.loading = false;
    }
  }

  applyFilters() {
    const nameQuery = (this.filterName || '').trim().toLowerCase();
    const rawTeamKey = (this.filterTeam || this.team || '').trim().toLowerCase();
    const teamSlugKey = slugifyTeam(this.filterTeam || this.team || '');
    const gameKey = (this.filterGame || '').trim().toLowerCase();
    const map = this.gameTeams || {};
    let list = this.players;

    if (nameQuery) {
      list = list.filter(p => (p.name || '').toLowerCase().includes(nameQuery));
    }
    if (rawTeamKey || teamSlugKey) {
      list = list.filter(p => {
        const playerTeam = (p.team || '').trim().toLowerCase();
        const slug = slugifyTeam(p.teamId || p.team || '');
        return (rawTeamKey && playerTeam === rawTeamKey) || (teamSlugKey && slug === teamSlugKey);
      });
    }
    if (gameKey) {
      list = list.filter(p => {
        const playerGame = (p.game || '').toLowerCase();
        if (playerGame) return playerGame === gameKey;
        const team = (p.team || '').toLowerCase();
        return (map[team] || '').toLowerCase() === gameKey;
      });
    }
    return list;
  }

  lookupGame(player) {
    const map = this.gameTeams || {};
    const direct = (player?.game || '').trim();
    if (direct) return direct;
    const teamKey = (player?.team || '').toLowerCase();
    const mapped = teamKey ? map[teamKey] : '';
    return mapped || 'Valorant';
  }

  render() {
    if (this.loading) return html`<p class="muted">Loading...</p>`;
    if (this.error) return html`<p class="muted">Error: ${this.error}</p>`;
    const visible = this.applyFilters();
    if (!visible.length) return html`<p class="muted">No players found.</p>`;
    const baseLink = this.profileLink === 'stats' ? 'stats.html' : 'player.html';
    return html`
      <ul>
        ${visible.map(p => html`
          <li>
            <div class="player-line">
              <a href="${baseLink}?id=${p.id}"><strong>${p.name}</strong></a>
              <span class="muted team-meta-line">
                ${this.renderTeamMeta(p)}
                <span class="meta-separator" aria-hidden="true">&middot;</span>
                <span class="team-role">${p.role || 'Flex'}</span>
              </span>
            </div>
            <span class="player-game">${this.lookupGame(p)}</span>
          </li>
        `)}
      </ul>
    `;
  }

  renderTeamMeta(player) {
    const teamName = (player?.team || '').trim();
    const teamSlug = slugifyTeam(player?.teamId || player?.team || '');
    if (!teamName && !teamSlug) return html`<span class="team-tag">Unknown</span>`;
    return html`
      <span class="team-meta">
        ${teamSlug ? html`<code class="team-id">${teamSlug}</code>` : null}
        ${teamName ? html`<span class="team-tag">${teamName}</span>` : null}
      </span>
    `;
  }
}

customElements.define('player-list', PlayerList);

function slugifyTeam(value = '') {
  return value
    ? value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    : '';
}
