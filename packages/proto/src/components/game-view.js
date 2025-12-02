import { LitElement, html, unsafeCSS } from 'lit';
import { apiFetch, apiUrl } from '../utils/api.ts';
import './team-list.js';
import gameViewStyles from '../../styles/game-view.css?inline';

export class GameView extends LitElement {
  static styles = unsafeCSS(gameViewStyles);

  static properties = {
    id: { type: String, reflect: true },
    games: { state: true },
    loading: { state: true },
    error: { state: true }
  };

  constructor() {
    super();
    this.id = '';
    this.games = [];
    this.loading = false;
    this.error = null;
  }

  connectedCallback() {
    super.connectedCallback();
    const urlId = new URL(location.href).searchParams.get('id') || '';
    if (!this.id && urlId) this.id = urlId;
  }

  connectedCallback() {
    super.connectedCallback();
    const urlId = new URL(location.href).searchParams.get('id') || '';
    if (!this.id && urlId) this.id = urlId;
    this.fetchData();
  }

  async fetchData() {
    this.loading = true;
    this.error = null;
    try {
      const res = await apiFetch(apiUrl('/api/teams'));
      if (res.status === 401) throw new Error('Please log in to view games.');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const teams = await res.json();
      this.games = this.buildGames(Array.isArray(teams) ? teams : []);
    } catch (err) {
      this.error = String(err);
    } finally {
      this.loading = false;
    }
  }

  buildGames(teams) {
    const map = new Map();
    teams.forEach(team => {
      const game = (team.game || 'Valorant').trim();
      if (!map.has(game)) {
        map.set(game, { id: game, title: game, teams: [] });
      }
      map.get(game).teams.push(team);
    });
    return Array.from(map.values()).sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
    );
  }

  renderGameList() {
    if (!this.games.length) return html`<p class="muted">No games found.</p>`;
    return html`
      <ul>
        ${this.games.map(g => html`
          <li>
            <a href="game.html?id=${encodeURIComponent(g.id)}"><strong>${g.title}</strong></a>
            <span class="muted">· Teams: ${g.teams.length}</span>
          </li>
        `)}
      </ul>
    `;
  }

  renderSelectedGame(game) {
    return html`
      <p class="top-links" style="margin: 0 0 var(--space-2);">
        <a href="game.html">Back to Games</a> ·
        <a href="index.html">Back to Home</a>
      </p>
      <h1>Game: ${game.title}</h1>
      <div class="center-col">
        <p>Teams competing in ${game.title}</p>
        <h2 style="margin-top: var(--space-3)">Teams</h2>
      </div>
      <team-list src="/api/teams" .game=${game.title} show-player-link></team-list>
    `;
  }

  render() {
    if (this.loading) {
      return html`<main class="container"><p class="muted">Loading...</p></main>`;
    }
    if (this.error) {
      return html`<main class="container"><p class="muted">Error: ${this.error}</p></main>`;
    }
    const game = this.id
      ? this.games.find(g => (g.id || '').toLowerCase() === this.id.toLowerCase())
      : undefined;
    return html`
      <main class="container">
        ${this.id && game
          ? this.renderSelectedGame(game)
          : html`
              <h1>Games</h1>
              ${this.renderGameList()}
            `}
      </main>
    `;
  }
}

customElements.define('game-view', GameView);
