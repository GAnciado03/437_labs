import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

type PlayerDetails = {
  id: string;
  name: string;
  team: string;
  role: string;
  achievements?: string[];
  stats?: { kda?: string; winRate?: number; matches?: number };
};

@customElement('player-view')
export class PlayerView extends LitElement {
  static styles = css`
    :host { display: block; }
    .muted { color: var(--color-muted,#666); }
  `;

  @property({ type: String }) src = '/data/player-details.json';
  @property({ type: String, reflect: true }) id = '';

  @state() private player?: PlayerDetails;
  @state() private loading = false;
  @state() private error: string | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    const urlId = new URL(location.href).searchParams.get('id') || '';
    if (!this.id && urlId) this.id = urlId;
  }

  willUpdate(changed: Map<string, unknown>): void {
    if (changed.has('src') || changed.has('id')) {
      this.fetchData();
    }
  }

  async fetchData() {
    if (!this.src) return;
    this.loading = true; this.error = null; this.player = undefined;
    try {
      const res = await fetch(this.src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const list = (await res.json()) as PlayerDetails[];
      const key = (this.id || '').toLowerCase();
      this.player = list.find(p => p.id.toLowerCase() === key) || list[0];
    } catch (e: any) {
      this.error = String(e);
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading) return html`<p class="muted">Loading…</p>`;
    if (this.error) return html`<p class="muted">Error: ${this.error}</p>`;
    if (!this.player) return html`<p class="muted">No player found.</p>`;
    const p = this.player;
    const id = p.id;
    const achievements = p.achievements?.join(', ') || '—';
    return html`
      <main class="container">
        <p style="margin: 0 0 var(--space-2);">
          <a href="stats.html?id=${id}">View Stats</a>
          ·
          <a href="index.html">Back to Home</a>
        </p>
        <h1>Player Profile</h1>
        <p>Player Name: ${p.name}</p>
        <p>Role: <a href="stats.html?id=${id}">${p.role}</a></p>
        <p>Team: <a href="team.html?id=${encodeURIComponent(p.team)}">${p.team}</a></p>
        <p>Achievements: ${achievements}</p>

        <h2 style="margin-top: var(--space-3)">Players</h2>
        <player-list src="/data/players.json"></player-list>
      </main>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'player-view': PlayerView } }
