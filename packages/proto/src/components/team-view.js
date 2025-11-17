import { LitElement, html, unsafeCSS } from 'lit';
import './player-list.js';
import { apiUrl } from '../utils/api.ts';
import teamViewStyles from '../../styles/team-view.css?inline';

export class TeamView extends LitElement {
  static styles = unsafeCSS(teamViewStyles);

  static properties = {
    src: { type: String },
    id: { type: String, reflect: true },
    allPlayers: { state: true },
    teamPlayers: { state: true },
    loading: { state: true },
    error: { state: true }
  };

  constructor() {
    super();
    this.src = '/data/players.json';
    this.id = '';
    this.allPlayers = [];
    this.teamPlayers = [];
    this.loading = false;
    this.error = null;
  }

  getPrevHref() {
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

  isHomePath(path) {
    if (!path) return false;
    return path === '/' || path.endsWith('/index.html') || path === 'index.html' || path === '/index.html';
  }

  connectedCallback() {
    super.connectedCallback();
    const urlId = new URL(location.href).searchParams.get('id') || '';
    if (!this.id && urlId) this.id = urlId;
  }

  willUpdate(changed) {
    if (changed.has('src') || changed.has('id')) this.fetchData();
  }

  async fetchData() {
    this.loading = true;
    this.error = null;
    try {
      const res = await fetch(this.src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.allPlayers = Array.isArray(data) ? data : [];
      this.filterRoster();
    } catch (err) {
      this.error = String(err);
    } finally {
      this.loading = false;
    }
  }

  filterRoster() {
    const key = (this.id || '').toLowerCase();
    if (!key) {
      this.teamPlayers = [];
      return;
    }
    this.teamPlayers = this.allPlayers.filter(
      p => (p.team || '').toLowerCase() === key
    );
  }

  render() {
    if (this.loading) return html`<main class="container"><p class="muted">Loading…</p></main>`;
    if (this.error) return html`<main class="container"><p class="muted">Error: ${this.error}</p></main>`;
    const team = this.id || (this.teamPlayers[0]?.team ?? 'Team');
    const prev = this.getPrevHref();
    const prevIsHome = this.isHomePath(prev);
    const authed = Boolean(localStorage.getItem('token'));
    const favKey = 'favTeams';
    const localFavs = JSON.parse(localStorage.getItem(favKey) || '[]');
    const isFav = localFavs.includes(team);

    const toggleFav = async () => {
      if (!authed) { location.href = 'login.html'; return; }
      try {
        const token = localStorage.getItem('token') || '';
        const meRes = await fetch(apiUrl('/api/me'), { headers: { Authorization: `Bearer ${token}` } });
        const me = meRes.ok ? await meRes.json() : { favTeams: localFavs };
        const favs = Array.isArray(me.favTeams) ? me.favTeams : localFavs;
        const next = isFav ? favs.filter(x => x !== team) : [...new Set([...favs, team])];
        await fetch(apiUrl('/api/me'), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ favTeams: next })
        });
        localStorage.setItem(favKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
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
          <button class="fav ${isFav ? 'active' : ''}" @click=${toggleFav}>
            ${isFav ? 'Favorited' : 'Favorite'}
          </button>
        </div>
        <p class="meta">Team Name: ${team}</p>
        <h2 style="margin-top: var(--space-3)">Players</h2>
        ${this.teamPlayers.length === 0
          ? html`<p class="muted">No members found.</p>`
          : html`<player-list src="${this.src}" .team=${team}></player-list>`}
      </main>
    `;
  }
}

customElements.define('team-view', TeamView);
