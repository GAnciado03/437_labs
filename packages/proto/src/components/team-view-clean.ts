import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

type Player = { id: string; name: string; team: string; role: string; kda?: string };

@customElement('team-view')
export class TeamView extends LitElement {
  static styles = css`
    :host { display: block; }
    .muted { color: var(--color-muted,#666); }
    h1 { text-align: center; margin-bottom: var(--space-3, 1rem); }
    .meta, h2 { text-align: center; }
    .actions { display: flex; gap: .75rem; align-items: center; justify-content: center; margin-bottom: var(--space-2); }
    ul {
      list-style: none;
      margin: 0 auto;
      padding: 0;
      display: grid;
      gap: var(--space-2,.75rem);
      max-width: 720px;
      width: 100%;
    }
    li { padding: var(--space-2,.75rem); border: 1px solid var(--color-border,#e5e7eb); border-radius: var(--radius-md,10px); background: var(--color-surface,#fff); }
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

  @property({ type: String }) src = '/data/players.json';
  @property({ type: String, reflect: true }) id = '';

  @state() private allPlayers: Player[] = [];
  @state() private teamPlayers: Player[] = [];
  @state() private loading = false;
  @state() private error: string | null = null;

  private getPrevHref(): string | null {
    try {
      const ref = document.referrer;
      if (!ref) return null;
      const refUrl = new URL(ref);
      if (refUrl.origin !== location.origin) return null;
      const path = refUrl.pathname + refUrl.search + refUrl.hash;
      return path || refUrl.pathname;
    } catch {
      return null;
    }
  }

  private isHomePath(path: string | null): boolean {
    if (!path) return false;
    return path === '/' || path.endsWith('/index.html') || path === 'index.html' || path === '/index.html';
  }

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
    const prev = this.getPrevHref();
    const prevIsHome = this.isHomePath(prev);
    const authed = Boolean(localStorage.getItem('token'));
    const favKey = 'favTeams';
    const localFavs: string[] = JSON.parse(localStorage.getItem(favKey) || '[]');
    const isFav = localFavs.includes(team);
    const toggleFav = async () => {
      if (!authed) { location.href = 'login.html'; return; }
      try {
        const token = localStorage.getItem('token') || '';
        const meRes = await fetch('/api/me', { headers: { 'Authorization': `Bearer ${token}` } });
        const me = meRes.ok ? await meRes.json() : { favTeams: localFavs };
        const favs: string[] = Array.isArray(me.favTeams) ? me.favTeams : localFavs;
        const next = isFav ? favs.filter((x: string)=> x!==team) : [...new Set([...favs, team])];
        await fetch('/api/me', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ favTeams: next })
        });
        localStorage.setItem(favKey, JSON.stringify(next));
      } catch {}
      this.requestUpdate();
    };

    return html`
      <main class="container">
        <p style="margin: 0 0 var(--space-2);">
          ${prev && !prevIsHome ? html`<a href="${prev}">Back</a> &middot; ` : null}
          <a href="index.html">Back to Home</a>
        </p>
        <h1>Team Profile</h1>
        <div class="actions">
          <button class="fav ${isFav ? 'active' : ''}" @click=${toggleFav}>${isFav ? 'Favorited' : 'Favorite'}</button>
        </div>
        <p class="meta">Team Name: ${team}</p>
        <h2 style="margin-top: var(--space-3)">Members</h2>
        ${this.teamPlayers.length === 0 ? html`<p class="muted">No members found.</p>` : html`
          <ul>
            ${this.teamPlayers.map(p => html`
              <li>
                <a href="player.html?id=${p.id}"><strong>${p.name}</strong></a> &middot; ${p.role}
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





