import { LitElement, css, html } from "lit";
import { apiFetch, apiUrl } from "../utils/api";

type Player = {
  id: string;
  name: string;
  team?: string;
  game?: string;
};

export class FavoritesViewElement extends LitElement {
  static properties = {
    loading: { state: true },
    error: { state: true },
    players: { state: true }
  } as const;

  loading = false;
  error = "";
  players: Player[] = [];

  connectedCallback() {
    super.connectedCallback();
    this.loadFavorites();
  }

  private getFavoriteIds(): string[] {
    try {
      const value = localStorage.getItem("favPlayers");
      const parsed = value ? JSON.parse(value) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async loadFavorites() {
    const ids = this.getFavoriteIds();
    if (!ids.length) {
      this.players = [];
      return;
    }
    this.loading = true;
    this.error = "";
    try {
      const responses = await Promise.all(
        ids.map((id) => apiFetch(apiUrl(`/api/players/${id}`)))
      );
      const players: Player[] = [];
      for (const res of responses) {
        if (res.status === 401) {
          throw new Error("Please log in to view favorites.");
        }
        if (!res.ok) continue;
        players.push(await res.json());
      }
      this.players = players;
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading) return html`<p class="muted">Loading favorites.</p>`;
    if (this.error) return html`<p class="muted">${this.error}</p>`;
    if (!this.players.length) {
      return html`
        <main>
          <h1>Favorites</h1>
          <p>You have not pinned any players yet. Visit the Players view and mark a few favorites.</p>
        </main>
      `;
    }

    return html`
      <main>
        <h1>Favorites</h1>
        <ul class="fav-list">
          ${this.players.map(
            (player) => html`
              <li>
                <a href=${`/app/players/${player.id}`}>
                  <strong>${player.name}</strong>
                  <span>${player.team || "Free Agent"}</span>
                </a>
              </li>
            `
          )}
        </ul>
      </main>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    main {
      max-width: 800px;
      margin: 0 auto;
      padding: var(--space-4, 2rem);
    }
    .fav-list {
      list-style: none;
      padding: 0;
      display: grid;
      gap: 0.75rem;
    }
    li {
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 0.75rem;
      padding: 1rem 1.25rem;
      background: var(--color-surface, #fff);
    }
    a {
      color: inherit;
      text-decoration: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    span {
      color: var(--color-muted, #475569);
    }
  `;
}

customElements.define("favorites-view", FavoritesViewElement);

