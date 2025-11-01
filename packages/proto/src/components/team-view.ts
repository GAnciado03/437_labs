import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

type Player = { id: string; name: string; team: string; role: string; kda?: string };

@customElement('team-view')
export class TeamView extends LitElement {
  static styles = css`
    :host { display: block; }
    .muted { color: var(--color-muted,#666); }
    ul { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-2,.75rem); }
    li { padding: var(--space-2,.75rem); border: 1px solid var(--color-border,#e5e7eb); border-radius: var(--radius-md,10px); background: var(--color-surface,#fff); }
  `;

  @property({ type: String }) src = '/data/players.json';
  @property({ type: String, reflect: true }) id = '';

  @state() private allPlayers: Player[] = [];
  @state() private teamPlayers: Player[] = [];
  @state() private loading = false;
  @state() private error: string | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    const urlId = new URL(location.href).searchParams.get('id') || '';
    if (!this.id && urlId) this.id = urlId;
  }

  willUpdate(changed: Map<string, unknown>): void {
    if (changed.has('src') || changed.has('id')) this.fetchData();
  }

  async fetchData() {
    this.loading = true; this.error = null;
    try {
      const res = await fetch(this.src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as Player[];
      this.allPlayers = Array.isArray(data) ? data : [];
      this.filterRoster();
    } catch (e: any) {
      this.error = String(e);
    } finally {
      this.loading = false;
    }
  }

  private filterRoster() {
    const key = (this.id || '').toLowerCase();
    if (!key) { this.teamPlayers = []; return; }
    this.teamPlayers = this.allPlayers.filter(p => (p.team || '').toLowerCase() === key);
  }

  render() {
    if (this.loading) return html`<main class="container"><p class="muted">Loading…</p></main>`;
    if (this.error) return html`<main class="container"><p class="muted">Error: ${this.error}</p></main>`;
    const team = this.id || (this.teamPlayers[0]?.team ?? 'Team');
    return html`
      <main class="container">
        <p style="margin: 0 0 var(--space-2);">
          <a href="events.html">Events</a>
          ·
          <a href="index.html">Back to Home</a>
        </p>
        <h1>Team Profile</h1>
        <p>Team Name: ${team}</p>
        <h2 style="margin-top: var(--space-3)">Members</h2>
        ${this.teamPlayers.length === 0 ? html`<p class="muted">No members found.</p>` : html`
          <ul>
          ${this.teamPlayers.map(p => html`
            <li>
              <a href="player.html?id=${p.id}"><strong>${p.name}</strong></a> · ${p.role}
              ${p.kda ? html`<div class="muted">KDA: ${p.kda}</div>` : null}
            </li>
          `)}
          </ul>
        `}
      </main>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'team-view': TeamView } }

