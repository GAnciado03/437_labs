import { LitElement, html, unsafeCSS } from 'lit';
import { apiFetch, apiUrl } from '../utils/api.ts';
import teamListStyles from '../../styles/team-list.css?inline';

export class TeamList extends LitElement {
  static styles = unsafeCSS(teamListStyles);

  static properties = {
    src: { type: String },
    game: { type: String },
    limit: { type: Number },
    query: { type: String },
    hideRegion: { type: Boolean, attribute: 'hide-region' },
    teams: { state: true },
    loading: { state: true },
    error: { state: true }
  };

  constructor() {
    super();
    this.src = '/api/teams';
    this.game = '';
    this.limit = 1200;
    this.hideRegion = false;
    this.query = '';
    this.teams = [];
    this.loading = false;
    this.error = null;
  }

  willUpdate(changed) {
    if (changed.has('src') || changed.has('game') || changed.has('limit') || changed.has('query')) this.fetchData();
  }

  async fetchData() {
    this.loading = true;
    this.error = null;
    this.teams = [];
    try {
      const target = this.buildTarget();
      const res = await this.performFetch(target);
      if (res.status === 401) throw new Error('Please log in to view teams.');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.teams = Array.isArray(data) ? data : [];
    } catch (err) {
      this.error = String(err);
    } finally {
      this.loading = false;
    }
  }

  buildTarget() {
    const base = this.src || '/api/teams';
    const url = new URL(base, location.origin);
    if (this.game) {
      url.searchParams.set('game', this.game);
    } else {
      url.searchParams.delete('game');
    }
    if (this.limit) url.searchParams.set('limit', String(this.limit));
    if (this.query) url.searchParams.set('q', this.query);
    return url.toString();
  }

  performFetch(target) {
    try {
      const url = new URL(target);
      if (url.origin === location.origin && url.pathname.startsWith('/api/')) {
        return apiFetch(url.toString());
      }
      if (url.pathname.startsWith('/api/')) {
        return apiFetch(apiUrl(url.pathname + url.search));
      }
    } catch {
      /* ignore */
    }
    if (target.startsWith('/api/')) {
      return apiFetch(apiUrl(target));
    }
    return fetch(target);
  }

  render() {
    if (this.loading) return html`<p class="muted">Loading...</p>`;
    if (this.error) return html`<p class="muted">Error: ${this.error}</p>`;
    if (!this.teams.length) return html`<p class="muted">No teams found.</p>`;
    return html`
      <ul>
        ${this.teams.map(t => html`
          <li>
            <svg class="icon" aria-hidden="true" style="width: 20px; height: 20px">
              <use href="icons/icons.svg#icon-team"></use>
            </svg>
            <a href="team.html?id=${encodeURIComponent(t.id)}">${t.name}</a>
            ${!this.hideRegion && t.region ? html`<span class="muted">&middot; ${t.region}</span>` : null}
          </li>
        `)}
      </ul>
    `;
  }
}

customElements.define('team-list', TeamList);
