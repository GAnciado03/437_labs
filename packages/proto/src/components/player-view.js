import { LitElement, html, unsafeCSS } from 'lit';
import { apiUrl, apiFetch } from '../utils/api.ts';
import playerViewStyles from '../../styles/player-view.css?inline';

export class PlayerView extends LitElement {
  static styles = unsafeCSS(playerViewStyles);

  static properties = {
    src: { type: String },
    id: { type: String, reflect: true },
    player: { state: true },
    loading: { state: true },
    error: { state: true },
    filterType: { state: true },
    filterValue: { state: true },
    gameOptions: { state: true },
    teamOptions: { state: true },
    gameTeams: { state: true },
    teamSearch: { state: true }
  };

  constructor() {
    super();
    this.src = '/api/players';
    this.id = '';
    this.player = undefined;
    this.loading = false;
    this.error = null;
    this.filterType = 'all';
    this.filterValue = '';
    this.gameOptions = [];
    this.teamOptions = [];
    this.gameTeams = {};
    this.players = [];
    this.teamSearch = '';
    this.teamOptionsId = `team-options-${Math.random().toString(36).slice(2)}`;
  }

  connectedCallback() {
    super.connectedCallback();
    const url = new URL(location.href);
    const urlId = url.searchParams.get('id') || '';
    const teamParam = url.searchParams.get('team') || '';
    if (!this.id && urlId) this.id = urlId;
    if (teamParam) {
      this.filterType = 'team';
      this.filterValue = teamParam;
      this.teamSearch = teamParam;
    }
  }

  willUpdate(changed) {
    if (changed.has('src') || changed.has('id')) {
      this.fetchData();
    }
  }

  resolveSrc(value) {
    if (!value) return '';
    if (value.startsWith('http')) return value;
    if (value.startsWith('/api/')) return apiUrl(value);
    return value;
  }

