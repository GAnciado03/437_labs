import { LitElement, html, unsafeCSS } from 'lit';
import { apiFetch, apiUrl } from '../utils/api.ts';
import playerStatsStyles from '../../styles/player-stats.css?inline';

export class PlayerStats extends LitElement {
  static styles = unsafeCSS(playerStatsStyles);

  static properties = {
    src: { type: String },
    id: { type: String, reflect: true },
    player: { state: true },
    loading: { state: true },
    error: { state: true },
    activeStat: { state: true }
  };

  handleStatActivate = event => {
    const detail = event.detail;
    if (!detail) return;
    this.activeStat = detail;
  };

  constructor() {
    super();
    this.src = '/api/players';
    this.id = '';
    this.player = undefined;
    this.loading = false;
    this.error = null;
    this.activeStat = null;
  }

  connectedCallback() {
    super.connectedCallback();
    const urlId = new URL(location.href).searchParams.get('id') || '';
    if (!this.id && urlId) this.id = urlId;
    this.addEventListener('stat-card:activate', this.handleStatActivate);
  }

  disconnectedCallback() {
    this.removeEventListener('stat-card:activate', this.handleStatActivate);
    super.disconnectedCallback();
  }

  willUpdate(changed) {
    if (changed.has('src') || changed.has('id')) this.fetchData();
  }

  async fetchData() {
    this.loading = true;
    this.error = null;
    this.player = undefined;
    try {
      const target = this.buildTarget();
      const res = await apiFetch(target);
      if (res.status === 401) throw new Error('Please log in to view stats.');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      if (Array.isArray(result)) {
        const key = (this.id || '').toLowerCase();
        const found = result.find(p => (p.id || '').toLowerCase() === key);
        this.player = found || result[0];
      } else {
        this.player = result;
      }
    } catch (err) {
      this.error = String(err);
    } finally {
      this.loading = false;
    }
  }

  buildTarget() {
    if (this.id) {
      return apiUrl(`/api/players/${encodeURIComponent(this.id)}`);
    }
    return apiUrl('/api/players');
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
            <stat-card label="K/D/A" .value=${s.kda ?? '—'} icon="insights" accent="#2563eb" clickable
              .selected=${this.activeStat?.label === 'K/D/A'}>
              <span slot="footer">Last 10 games</span>
            </stat-card>
          </div>
          <div class="span-4">
            <stat-card label="Win Rate" .value=${String(s.winRate ?? '—')} unit="%" icon="trending_up" accent="#10b981"
              clickable .selected=${this.activeStat?.label === 'Win Rate'}></stat-card>
          </div>
          <div class="span-4">
            <stat-card label="Matches Played" .value=${String(s.matches ?? '—')} icon="confirmation_number" accent="#f59e0b"
              clickable .selected=${this.activeStat?.label === 'Matches Played'}></stat-card>
          </div>
        </section>
        <p class="muted" style="margin-top: var(--space-2)">
          ${this.activeStat
            ? html`Pinned stat: <strong>${this.activeStat.label}</strong> (${this.activeStat.value})`
            : html`Click any stat card to pin it here.`}
        </p>
      </main>
    `;
  }
}

customElements.define('player-stats', PlayerStats);
