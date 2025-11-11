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
    h1 { text-align: center; margin-bottom: var(--space-3, 1rem); }
    .actions { display: flex; gap: .75rem; align-items: center; margin-bottom: var(--space-2); justify-content: center; }
button.fav {
  padding: .45rem .85rem;
  border-radius: var(--radius-sm, 6px);
  border: 1px solid var(--color-border, #e5e7eb);
  background: var(--color-surface, #fff);
  color: var(--color-text, #111);
  font-weight: 600;
  letter-spacing: .3px;
  cursor: pointer;
  transition: background .15s ease, color .15s ease, border-color .15s ease, filter .15s ease;
}
button.fav:hover { filter: brightness(0.98); }
:host-context(body.dark) button.fav { color: #e5e7eb; }
:host-context(body:not(.dark)) button.fav { color: #111; }
button.fav.active { background: var(--color-accent); border-color: var(--color-accent); color: var(--color-accent-contrast); }
:host-context(body.dark) button.fav.active { color: #fff; }
:host-context(body:not(.dark)) button.fav.active { color: #111; }
button.fav[disabled] { opacity: .6; cursor: not-allowed; }
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
    const authed = Boolean(localStorage.getItem('token'));
    const favKey = 'favPlayers';
    const localFavs: string[] = JSON.parse(localStorage.getItem(favKey) || '[]');
    const isFav = localFavs.includes(id);
    const toggleFav = async () => {
      if (!authed) { location.href = 'login.html'; return; }
      try {
        const token = localStorage.getItem('token') || '';
        // Load current server state
        const meRes = await fetch('/api/me', { headers: { 'Authorization': `Bearer ${token}` } });
        const me = meRes.ok ? await meRes.json() : { favPlayers: localFavs };
        const favs: string[] = Array.isArray(me.favPlayers) ? me.favPlayers : localFavs;
        const next = isFav ? favs.filter((x: string)=> x!==id) : [...new Set([...favs, id])];
        // Save to server
        await fetch('/api/me', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ favPlayers: next })
        });
        // Keep local in sync for quick UI feedback
        localStorage.setItem(favKey, JSON.stringify(next));
      } catch {}
      this.requestUpdate();
    };
    return html`
      <main>
        <h1>Player Profile</h1>
        <div class="actions">
<button class="fav ${isFav ? 'active' : ''}" @click=${toggleFav}>${isFav ? 'Favorited' : 'Favorite'}</button>
        </div>
        <p>Player Name: <a href="stats.html?id=${id}">${p.name}</a></p>
        <p>Role: ${p.role}</p>
        <p>Team: <a href="team.html?id=${encodeURIComponent(p.team)}">${p.team}</a></p>
        <p>Achievements: ${achievements}</p>

        <h2 style="margin-top: var(--space-3)">Players</h2>
        <player-list src="/data/players.json"></player-list>
      </main>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'player-view': PlayerView } }





