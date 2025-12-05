import { LitElement, html, unsafeCSS } from 'lit';
import './player-list.js';
import { apiFetch, apiUrl } from '../utils/api.ts';
import teamViewStyles from '../../styles/team-view.css?inline';

export class TeamView extends LitElement {
  static styles = unsafeCSS(teamViewStyles);

  static properties = {
    id: { type: String, reflect: true },
    teamData: { state: true },
    loading: { state: true },
    error: { state: true }
  };

  constructor() {
    super();
    this.id = '';
    this.teamData = null;
    this.loading = false;
    this.error = null;
  }

  connectedCallback() {
    super.connectedCallback();
    const urlId = new URL(location.href).searchParams.get('id') || '';
    if (!this.id && urlId) this.id = urlId;
  }

  willUpdate(changed) {
    if (changed.has('id')) this.fetchTeam();
  }

  getReferrerPath() {
    try {
      const ref = document.referrer;
      if (!ref) return null;
      const refUrl = new URL(ref);
      if (refUrl.origin !== location.origin) return null;
      return refUrl.pathname + refUrl.search + refUrl.hash || refUrl.pathname;
    } catch {
      return null;
    }
  }

  async fetchTeam() {
    if (!this.id) return;
    this.loading = true;
    this.error = null;
    try {
      const res = await apiFetch(apiUrl(`/api/teams/${encodeURIComponent(this.id)}`));
      if (res.ok) {
        this.teamData = await res.json();
      } else if (res.status === 404) {
        this.teamData = { id: this.id, name: this.id };
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      this.error = String(err);
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading && !this.teamData) return html`<main class="container"><p class="muted">Loading...</p></main>`;
    if (this.error && !this.teamData) return html`<main class="container"><p class="muted">Error: ${this.error}</p></main>`;
    const team = this.teamData?.name || this.id || 'Team';
    const rosterTeam = this.teamData?.id || this.id || '';
    const rosterSrc = rosterTeam ? `/api/players?team=${encodeURIComponent(rosterTeam)}` : '/api/players';
    const fallback = this.getReferrerPath() || 'teamchooser.html';
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
        <nav class="back-links">
          <a href="${fallback}" data-back-link data-back-fallback="${fallback}">Back</a>
          <span class="divider" aria-hidden="true">&middot;</span>
          <a href="index.html">Back to Home</a>
        </nav>
        <h1>Team Profile</h1>
        <div class="actions">
          <button class="fav ${isFav ? 'active' : ''}" @click=${toggleFav}>
            ${isFav ? 'Favorited' : 'Favorite'}
          </button>
        </div>
        <p class="meta">Team Name: ${team}</p>
        <h2 style="margin-top: var(--space-3)">Players</h2>
        <div class="list-box" role="region" aria-label="Team roster">
          <player-list
            src=${rosterSrc}
            .team=${rosterTeam}
            profile-link="stats"
          ></player-list>
        </div>
      </main>
    `;
  }
}

customElements.define('team-view', TeamView);
