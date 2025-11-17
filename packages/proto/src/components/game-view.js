import { LitElement, html, unsafeCSS } from 'lit';
import gameViewStyles from '../styles/game-view.css?inline';

export class GameView extends LitElement {
  static styles = unsafeCSS(gameViewStyles);

  static properties = {
    src: { type: String },
    id: { type: String, reflect: true },
    games: { state: true },
    loading: { state: true },
    error: { state: true }
  };

  constructor() {
    super();
    this.src = '/data/games.json';
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

  willUpdate(changed) {
    if (changed.has('src')) this.fetchData();
  }

  async fetchData() {
    if (!this.src) return;
    this.loading = true;
    this.error = null;
    try {
      const res = await fetch(this.src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const list = await res.json();
      this.games = Array.isArray(list) ? list : [];
    } catch (err) {
      this.error = String(err);
    } finally {
      this.loading = false;
    }
  }

  renderGameList() {
    if (!this.games.length) return html`<p class="muted">No games found.</p>`;
    return html`
      <ul>
        ${this.games.map(g => html`
          <li>
            <a href="game.html?id=${g.id}"><strong>${g.title}</strong></a>
            <span class="muted">· ${g.genre}</span>
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
        <p>Genre: ${game.genre}</p>
        <h2 style="margin-top: var(--space-3)">Teams</h2>
      </div>
      <team-list src="${game.teamsSrc}" show-player-link></team-list>
    `;
  }

  render() {
    if (this.loading) {
      return html`<main class="container"><p class="muted">Loading…</p></main>`;
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
