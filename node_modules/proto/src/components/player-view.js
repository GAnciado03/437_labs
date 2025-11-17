import { LitElement, html, unsafeCSS } from 'lit';
import { apiUrl } from '../utils/api.ts';
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
    gameTeams: { state: true }
  };

  constructor() {
    super();
    this.src = '/data/player-details.json';
    this.id = '';
    this.player = undefined;
    this.loading = false;
    this.error = null;
    this.filterType = 'all';
    this.filterValue = '';
    this.gameOptions = [];
    this.teamOptions = [];
    this.gameTeams = {};
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
    }
    this.loadGameDirectory();
  }

  willUpdate(changed) {
    if (changed.has('src') || changed.has('id')) {
      this.fetchData();
    }
  }

  async fetchData() {
    if (!this.src) return;
    this.loading = true;
    this.error = null;
    this.player = undefined;
    try {
      const res = await fetch(this.src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const list = await res.json();
      const key = (this.id || '').toLowerCase();
      const found = Array.isArray(list)
        ? list.find(p => (p.id || '').toLowerCase() === key)
        : undefined;
      this.player = found || (Array.isArray(list) ? list[0] : undefined);
    } catch (err) {
      this.error = String(err);
    } finally {
      this.loading = false;
    }
  }

  async loadGameDirectory() {
    try {
      const gamesRes = await fetch('/data/games.json');
      if (!gamesRes.ok) throw new Error(`HTTP ${gamesRes.status}`);
      const games = await gamesRes.json();
      this.gameOptions = Array.isArray(games)
        ? games.map(g => ({ id: g.id, title: g.title, teamsSrc: g.teamsSrc }))
        : [];

      const map = {};
      const optionKeys = new Set();
      const teamOptions = [];

      const addOption = (value, label) => {
        const val = (value || label || '').trim();
        if (!val) return;
        const key = val.toLowerCase();
        if (optionKeys.has(key)) return;
        optionKeys.add(key);
        teamOptions.push({ id: val, label: label || val });
      };

      const addMap = (value, gameId) => {
        const key = (value || '').trim().toLowerCase();
        if (!key || !gameId) return;
        map[key] = gameId;
      };

      await Promise.all(
        (this.gameOptions || []).map(async game => {
          try {
            const teamsRes = await fetch(game.teamsSrc);
            if (!teamsRes.ok) return;
            const teams = await teamsRes.json();
            (teams || []).forEach(team => {
              addMap(team.id, game.id);
              addMap(team.name, game.id);
              addOption(team.id, team.name || team.id);
              if (team.name) addOption(team.name, team.name);
            });
          } catch {
            /* ignore */
          }
        })
      );

      this.teamOptions = teamOptions.sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })
      );
      this.gameTeams = map;
    } catch {
      /* ignore */
    }
  }

  handleFilterTypeChange(event) {
    const next = event.target.value;
    this.filterType = next;
    if (next === 'all') this.filterValue = '';
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
      return html`
        <label class="filter-field">
          <span class="sr-only">Team</span>
          <select .value=${this.filterValue} @change=${this.handleFilterValueChange}>
            <option value="">Select team</option>
            ${this.teamOptions.map(opt => html`
              <option value=${opt.id}>${opt.label}</option>
            `)}
          </select>
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
    if (this.loading) return html`<p class="muted">Loading…</p>`;
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
          src="/data/players.json"
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
