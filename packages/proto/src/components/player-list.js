import { LitElement, html, unsafeCSS } from 'lit';
import playerListStyles from '../../styles/player-list.css?inline';

export class PlayerList extends LitElement {
  static styles = unsafeCSS(playerListStyles);

  static properties = {
    src: { type: String },
    team: { type: String },
    filterName: { type: String, attribute: 'filter-name' },
    filterTeam: { type: String, attribute: 'filter-team' },
    filterGame: { type: String, attribute: 'filter-game' },
    gameTeams: { attribute: false },
    players: { state: true },
    loading: { state: true },
    error: { state: true }
  };

  #abort;

  constructor() {
    super();
    this.src = '';
    this.team = '';
    this.filterName = '';
    this.filterTeam = '';
    this.filterGame = '';
    this.gameTeams = {};
    this.players = [];
    this.loading = false;
    this.error = null;
  }

  willUpdate(changed) {
    if (changed.has('src') && this.src) {
      this.fetchData();
    }
  }

  async fetchData() {
    this.#abort?.abort();
    this.#abort = new AbortController();
    this.loading = true;
    this.error = null;
    try {
      const res = await fetch(this.src, { signal: this.#abort.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.players = Array.isArray(data) ? data : [];
    } catch (err) {
      if (err?.name !== 'AbortError') this.error = String(err);
    } finally {
      this.loading = false;
    }
  }

  applyFilters() {
    const nameQuery = (this.filterName || '').trim().toLowerCase();
    const teamKey = (this.filterTeam || this.team || '').trim().toLowerCase();
    const gameKey = (this.filterGame || '').trim().toLowerCase();
    const map = this.gameTeams || {};
    let list = this.players;

    if (nameQuery) {
      list = list.filter(p => (p.name || '').toLowerCase().includes(nameQuery));
    }
    if (teamKey) {
      list = list.filter(p => (p.team || '').toLowerCase() === teamKey);
    }
    if (gameKey) {
      list = list.filter(p => {
        const team = (p.team || '').toLowerCase();
        return (map[team] || '').toLowerCase() === gameKey;
      });
    }
    return list;
  }

  render() {
    if (this.loading) return html`<p class="muted">Loading…</p>`;
    if (this.error) return html`<p class="muted">Error: ${this.error}</p>`;
    const visible = this.applyFilters();
    if (!visible.length) return html`<p class="muted">No players found.</p>`;
    return html`
      <ul>
        ${visible.map(p => html`
          <li>
            <a href="player.html?id=${p.id}"><strong>${p.name}</strong></a> · ${p.team} · ${p.role}
          </li>
        `)}
      </ul>
    `;
  }
}

customElements.define('player-list', PlayerList);
