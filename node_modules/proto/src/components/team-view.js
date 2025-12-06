import { LitElement, html, unsafeCSS } from 'lit';
import { apiFetch, apiUrl } from '../utils/api.ts';
import teamViewStyles from '../../styles/team-view.css?inline';
import './stat-card.js';

export class TeamView extends LitElement {
  static styles = unsafeCSS(teamViewStyles);

  static properties = {
    id: { type: String, reflect: true },
    teamData: { state: true },
    players: { state: true },
    selectedGame: { state: true },
    loading: { state: true },
    error: { state: true }
  };

  constructor() {
    super();
    this.id = '';
    this.teamData = null;
    this.players = [];
    this.selectedGame = '';
    this.loading = false;
    this.error = null;
  }

  connectedCallback() {
    super.connectedCallback();
    const urlId = new URL(location.href).searchParams.get('id') || '';
    if (!this.id && urlId) this.id = urlId;
  }

  willUpdate(changed) {
    if (changed.has('id')) {
      this.fetchTeam();
    }
  }

  async fetchTeam() {
    if (!this.id) return;
    this.loading = true;
    this.error = null;
    try {
      const res = await apiFetch(apiUrl(`/api/teams/${encodeURIComponent(this.id)}`));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.teamData = await res.json();
      await this.fetchPlayers(this.teamData?.tag || this.teamData?.id || this.id);
    } catch (err) {
      this.error = String(err);
      this.teamData = null;
      this.players = [];
    } finally {
      this.loading = false;
    }
  }

  async fetchPlayers(teamKey) {
    if (!teamKey) {
      this.players = [];
      return;
    }
    try {
      const res = await apiFetch(apiUrl(`/api/players?team=${encodeURIComponent(teamKey)}`));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.players = this.makeUnique(Array.isArray(data) ? data : []);
      const games = this.games;
      if (!games.length) {
        this.selectedGame = '';
      } else if (!this.selectedGame || !games.includes(this.selectedGame)) {
        this.selectedGame = games[0];
      }
    } catch (err) {
      this.error = String(err);
      this.players = [];
    }
  }

  makeUnique(list) {
    const seen = new Set();
    const unique = [];
    for (const player of list) {
      const key =
        (player?.id && String(player.id).toLowerCase()) ||
        `${(player?.name || '').toLowerCase()}-${(player?.team || '').toLowerCase()}`;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      unique.push(player);
    }
    return unique;
  }

  get games() {
    const map = new Map();
    const fallback = (this.teamData?.game || 'Valorant').trim();
    if (fallback) map.set(fallback.toLowerCase(), fallback);
    this.players.forEach((player) => {
      const game = (player?.game || '').trim();
      if (game && !map.has(game.toLowerCase())) {
        map.set(game.toLowerCase(), game);
      }
    });
    return Array.from(map.values());
  }

  get region() {
    return this.teamData?.region || 'Global';
  }

  selectGame(game) {
    this.selectedGame = game;
  }

  get roster() {
    if (!this.selectedGame) return this.players;
    const key = this.selectedGame.toLowerCase();
    return this.players.filter((player) => {
      const playerGame = (player?.game || this.teamData?.game || '').toLowerCase();
      return playerGame === key;
    });
  }