  async fetchData() {
    if (!this.src) return;
    const useApi = this.src.startsWith('/api/');
    const target = this.resolveSrc(this.src);
    this.loading = true;
    this.error = null;
    this.player = undefined;
    try {
      const res = await (useApi ? apiFetch(target) : fetch(target));
      if (res.status === 401) {
        throw new Error('Please log in to view live player data.');
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();
      const list = Array.isArray(payload)
        ? payload
        : payload
          ? [payload]
          : [];
      this.players = list;
      this.buildFilterOptions(list);
      const key = (this.id || '').toLowerCase();
      const found = list.find(p => (p.id || '').toLowerCase() === key);
      this.player = found || list[0];
    } catch (err) {
      this.error = String(err);
    } finally {
      this.loading = false;
    }
  }

  buildFilterOptions(list) {
    const teamMap = new Map();
    const gameMap = new Map();
    const lookup = {};
    list.forEach(p => {
      const teamName = (p.team || '').trim();
      if (teamName) {
        const key = teamName.toLowerCase();
        if (!teamMap.has(key)) teamMap.set(key, { id: teamName, label: teamName });
        const gameName = (p.game || '').trim() || 'Valorant';
        lookup[key] = gameName;
        const gameKey = gameName.toLowerCase();
        if (!gameMap.has(gameKey)) gameMap.set(gameKey, { id: gameName, title: gameName });
      }
    });
    this.teamOptions = Array.from(teamMap.values()).sort((a, b) =>
      a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })
    );
    this.gameOptions = Array.from(gameMap.values()).sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
    );
    this.gameTeams = lookup;
  }

  getFilteredTeamOptions() {
    const q = this.teamSearch.trim().toLowerCase();
    if (!q) return this.teamOptions;
    return this.teamOptions.filter(opt =>
      opt.label?.toLowerCase().includes(q) || opt.id?.toLowerCase().includes(q)
    );
  }

  handleTeamSearchChange(event) {
    const value = event.target.value || '';
    this.teamSearch = value;
    if (!value) {
      this.filterValue = '';
      return;
    }
    const match = this.teamOptions.find(
      opt => opt.id.toLowerCase() === value.toLowerCase() || opt.label?.toLowerCase() === value.toLowerCase()
    );
    if (match) {
      this.filterValue = match.id;
    }
  }

  handleTeamSelectChange(event) {
    const value = event.target.value || '';
    this.filterValue = value;
    this.teamSearch = value;
  }

  handleFilterTypeChange(event) {
    const next = event.target.value;
    this.filterType = next;
    if (next === 'all') {
      this.filterValue = '';
      this.teamSearch = '';
    }
    if (next === 'team') {
      this.teamSearch = this.filterValue;
    }
  }

  handleFilterValueChange(event) {
    this.filterValue = event.target.value;
  }

  clearFilter() {
    this.filterType = 'all';
    this.filterValue = '';
    const url = new URL(location.href);
    url.searchParams.delete('team');
    history.replaceState(null, '', url.toString());
  }

  renderFilterControl() {
    if (this.filterType === 'name') {
      return html`
        <label class="filter-field">
          <span class="sr-only">Player name</span>
          <input
            type="text"
            placeholder="Search player name"
            .value=${this.filterValue}
            @input=${this.handleFilterValueChange}
          />
        </label>
      `;
    }
    if (this.filterType === 'team') {
      const listId = this.teamOptionsId;
      const filteredTeams = this.getFilteredTeamOptions();
      return html`
        <label class="filter-field team-filter">
          <span class="sr-only">Team</span>
          <div class="team-filter-row">
            <select
              class="team-select"
              .value=${this.filterValue}
              @change=${this.handleTeamSelectChange}
            >
              <option value="">Select team</option>
              ${filteredTeams.map(opt => html`
                <option value=${opt.id}>${opt.label}</option>
              `)}
            </select>
            <input
              type="text"
              class="team-search combo-input"
              placeholder="Search team"
              list=${listId}
              .value=${this.teamSearch}
              @input=${this.handleTeamSearchChange}
            />
            <datalist id=${listId}>
              ${this.teamOptions.map(opt => html`
                <option value=${opt.id}>${opt.label}</option>
              `)}
            </datalist>
          </div>
        </label>
      `;
    }
    if (this.filterType === 'game') {
      return html`
        <label class="filter-field">
          <span class="sr-only">Game</span>
          <select .value=${this.filterValue} @change=${this.handleFilterValueChange}>
            <option value="">Select game</option>
            ${this.gameOptions.map(opt => html`
              <option value=${opt.id}>${opt.title}</option>
            `)}
          </select>
        </label>
      `;
    }
    return null;
  }

  render() {
    if (this.loading) return html`<p class="muted">Loading...</p>`;
    if (this.error) return html`<p class="muted">Error: ${this.error}</p>`;
    if (!this.player) return html`<p class="muted">No player found.</p>`;
    const p = this.player;
    const id = p.id;
    const value = this.filterValue.trim();
    let filterName = '';
    let filterTeam = '';
    let filterGame = '';
    if (this.filterType === 'name') filterName = value;
    if (this.filterType === 'team') filterTeam = value;
    if (this.filterType === 'game') filterGame = value;

    const authed = Boolean(localStorage.getItem('token'));
    const favKey = 'favPlayers';
    const localFavs = JSON.parse(localStorage.getItem(favKey) || '[]');
    const isFav = localFavs.includes(id);

    const toggleFav = async () => {
      if (!authed) {
        location.href = 'login.html';
        return;
      }
      try {
        const token = localStorage.getItem('token') || '';
        const meRes = await fetch(apiUrl('/api/me'), { headers: { Authorization: `Bearer ${token}` } });
        const me = meRes.ok ? await meRes.json() : { favPlayers: localFavs };
        const favs = Array.isArray(me.favPlayers) ? me.favPlayers : localFavs;
        const next = isFav ? favs.filter(x => x !== id) : [...new Set([...favs, id])];
        await fetch(apiUrl('/api/me'), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ favPlayers: next })
        });
        localStorage.setItem(favKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      this.requestUpdate();
    };

    return html`
      <main>
        <h1>Players</h1>
        <div class="actions">
          <button class="fav ${isFav ? 'active' : ''}" @click=${toggleFav}>
            ${isFav ? 'Favorited' : 'Favorite'}
          </button>
        </div>
        <p>Player: <a href="stats.html?id=${id}">${p.name}</a></p>
        <p>Team: <a href="team.html?id=${encodeURIComponent(p.team)}">${p.team}</a></p>
        <p>Game: ${p.game || 'Valorant'}</p>
        <section class="filter-panel">
          <label>
            Filter
            <select .value=${this.filterType} @change=${this.handleFilterTypeChange}>
              <option value="all">All Players</option>
              <option value="name">By Player Name</option>
              <option value="team">By Team</option>
              <option value="game">By Game</option>
            </select>
          </label>
          ${this.renderFilterControl()}
          ${this.filterType !== 'all' ? html`
            <button type="button" class="mono" @click=${this.clearFilter}>Clear</button>
          ` : null}
        </section>
        <p class="muted">
          ${this.filterType === 'name' && value
            ? html`Showing players matching "<strong>${value}</strong>".`
            : this.filterType === 'team' && value
              ? html`Showing roster for ${value}.`
              : this.filterType === 'game' && value
                ? html`Showing players competing in ${value}.`
                : html`Showing all players.`}
        </p>

        <player-list
          src="/api/players"
          .gameTeams=${this.gameTeams}
          .filterName=${filterName}
          .filterTeam=${filterTeam}
          .filterGame=${filterGame}
        ></player-list>
      </main>
    `;
  }
}

customElements.define('player-view', PlayerView);
