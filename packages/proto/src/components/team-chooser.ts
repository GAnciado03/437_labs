import { LitElement, html, css } from "lit";
import "./team-list.js";

export class TeamChooser extends LitElement {
  static styles = css`
    :host { display: block; }
    .search-container {
      display: flex;
      justify-content: center;
      margin: var(--space-2) 0;
    }
    .search-container input {
      min-width: 260px;
      padding: 0.45rem 0.6rem;
      border-radius: var(--radius-sm, 6px);
      border: 1px solid var(--color-border, #e5e7eb);
      background: var(--color-surface, #fff);
      color: var(--color-text, #111);
    }
    :host-context(body.dark) .search-container input {
      background: var(--color-surface, #111827);
      border-color: var(--color-border, #1f2937);
      color: var(--color-text, #e5e7eb);
    }
  `;

  static properties = {
    query: { type: String },
  };

  query: string;

  constructor() {
    super();
    this.query = '';
  }

  updateQuery(event: Event) {
    this.query = (event.target as HTMLInputElement).value ?? '';
  }

  render() {
    return html`
      <main class="container">
        <p style="margin: 0 0 var(--space-2);"><a href="index.html">Back to Home</a></p>
        <h1 style="text-align: center;">Choose a Team</h1>
        <p class="muted" style="text-align: center;">Select a team to view its roster.</p>
        <div class="search-container">
          <input
            type="text"
            placeholder="Search team name"
            .value=${this.query}
            @input=${this.updateQuery}
          />
        </div>
        <section style="margin-top: var(--space-2)">
          <team-list
            src="/api/teams"
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
