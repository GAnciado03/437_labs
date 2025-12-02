import { LitElement, html, css } from "lit";
import "./team-list.js";

export class TeamChooser extends LitElement {
  static styles = css`
    :host { display: block; }
    .filter-bar {
      display: flex;
      gap: var(--space-2);
      justify-content: center;
      margin: var(--space-2) 0;
      flex-wrap: wrap;
    }
    .filter-btn {
      padding: .45rem .85rem;
      border-radius: var(--radius-sm, 6px);
      border: 1px solid var(--color-border, #e5e7eb);
      background: var(--color-surface, #fff);
      color: var(--color-text, #111);
      font-weight: 600;
      letter-spacing: .3px;
      cursor: pointer;
      transition: background .15s ease, color .15s ease, border-color .15s ease;
    }
    .filter-btn:hover { filter: brightness(0.98); }
    .filter-btn.active {
      background: var(--color-accent);
      border-color: var(--color-accent);
      color: var(--color-accent-contrast);
    }
  `;

  static properties = {
    game: { type: String, reflect: true },
    query: { type: String },
  };

  game: string | null;
  query: string;

  constructor() {
    super();
    this.game = null;
    this.query = '';
  }

  select(game: string | null) {
    this.game = this.game === game ? null : game;
  }

  updateQuery(event: Event) {
    this.query = (event.target as HTMLInputElement).value ?? '';
  }

  render() {
    const gameName =
      this.game === "val" ? "Valorant" :
      this.game === "lol" ? "League of Legends" :
      null;
    return html`
      <main class="container">
        <p style="margin: 0 0 var(--space-2);"><a href="index.html">Back to Home</a></p>
        <h1 style="text-align: center;">Choose a Team</h1>
        <p class="muted" style="text-align: center;">Select a team to view its roster.</p>
        <div style="display:flex; justify-content:center; margin-bottom:var(--space-2);">
          <input
            type="text"
            placeholder="Search team name"
            value=${this.query}
            @input=${this.updateQuery}
            style="min-width:260px; padding:0.45rem 0.6rem; border-radius:var(--radius-sm,6px); border:1px solid var(--color-border,#e5e7eb);"
          />
        </div>
        <div class="filter-bar">
          <button class="filter-btn mono ${this.game === null ? "active" : ""}"
            @click=${() => this.select(null)}>
            All Games
          </button>
          <button class="filter-btn mono ${this.game === "lol" ? "active" : ""}"
            @click=${() => this.select("lol")}>
            League of Legends
          </button>
          <button class="filter-btn mono ${this.game === "val" ? "active" : ""}"
            @click=${() => this.select("val")}>
            Valorant
          </button>
        </div>
        <section style="margin-top: var(--space-2)">
          <team-list
            src="/api/teams"
            .game=${gameName ?? ''}
            .limit=${1200}
            .query=${this.query}
            hide-region
          ></team-list>
        </section>
      </main>
    `;
  }
}

customElements.define("team-chooser", TeamChooser);
