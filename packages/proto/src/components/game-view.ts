import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

type Game = {
  id: string;
  title: string;
  genre: string;
  teamsSrc: string;
};

@customElement('game-view')
export class GameView extends LitElement {
  static styles = css`
    :host { display: block; }
    .muted { color: var(--color-muted,#666); }
    h1 { text-align: center; margin-bottom: var(--space-3, 1rem); }
    p.top-links { display: none; }
    .center-col {
      max-width: 720px;
      width: 100%;
      margin: 0 auto;
    }
    ul {
      list-style: none;
      margin: 0 auto; /* center list */
      padding: 0;
      display: grid;
      gap: var(--space-2,.75rem);
      max-width: 720px;
      width: 100%;
    }
    li { display: flex; align-items: center; gap: .5rem; }
  `;

  @property({ type: String }) src = '/data/games.json';
  @property({ type: String, reflect: true }) id = '';

  @state() private games: Game[] = [];
  @state() private loading = false;
  @state() private error: string | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    const urlId = new URL(location.href).searchParams.get('id') || '';
    if (!this.id && urlId) this.id = urlId;
  }

  willUpdate(changed: Map<string, unknown>): void {
    if (changed.has('src')) this.fetchData();
  }

  async fetchData() {
    if (!this.src) return;
    this.loading = true; this.error = null;
    try {
      const res = await fetch(this.src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const list = (await res.json()) as Game[];
      this.games = Array.isArray(list) ? list : [];
    } catch (e: any) {
      this.error = String(e);
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
      </ul>`;
  }

  renderSelectedGame(game: Game) {
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
      <team-list src="${game.teamsSrc}"></team-list>
    `;
  }

  render() {
    if (this.loading) return html`<main class="container"><p class="muted">Loading…</p></main>`;
    if (this.error) return html`<main class="container"><p class="muted">Error: ${this.error}</p></main>`;
    const game = this.id ? this.games.find(g => g.id.toLowerCase() === this.id.toLowerCase()) : undefined;
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

declare global { interface HTMLElementTagNameMap { 'game-view': GameView } }


