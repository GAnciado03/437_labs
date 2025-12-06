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
    teams: { state: true },
    loading: { state: true },
    error: { state: true },
    selectedTeam: { state: true }
  };

  constructor() {
    super();
    this.src = '/api/teams';
    this.game = '';
    this.limit = 1200;
    this.query = '';
    this.teams = [];
    this.loading = false;
    this.error = null;
    this.selectedTeam = null;
  }

  willUpdate(changed) {
    if (changed.has('src') || changed.has('game') || changed.has('limit') || changed.has('query')) {
      this.fetchData();
    }
  }

  async fetchData() {
    this.loading = true;
    this.error = null;
    this.teams = [];
    try {
      const target = this.buildTarget();
      const res = await this.performFetch(target);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.teams = Array.isArray(data) ? data : [];
      if (this.teams.length) this.selectedTeam = this.teams[0];
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
      <div class="team-layout">
        <ul class="team-list">
          ${this.teams.map((team) => this.renderTeamItem(team))}
        </ul>
        <section class="detail-panel" aria-live="polite">
          ${this.selectedTeam ? html`<team-roster .team=${this.selectedTeam}></team-roster>` : this.renderPlaceholder()}
        </section>
      </div>
    `;
  }

  renderTeamItem(team) {
    const label = team?.tag || team?.name || team?.id;
    const isActive = this.selectedTeam?.id === team.id;
    return html`
      <li>
        <button
          type="button"
          class=${isActive ? 'team-link active' : 'team-link'}
          @click=${() => (this.selectedTeam = team)}
        >
          <span class="team-label">
            <strong>${label}</strong>
            ${team?.name && team?.name !== label ? html`<span class="muted">${team.name}</span>` : null}
          </span>
          <code>${team.id}</code>
        </button>
      </li>
    `;
  }

  renderPlaceholder() {
    return html`<div class="placeholder"><p class="muted">Select a team to view its roster.</p></div>`;
  }
}

customElements.define('team-list', TeamList);
