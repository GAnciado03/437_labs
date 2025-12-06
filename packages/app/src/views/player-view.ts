import { View } from "@calpoly/mustang";
import { PropertyValueMap, css, html } from "lit";
import { property, state } from "lit/decorators.js";
import type { Player } from "server/models";
import { MODEL_CONTEXT } from "../contexts";
import type { Model } from "../model";
import type { Msg } from "../messages";

export class PlayerViewElement extends View<Model, Msg> {
  @property({ attribute: "player-id", reflect: true })
  playerId?: string;

  @state()
  private searchTerm = "";

  @state()
  private selectedId = "";

  constructor() {
    super(MODEL_CONTEXT);
  }

  connectedCallback() {
    super.connectedCallback();
    this.dispatchMessage(["players/request"]);
    this.dispatchMessage(["favorites/init"]);
  }

  protected updated(changed: PropertyValueMap<PlayerViewElement>) {
    super.updated(changed);
    if (changed.has("playerId")) {
      this.selectedId = this.playerId ?? "";
    }
    this.reconcileSelection();
  }

  private reconcileSelection() {
    const list = this.players;
    if (!list.length) {
      if (this.selectedId) this.selectedId = "";
      return;
    }
    const attrId = (this.playerId || "").toLowerCase();
    if (attrId) {
      const found = list.find(
        (player) => player.id?.toLowerCase() === attrId
      );
      if (found && found.id !== this.selectedId) {
        this.selectedId = found.id;
        return;
      }
    }
    if (
      !this.selectedId ||
      !list.some((player) => player.id === this.selectedId)
    ) {
      this.selectedId = list[0]?.id ?? "";
    }
  }

  private get players(): Player[] {
    return this.model.players ?? [];
  }

  private get favorites(): string[] {
    return this.model.favorites ?? [];
  }

  private get status() {
    return this.model.playersStatus;
  }

  private get errorMessage() {
    return this.model.playersError ?? "";
  }

  private get filteredPlayers() {
    if (!this.searchTerm.trim()) return this.players;
    const term = this.searchTerm.trim().toLowerCase();
    return this.players.filter((player) => {
      const source = `${player.name ?? ""} ${player.team ?? ""} ${player.game ?? ""}`.toLowerCase();
      return source.includes(term);
    });
  }

  private get currentPlayer(): Player | undefined {
    if (!this.selectedId) return undefined;
    const normalized = this.selectedId.toLowerCase();
    return this.players.find(
      (player) => player.id?.toLowerCase() === normalized
    );
  }

  private onSearchInput = (event: Event) => {
    const value = (event.target as HTMLInputElement)?.value ?? "";
    this.searchTerm = value;
  };

  private toggleFavorite = () => {
    const player = this.currentPlayer;
    if (!player?.id) return;
    this.dispatchMessage(["favorites/toggle", { playerId: player.id }]);
  };

  private isFavorite(playerId?: string) {
    if (!playerId) return false;
    const normalized = playerId.toLowerCase();
    return this.favorites.some(
      (fav) => fav.toLowerCase() === normalized
    );
  }

  private handleSelect(player: Player) {
    if (!player?.id) return;
    this.selectedId = player.id;
  }

  renderSidebar() {
    if (!this.players.length) return null;
    const list = this.filteredPlayers;
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
                <a href=${`/app/players/${player.id}`} @click=${() => this.handleSelect(player)}>
                  ${player.name}
                  ${this.isFavorite(player.id)
                    ? html`<span class="fav-dot" aria-label="Favorite" title="Favorite"></span>`
                    : null}
                </a>
              </li>
            `
          )}
        </ol>
        ${list.length === 0
          ? html`<p class="muted">No players match "${this.searchTerm}".</p>`
          : null}
      </div>
    `;
  }

  renderDetail() {
    const player = this.currentPlayer;
    if (!player) return html`<p class="muted">Select a player.</p>`;
    const isFav = this.isFavorite(player.id);
    return html`
      <article class="card">
        <header>
          <h2>${player.name}</h2>
          <p class="muted">${player.team || "Free Agent"}</p>
        <div class="actions">
            <button class=${isFav ? "action-button active" : "action-button"} @click=${this.toggleFavorite}>
              ${isFav ? "Favorited" : "Favorite"}
            </button>
            ${player.id
              ? html`<a class="action-button link" href=${`/app/players/${player.id}/edit`}>Edit</a>`
              : null}
          </div>
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
        <p>${player.bio || "Bio unavailable."}</p>
      </article>
    `;
  }

  render() {
    if (
      this.status === "loading" ||
      (this.status === "idle" && !this.players.length)
    ) {
      return html`<p class="muted">Loading players.</p>`;
    }
    if (this.status === "error") {
      return html`<p class="muted">${this.errorMessage}</p>`;
    }

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
    li a {
      background: transparent;
      text-decoration: none;
      width: 100%;
      color: var(--color-accent, #4f46e5);
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    li a:hover {
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
    .action-button {
      border: 1px solid var(--color-border, #e2e8f0);
      padding: 0.35rem 1rem;
      border-radius: 999px;
      background: var(--color-surface, #fff);
      cursor: pointer;
      font-weight: 600;
      color: inherit;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      min-width: 104px;
      justify-content: center;
    }
    .action-button.active {
      background: var(--color-accent, #4f46e5);
      color: var(--color-accent-contrast, #fff);
      border-color: transparent;
    }
    .action-button.link {
      background: var(--color-brand-muted, transparent);
      color: var(--color-accent, #4f46e5);
      border-color: var(--color-border, #e2e8f0);
    }
    .fav-dot {
      display: inline-block;
      width: 0.65rem;
      height: 0.65rem;
      border-radius: 50%;
      background: var(--color-accent, #4f46e5);
      margin-left: 0.35rem;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
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
