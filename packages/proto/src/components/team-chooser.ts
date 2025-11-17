import { LitElement, html, css } from "lit";
import "./team-list.js";

const LOL_SRC = "/data/teams.json";
const VAL_SRC = "/data/valorant-teams.json";

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
    game: { type: String, reflect: true }
  };

  game: string;

  constructor() {
    super();
    this.game = "lol";
  }

  select(game: string) {
    if (this.game === game) return;
    this.game = game;
  }

  render() {
    const src = this.game === "val" ? VAL_SRC : LOL_SRC;
    return html`
      <main class="container">
        <p style="margin: 0 0 var(--space-2);"><a href="index.html">Back to Home</a></p>
        <h1 style="text-align: center;">Choose a Team</h1>
        <p class="muted" style="text-align: center;">Select a team to view its roster.</p>
        <div class="filter-bar">
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
          <team-list src=${src} hide-region show-player-link></team-list>
        </section>
      </main>
    `;
  }
}

customElements.define("team-chooser", TeamChooser);
