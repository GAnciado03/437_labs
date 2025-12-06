import { LitElement, html, css } from "lit";
import { apiFetch, apiUrl } from "../utils/api.ts";
import "./team-detail-card.js";

export class TeamChooser extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: var(--space-3, 1rem) var(--space-3, 1.5rem);
      display: flex;
      flex-direction: column;
      gap: var(--space-2, 0.75rem);
    }
    h1 {
      margin: 0 auto var(--space-3, 1.5rem);
      text-align: center;
    }
    .layout {
      display: grid;
      grid-template-columns: minmax(260px, 320px) minmax(520px, 1fr);
      gap: var(--space-5, 3rem);
      align-items: start;
      width: 100%;
    }
    aside {
      border-right: 1px solid var(--color-border, #e2e8f0);
      padding-right: var(--space-3, 1.25rem);
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: calc(100vh - 220px);
    }
    .filter-panel {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .filter-panel label {
      display: grid;
      gap: 0.35rem;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-muted, #94a3b8);
    }
    .filter-panel input,
    .filter-panel select {
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 10px;
      padding: 0.45rem 0.8rem;
      font-size: 0.95rem;
      background: var(--color-surface, #fff);
      color: inherit;
    }
    .filter-panel button {
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 10px;
      padding: 0.45rem 0.8rem;
      font-weight: 600;
      background: transparent;
      cursor: pointer;
      color: inherit;
    }
    :host-context(body.dark) .filter-panel input,
    :host-context(body.dark) .filter-panel select,
    :host-context(body.dark) .filter-panel button {
      background: #0f172a;
      border-color: #1f2937;
      color: #e2e8f0;
    }
    .results {
      overflow-y: auto;
      padding-right: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      flex: 1 1 auto;
    }
    .team-button {
      width: 100%;
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 999px;
      padding: 0.35rem 0.85rem;
      background: transparent;
      text-align: left;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: background 0.15s ease;
      color: inherit;
    }
    .team-button.active {
      background: rgba(79, 70, 229, 0.12);
    }
    .team-label {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }
    .team-results-empty {
      margin: 0;
    }
    .content {
      min-height: 360px;
      width: 100%;
      max-width: 640px;
      margin: 0 auto;
    }
    @media (max-width: 960px) {
      .layout {
        grid-template-columns: 1fr;
      }
      aside {
        border-right: none;
        border-bottom: 1px solid var(--color-border, #e2e8f0);
        padding-right: 0;
        padding-bottom: var(--space-3, 1rem);
        max-height: none;
      }
      .content {
        max-width: none;
      }
    }
  `;

  static properties = {
    teams: { state: true },
    loading: { state: true },
    error: { state: true },
    filterType: { state: true },
    filterValue: { state: true },
    selectedTeam: { state: true },
    regionOptions: { state: true },
    gameOptions: { state: true }
  };

  constructor() {
    super();
    this.teams = [];
    this.loading = false;
    this.error = "";
    this.filterType = "team";
    this.filterValue = "";
    this.selectedTeam = null;
    this.regionOptions = [];
    this.gameOptions = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadTeams();
  }

  async loadTeams() {
    this.loading = true;
    this.error = "";
    try {
      const res = await apiFetch(apiUrl("/api/teams?limit=1200"));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();
      const list = Array.isArray(payload) ? payload : [];
      this.teams = list;
      this.buildOptions(list);
      if (list[0]) {
        this.selectTeam(list[0]);
      } else {
        this.selectedTeam = null;
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
      this.teams = [];
    } finally {
      this.loading = false;
    }
  }

  buildOptions(list) {
    const regions = new Set();
    const games = new Set();
    list.forEach((team) => {
      const region = (team.region || "").trim();
      if (region) regions.add(region);
      const game = (team.game || "").trim();
      if (game) games.add(game);
    });
    if (![...games].some((game) => game.toLowerCase() === "valorant")) {
      games.add("Valorant");
    }
    this.regionOptions = Array.from(regions).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    this.gameOptions = Array.from(games).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  }

  get filteredTeams() {
    const value = (this.filterValue || "").trim().toLowerCase();
    if (!value) return this.teams;
    switch (this.filterType) {
      case "region":
        return this.teams.filter((team) => (team.region || "").toLowerCase() === value);
      case "game": {
        return this.teams.filter((team) => {
          const game = (team.game || "Valorant").toLowerCase();
          return game === value;
        });
      }
      default:
        return this.teams.filter((team) => (team.name || "").toLowerCase().includes(value));
    }
  }

  handleFilterTypeChange = (event) => {
    this.filterType = event.target.value;
    this.filterValue = "";
  };

  handleFilterValueChange = (event) => {
    this.filterValue = (event.target.value || "").trim();
  };

  resetFilters = () => {
    this.filterType = "team";
    this.filterValue = "";
  };

  async selectTeam(team) {
    if (!team) return;
    const key = team.tag || team.id || team.name;
    if (!key) {
      this.selectedTeam = team;
      return;
    }
    try {
      const res = await apiFetch(apiUrl(`/api/teams/${encodeURIComponent(key)}`));
      if (res.ok) {
        this.selectedTeam = await res.json();
        return;
      }
    } catch {
      /* ignore */
    }
    this.selectedTeam = team;
  }

  renderFilterControl() {
    if (this.filterType === "region") {
      return html`
        <label>
          Region
          <select .value=${this.filterValue} @change=${this.handleFilterValueChange}>
            <option value="">All regions</option>
            ${this.regionOptions.map((region) => html`<option value=${region}>${region}</option>`)}
          </select>
        </label>
      `;
    }
    if (this.filterType === "game") {
      return html`
        <label>
          Game
          <select .value=${this.filterValue} @change=${this.handleFilterValueChange}>
            <option value="">All games</option>
            ${this.gameOptions.map((game) => html`<option value=${game}>${game}</option>`)}
          </select>
        </label>
      `;
    }
    return html`
      <label>
        Search
        <input
          type="search"
          placeholder="Find a team"
          .value=${this.filterValue}
          @input=${this.handleFilterValueChange}
        />
      </label>
    `;
  }

  renderTeamResults() {
    const list = this.filteredTeams;
    return html`
      <div class="results" role="listbox" aria-label="Teams">
        ${list.map((team) => {
          const displayName = team?.name || team?.tag || team?.id;
          const shortId = team?.tag || team?.id || team?.name || "";
          const isActive = this.selectedTeam?.id === team.id;
          return html`
            <button
              type="button"
              class=${isActive ? "team-button active" : "team-button"}
              @click=${() => this.selectTeam(team)}
              aria-selected=${String(isActive)}
            >
              <span class="team-label">
                <strong>${displayName}</strong>
              </span>
              <code>${shortId}</code>
            </button>
          `;
        })}
        ${!list.length ? html`<p class="muted team-results-empty">No teams match the current filter.</p>` : null}
      </div>
    `;
  }

  renderDetailPanel() {
    if (!this.selectedTeam) {
      return html`<div class="card empty"><p class="muted">Select a team from the list.</p></div>`;
    }
    return html`<team-detail-card .team=${this.selectedTeam}></team-detail-card>`;
  }

  render() {
    if (this.loading) return html`<main class="container"><p class="muted">Loading teams...</p></main>`;
    if (this.error) return html`<main class="container"><p class="muted">${this.error}</p></main>`;

    return html`
      <main class="container">
        <nav class="back-links">
          <a href="index.html" data-back-link data-back-fallback="index.html">Back</a>
          <span class="divider" aria-hidden="true">&middot;</span>
          <a href="index.html">Back to Home</a>
        </nav>
        <h1>Teams</h1>
        <section class="layout">
          <aside>
            <h2>Filters</h2>
            <div class="filter-panel">
              <label>
                Filter Type
                <select .value=${this.filterType} @change=${this.handleFilterTypeChange}>
                  <option value="team">Team Name</option>
                  <option value="region">Region</option>
                  <option value="game">Game</option>
                </select>
              </label>
              ${this.renderFilterControl()}
              <button type="button" @click=${this.resetFilters}>Reset</button>
            </div>
            ${this.renderTeamResults()}
          </aside>
          <div class="content">
            ${this.renderDetailPanel()}
          </div>
        </section>
      </main>
    `;
  }
}

customElements.define("team-chooser", TeamChooser);
