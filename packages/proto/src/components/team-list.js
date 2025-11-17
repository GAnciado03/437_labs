import { LitElement, html, unsafeCSS } from 'lit';
import teamListStyles from '../../styles/team-list.css?inline';

export class TeamList extends LitElement {
  static styles = unsafeCSS(teamListStyles);

  static properties = {
    src: { type: String },
    hideRegion: { type: Boolean, attribute: 'hide-region' },
    showPlayerLink: { type: Boolean, attribute: 'show-player-link' },
    teams: { state: true },
    loading: { state: true },
    error: { state: true }
  };

  constructor() {
    super();
    this.src = '/data/teams.json';
    this.hideRegion = false;
    this.showPlayerLink = false;
    this.teams = [];
    this.loading = false;
    this.error = null;
  }

  willUpdate(changed) {
    if (changed.has('src') && this.src) this.fetchData();
  }

  async fetchData() {
    this.loading = true;
    this.error = null;
    this.teams = [];
    try {
      const res = await fetch(this.src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.teams = Array.isArray(data) ? data : [];
    } catch (err) {
      this.error = String(err);
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading) return html`<p class="muted">Loading…</p>`;
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
            ${!this.hideRegion && t.region ? html`<span class="muted">· ${t.region}</span>` : null}
            ${this.showPlayerLink ? html`
              <span class="muted">
                · <a class="player-link" href="player.html?team=${encodeURIComponent(t.id)}">Players</a>
              </span>
            ` : null}
          </li>
        `)}
      </ul>
    `;
  }
}

customElements.define('team-list', TeamList);
