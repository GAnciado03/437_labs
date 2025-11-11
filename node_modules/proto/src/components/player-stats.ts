import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

type Player = {
  id: string; name: string; team: string; role: string;
  achievements?: string[];
  stats?: { kda?: string; winRate?: number; matches?: number };
};

@customElement('player-stats')
export class PlayerStats extends LitElement {
  static styles = css`:host{display:block}`;

  @property({ type: String }) src = '/data/player-details.json';
  @property({ type: String, reflect: true }) id = '';
  @state() private player?: Player;
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
    this.loading = true; this.error = null; this.player = undefined;
    try {
      const res = await fetch(this.src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const list = (await res.json()) as Player[];
      const key = (this.id || '').toLowerCase();
      this.player = list.find(p => p.id.toLowerCase() === key) || list[0];
    } catch (e: any) {
      this.error = String(e);
    } finally { this.loading = false; }
  }

  render() {
    if (this.loading) return html`<main class="container"><p>Loading…</p></main>`;
    if (this.error) return html`<main class="container"><p>Error: ${this.error}</p></main>`;
    if (!this.player) return html`<main class="container"><p>No data.</p></main>`;
    const p = this.player;
    const s = p.stats || {};
    return html`
      <main class="container">
        <p style="margin: 0 0 var(--space-2);">
          <a href="player.html?id=${p.id}">View Player</a>
          ·
          <a href="index.html">Back to Home</a>
        </p>
        <h1>Player Stats</h1>
        <p>Player: <a href="player.html?id=${p.id}">${p.name}</a></p>
        <section class="grid" style="margin-top: var(--space-3)">
          <div class="span-4">
            <stat-card label="K/D/A" .value=${s.kda ?? '—'} icon="insights" accent="#2563eb" clickable>
              <span slot="footer">Last 10 games</span>
            </stat-card>
          </div>
          <div class="span-4">
            <stat-card label="Win Rate" .value=${String(s.winRate ?? '—')} unit="%" icon="trending_up" accent="#10b981"></stat-card>
          </div>
          <div class="span-4">
            <stat-card label="Matches Played" .value=${String(s.matches ?? '—')} icon="confirmation_number" accent="#f59e0b"></stat-card>
          </div>
        </section>
      </main>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'player-stats': PlayerStats } }
