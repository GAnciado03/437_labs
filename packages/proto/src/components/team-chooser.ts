import { LitElement, html, css } from "lit";
import "./team-list.js";
import { apiFetch, apiUrl } from "../utils/api.ts";

export class TeamChooser extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .filter-panel {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: flex-end;
      justify-content: center;
      margin: var(--space-3) 0;
    }
    .filter-panel label {
      display: grid;
      gap: 0.25rem;
      font-weight: 600;
    }
    .filter-panel select,
    .filter-panel input {
      min-width: 180px;
      padding: 0.45rem 0.6rem;
      border-radius: var(--radius-sm, 6px);
      border: 1px solid var(--color-border, #e5e7eb);
      background: var(--color-surface, #fff);
      color: var(--color-text, #111);
    }
    .filter-panel button {
      padding: 0.45rem 0.75rem;
      border-radius: var(--radius-sm, 6px);
      border: 1px solid var(--color-border, #e5e7eb);
      background: var(--color-surface, #fff);
      color: var(--color-text, #111);
      cursor: pointer;
    }
    :host-context(body.dark) .filter-panel select,
    :host-context(body.dark) .filter-panel input,
    :host-context(body.dark) .filter-panel button {
      background: var(--color-surface, #111827);
      border-color: var(--color-border, #1f2937);
      color: var(--color-text, #e5e7eb);
    }
    .list-box {
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-md, 12px);
      padding: 0.5rem 0.75rem;
      background: var(--color-surface, #fff);
      max-height: min(60vh, 600px);
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
      margin-top: var(--space-3, 1rem);
    }
    :host-context(body.dark) .list-box {
      background: #111827;
      border-color: #1f2937;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
    }
  `;

  static properties = {
    query: { type: String },
    filterType: { type: String },
    selectedGame: { type: String },
    games: { state: true }
  };

  query: string;
  filterType: string;
  selectedGame: string;
  games: string[];

  constructor() {
    super();
    this.query = "";
    this.filterType = "all";
    this.selectedGame = "";
    this.games = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadGames();
  }

  async loadGames() {
    try {
      const res = await apiFetch(apiUrl("/api/teams?limit=2000"));
      if (!res.ok) return;
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      const set = new Set<string>();
      list.forEach((team) => {
        const game = (team?.game || "Valorant").trim();
        if (game) set.add(game);
      });
      this.games = Array.from(set).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" })
      );
    } catch {
      /* ignore */
    }
  }

  updateQuery(event: Event) {
    this.query = (event.target as HTMLInputElement).value ?? "";
  }

  handleFilterTypeChange(event: Event) {
    const next = (event.target as HTMLSelectElement).value;
    this.filterType = next;
    if (next === "all") this.selectedGame = "";
  }

  handleGameChange(event: Event) {
    this.selectedGame = (event.target as HTMLSelectElement).value || "";
  }

  clearFilters() {
    this.query = "";
    this.filterType = "all";
    this.selectedGame = "";
  }

  render() {
    return html`
      <main class="container">
        <nav class="back-links">
          <a href="index.html" data-back-link data-back-fallback="index.html">Back</a>
          <span class="divider" aria-hidden="true">·</span>
          <a href="index.html">Back to Home</a>
        </nav>
        <h1 style="text-align: center;">Choose a Team</h1>
        <p class="muted" style="text-align: center;">Browse teams and jump into their rosters.</p>
        <div class="filter-panel">
          <label>
            <span>Filter</span>
            <select .value=${this.filterType} @change=${this.handleFilterTypeChange}>
              <option value="all">All Teams</option>
              <option value="game">By Game</option>
            </select>
          </label>
          ${this.filterType === "game"
            ? html`
                <label>
                  <span>Game</span>
                  <select .value=${this.selectedGame} @change=${this.handleGameChange}>
                    <option value="">Select game</option>
                    ${this.games.map(
                      (game) => html`<option value=${game}>${game}</option>`
                    )}
                  </select>
                </label>
              `
            : null}
          <label>
            <span>Search</span>
            <input
              type="text"
              placeholder="Search team name"
              .value=${this.query}
              @input=${this.updateQuery}
            />
          </label>
          <button type="button" @click=${this.clearFilters}>Clear Filters</button>
        </div>
        <section class="list-box" role="region" aria-label="Team list">
          <team-list
            src="/api/teams"
            .limit=${1200}
            .query=${this.query}
            .game=${this.filterType === "game" ? this.selectedGame : ""}
            hide-region
          ></team-list>
        </section>
      </main>
    `;
  }
}

customElements.define("team-chooser", TeamChooser);
