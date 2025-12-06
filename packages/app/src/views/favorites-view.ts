import { View } from "@calpoly/mustang";
import { css, html } from "lit";
import type { Player } from "server/models";
import { MODEL_CONTEXT } from "../contexts";
import type { Model } from "../model";
import type { Msg } from "../messages";

export class FavoritesViewElement extends View<Model, Msg> {
  constructor() {
    super(MODEL_CONTEXT);
  }

  connectedCallback() {
    super.connectedCallback();
    this.dispatchMessage(["favorites/init"]);
    this.dispatchMessage(["players/request"]);
  }

  private get favorites(): string[] {
    return this.model.favorites ?? [];
  }

  private get favoritePlayers(): Player[] {
    if (!this.favorites.length) return [];
    const favoriteIds = new Set(
      this.favorites.map((fav) => fav.toLowerCase())
    );
    return this.model.players.filter((player) =>
      favoriteIds.has((player.id || "").toLowerCase())
    );
  }

  render() {
    if (!this.favorites.length) {
      return html`
        <main>
          <h1>Favorites</h1>
          <p>You have not pinned any players yet. Visit the Players view and mark a few favorites.</p>
        </main>
      `;
    }

    if (
      this.model.playersStatus === "loading" ||
      (this.model.playersStatus === "idle" && !this.model.players.length)
    ) {
      return html`<p class="muted">Loading favorites.</p>`;
    }

    if (this.model.playersStatus === "error") {
      return html`<p class="muted">${this.model.playersError ?? "Unable to load favorites."}</p>`;
    }

    const favorites = this.favoritePlayers;
    if (!favorites.length) {
      return html`
        <main>
          <h1>Favorites</h1>
          <p>Your favorites will appear once player data finishes syncing. Please try again soon.</p>
        </main>
      `;
    }

    return html`
      <main>
        <h1>Favorites</h1>
        <ul class="fav-list">
          ${favorites.map(
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
    .muted {
      color: var(--color-muted, #94a3b8);
      font-size: 0.9rem;
    }
  `;
}

customElements.define("favorites-view", FavoritesViewElement);
