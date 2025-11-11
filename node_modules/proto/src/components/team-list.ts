import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

type Team = { id: string; name: string; region?: string };

@customElement('team-list')
export class TeamList extends LitElement {
  static styles = css`
    :host { display: block; }
    ul { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-2,.75rem); }
    li { display: flex; align-items: center; gap: .5rem; }
    .muted { color: var(--color-muted,#666); }
  `;

  @property({ type: String }) src = '/data/teams.json';
  @state() private teams: Team[] = [];
  @state() private loading = false;
  @state() private error: string | null = null;

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has('src') && this.src) this.fetchData();
  }

  async fetchData() {
    this.loading = true; this.error = null; this.teams = [];
    try {
      const res = await fetch(this.src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as Team[];
      this.teams = Array.isArray(data) ? data : [];
    } catch (e: any) {
      this.error = String(e);
    } finally { this.loading = false; }
  }

  render() {
    if (this.loading) return html`<p class="muted">Loading…</p>`;
    if (this.error) return html`<p class="muted">Error: ${this.error}</p>`;
    if (!this.teams.length) return html`<p class="muted">No teams found.</p>`;
    return html`
      <ul>
        ${this.teams.map(t => html`
          <li>
            <svg class="icon" aria-hidden="true" style="width: 20px; height: 20px"><use href="icons/icons.svg#icon-team"></use></svg>
            <a href="team.html?id=${encodeURIComponent(t.id)}">${t.name}</a>
            ${t.region ? html`<span class="muted">· ${t.region}</span>` : null}
          </li>
        `)}
      </ul>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'team-list': TeamList } }

