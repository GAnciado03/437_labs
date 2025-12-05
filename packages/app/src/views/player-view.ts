import { LitElement, css, html } from "lit";
import { apiFetch, apiUrl } from "../utils/api";

type Player = {
  id: string;
  name: string;
  team?: string;
  game?: string;
  role?: string;
  bio?: string;
  stats?: Record<string, unknown>;
};

export class PlayerViewElement extends LitElement {
  static properties = {
    playerId: { type: String, attribute: "player-id", reflect: true },
    players: { state: true },
    loading: { state: true },
    error: { state: true },
    selected: { state: true },
    favorites: { state: true },
    searchTerm: { state: true }
  } as const;

  playerId?: string;
  players: Player[] = [];
  loading = false;
  error = "";
  selected?: Player;
  favorites: string[] = [];
  searchTerm = "";

  connectedCallback() {
    super.connectedCallback();
    this.loadPlayers();
    this.readFavorites();
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has("playerId") || (changed.has("players") && this.players.length)) {
      this.syncSelected();
    }
  }

  async loadPlayers() {
    this.loading = true;
    this.error = "";
    try {
      const res = await apiFetch(apiUrl("/api/players"));
      if (res.status === 401) throw new Error("Please log in to view player data.");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();
      this.players = Array.isArray(payload) ? payload : payload ? [payload] : [];
      this.syncSelected();
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
    } finally {
      this.loading = false;
    }
  }

  syncSelected() {
    if (!this.players.length) return;
    const key = (this.playerId || "").toLowerCase();
    const found = this.players.find((p) => (p.id || "").toLowerCase() === key);
    this.selected = found || this.players[0];
  }

  private getFilteredPlayers() {
    if (!this.searchTerm.trim()) return this.players;
    const term = this.searchTerm.trim().toLowerCase();
    return this.players.filter((player) => {
      const source = `${player.name ?? ""} ${player.team ?? ""} ${player.game ?? ""}`.toLowerCase();
      return source.includes(term);
    });
  }

  private onSearchInput = (event: Event) => {
    const value = (event.target as HTMLInputElement)?.value ?? "";
    this.searchTerm = value;
  };

  private readFavorites() {
    try {
      const raw = localStorage.getItem("favPlayers");
      const parsed = raw ? JSON.parse(raw) : [];
      this.favorites = Array.isArray(parsed) ? parsed : [];
    } catch {
      this.favorites = [];
    }
  }

  private toggleFavorite = () => {
    const player = this.selected;
    if (!player?.id) return;
    const next = new Set(this.favorites);
    if (next.has(player.id)) {
      next.delete(player.id);
    } else {
      next.add(player.id);
    }
    const list = Array.from(next);
    localStorage.setItem("favPlayers", JSON.stringify(list));
    this.favorites = list;
  };

  private isFavorite(playerId?: string) {
    if (!playerId) return false;
    const id = playerId.toLowerCase();
    return this.favorites.some((fav) => fav.toLowerCase() === id);
  }

  renderSidebar() {
    if (!this.players.length) return null;
    const list = this.getFilteredPlayers();
    return html`
      <div class="search">
        <label for="player-search">Search</label>
        <input
          id="player-search"
          type="search"
          placeholder="Find a player"
          .value=${this.searchTerm}
          @input=${this.onSearchInput}
        />
      </div>
      <div class="roster-scroll">
        <ol>
          ${list.map(
            (player) => html`
              <li>
                <a href=${`/app/players/${player.id}`}>
                  ${player.name}
                  ${this.isFavorite(player.id) ? html`<span class="fav-dot" aria-label="Favorite" title="Favorite"></span>` : ""}
                </a>
              </li>
            `
          )}
        </ol>
        ${list.length === 0
          ? html`<p class="muted">No players match "${this.searchTerm}".</p>`
          : ""}
      </div>
    `;
  }

  renderDetail() {
    const player = this.selected;
    if (!player) return html`<p class="muted">Select a player.</p>`;
    const isFav = this.isFavorite(player.id);
    return html`
      <article class="card">
        <header>
          <h2>${player.name}</h2>
          <p class="muted">${player.team || "Free Agent"}</p>
          <button class="fav ${isFav ? "active" : ""}" @click=${this.toggleFavorite}>
            ${isFav ? "Favorited" : "Favorite"}
          </button>
        </header>
        <dl>
          <div>
            <dt>Game</dt>
            <dd>${player.game || "Valorant"}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>${player.role || "Flex"}</dd>
          </div>
        </dl>
        <p>${player.bio || "Player bio loading from API."}</p>
      </article>
    `;
  }

  render() {
    if (this.loading) return html`<p class="muted">Loading players…</p>`;
    if (this.error) return html`<p class="muted">${this.error}</p>`;

    return html`
      <main>
        <h1>Players</h1>
        <section class="layout">
          <aside>
            <h2>Roster</h2>
            ${this.renderSidebar()}
          </aside>
          <div class="content">
            ${this.renderDetail()}
          </div>
        </section>
      </main>
    `;
  }

  static styles = css`
    :host {
      display: block;
      color: var(--color-text, #0f172a);
    }
    main {
      max-width: 1100px;
      margin: 0 auto;
      padding: var(--space-4, 2rem);
    }
    .layout {
      display: grid;
      grid-template-columns: minmax(240px, 1fr) 2fr;
      gap: var(--space-5, 3rem);
      align-items: start;
    }
    aside {
      border-right: 1px solid var(--color-border, #e2e8f0);
      padding-right: 1.5rem;
      max-height: calc(100vh - 200px);
      display: flex;
      flex-direction: column;
    }
    .search {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      margin-bottom: 1rem;
    }
    .search label {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-muted, #475569);
    }
    .search input {
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 999px;
      padding: 0.4rem 0.85rem;
      background: var(--color-surface, #fff);
      color: inherit;
    }
    .roster-scroll {
      overflow-y: auto;
      padding-right: 0.5rem;
      flex: 1 1 auto;
    }
    ol {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    a {
      color: var(--color-accent, #4f46e5);
      text-decoration: none;
      font-weight: 600;
    }
    a:hover {
      text-decoration: underline;
    }
    .card {
      padding: var(--space-4, 2rem);
      border-radius: 1rem;
      background: var(--color-surface, #fff);
      color: inherit;
      box-shadow: var(--shadow-md, 0 20px 50px rgba(15, 23, 42, 0.08));
      border: 1px solid var(--color-border, #e2e8f0);
    }
    .card header {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-bottom: 1.5rem;
    }
    dl {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }
    dt {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-muted, #475569);
    }
    dd {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0;
    }
    .fav {
      align-self: flex-start;
      border: 1px solid var(--color-border, #e2e8f0);
      padding: 0.35rem 0.9rem;
      border-radius: 999px;
      background: var(--color-surface, transparent);
      cursor: pointer;
      font-weight: 600;
      color: inherit;
    }
    .fav.active {
      background: var(--color-accent, #4f46e5);
      color: var(--color-accent-contrast, #fff);
      border-color: transparent;
    }
    .fav-dot {
      display: inline-block;
      width: 0.65rem;
      height: 0.65rem;
      border-radius: 50%;
      background: var(--color-accent, #4f46e5);
      margin-left: 0.35rem;
    }
    .muted {
      color: var(--color-muted, #94a3b8);
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }
    @media (max-width: 800px) {
      .layout {
        grid-template-columns: 1fr;
      }
      aside {
        border-right: none;
        border-bottom: 1px solid var(--color-border, #e2e8f0);
        padding-bottom: 1.5rem;
        margin-bottom: 1.5rem;
        max-height: none;
      }
      .roster-scroll {
        max-height: none;
        overflow: visible;
      }
    }
  `;
}

customElements.define("player-view", PlayerViewElement);