  toggleFavorite = async () => {
    const team = this.teamData?.name || this.id;
    if (!team) return;
    const authed = Boolean(localStorage.getItem('token'));
    if (!authed) {
      location.href = 'login.html';
      return;
    }
    const favKey = 'favTeams';
    const localFavs = JSON.parse(localStorage.getItem(favKey) || '[]');
    const isFav = localFavs.includes(team);
    try {
      const token = localStorage.getItem('token') || '';
      const meRes = await fetch(apiUrl('/api/me'), { headers: { Authorization: `Bearer ${token}` } });
      const me = meRes.ok ? await meRes.json() : { favTeams: localFavs };
      const favs = Array.isArray(me.favTeams) ? me.favTeams : localFavs;
      const next = isFav ? favs.filter((item) => item !== team) : [...new Set([...favs, team])];
      await fetch(apiUrl('/api/me'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ favTeams: next })
      });
      localStorage.setItem(favKey, JSON.stringify(next));
      this.requestUpdate();
    } catch {
      /* ignore */
    }
  };

  renderGameNav() {
    const games = this.games;
    if (!games.length) return html`<p class="muted">No roster data.</p>`;
    return html`
      <div class="game-list" role="tablist">
        ${games.map(
          (game) => html`
            <button
              type="button"
              class=${game === this.selectedGame ? 'game-chip active' : 'game-chip'}
              @click=${() => this.selectGame(game)}
              role="tab"
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
    if (!list.length) {
      return html`<p class="muted">No players found for ${this.selectedGame || 'this team'}.</p>`;
    }
    return html`
      <ul class="roster-list">
        ${list.map(
          (player) => html`
            <li>
              <a href="stats.html?id=${player.id || ''}">
                <strong>${player.name}</strong>
                <span>${player.role || 'Flex'}</span>
              </a>
            </li>
          `
        )}
      </ul>
    `;
  }

  renderMeta() {
    const team = this.teamData;
    if (!team) return null;
    return html`
      <dl class="meta-grid">
        <div>
          <dt>Region</dt>
          <dd>${team.region || 'Global'}</dd>
        </div>
        <div>
          <dt>Game</dt>
          <dd>${team.game || 'Valorant'}</dd>
        </div>
        ${team.lastOpponent
          ? html`
              <div>
                <dt>Last Opponent</dt>
                <dd>${team.lastOpponent}</dd>
              </div>
            `
          : null}
      </dl>
    `;
  }

  render() {
    if (this.loading) return html`<main class="container"><p class="muted">Loading...</p></main>`;
    if (this.error && !this.teamData)
      return html`<main class="container"><p class="muted">Error: ${this.error}</p></main>`;
    if (!this.teamData) return html`<main class="container"><p class="muted">Team not found.</p></main>`;
    const team = this.teamData;
    const games = this.games;
    const favKey = 'favTeams';
    const localFavs = JSON.parse(localStorage.getItem(favKey) || '[]');
    const isFav = localFavs.includes(team.name);

    return html`
      <main class="container">
        <nav class="back-links">
          <a href="teamchooser.html" data-back-link data-back-fallback="teamchooser.html">Back</a>
          <span class="divider" aria-hidden="true">&middot;</span>
          <a href="index.html">Back to Home</a>
        </nav>
        <h1>Team Profile</h1>
        <section class="layout">
          <aside>
            <h2>Games</h2>
            ${games.length ? this.renderGameNav() : html`<p class="muted">No games listed.</p>`}
            <div class="region-card">
              <dt>Region</dt>
              <dd>${team.region || 'Global'}</dd>
            </div>
          </aside>
          <div class="content">
            <article class="card">
              <header>
                <div>
                  <p class="eyebrow">${team.tag || team.id}</p>
                  <h2>${team.name}</h2>
                </div>
                <button class="fav ${isFav ? 'active' : ''}" @click=${this.toggleFavorite}>
                  ${isFav ? 'Favorited' : 'Favorite'}
                </button>
              </header>
              ${this.renderMeta()}
              <section class="roster-panel">
                <div class="roster-head">
                  <div>
                    <p class="eyebrow">Roster</p>
                    <h3>${this.selectedGame || games[0] || 'Players'}</h3>
                  </div>
                  ${games.length > 1
                    ? html`<p class="muted">Tap a game on the left to switch between rosters.</p>`
                    : null}
                </div>
                ${this.renderRosterList()}
              </section>
            </article>
          </div>
        </section>
      </main>
    `;
  }
}

customElements.define('team-view', TeamView);
