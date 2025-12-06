import { LitElement, html, unsafeCSS } from 'lit';
import { apiFetch, apiUrl } from '../utils/api.ts';
import playerViewStyles from '../../styles/player-view.css?inline';
import './stat-card.js';

export class PlayerView extends LitElement {
  static styles = unsafeCSS(playerViewStyles);

  static properties = {
    src: { type: String },
    id: { type: String, reflect: true },
    players: { state: true },
    selected: { state: true },
    loading: { state: true },
    error: { state: true },
    favorites: { state: true },
    filterType: { state: true },
    filterValue: { state: true },
    teamOptions: { state: true },
    gameOptions: { state: true }
  };

  constructor() {
    super();
    this.src = '/api/players';
    this.id = '';
    this.players = [];
    this.selected = null;
    this.loading = false;
    this.error = '';
    this.favorites = [];
    this._lastFetchedSrc = '';
    this.filterType = 'player';
    this.filterValue = '';
    this.teamOptions = [];
    this.gameOptions = [];
  }

  connectedCallback() {
    super.connectedCallback();
    const urlId = new URL(location.href).searchParams.get('id') || '';
    if (!this.id && urlId) this.id = urlId;
    this.loadFavorites();
    this.fetchPlayers();
  }

  updated(changed) {
    if (changed.has('src')) {
      if (this.src && this.src !== this._lastFetchedSrc) {
        this.fetchPlayers();
      }
    }
    if ((changed.has('players') && this.players.length) || changed.has('id')) {
      this.syncSelected();
    }
  }

  get filteredPlayers() {
    const value = (this.filterValue || '').trim().toLowerCase();
    if (!value) return this.players;
    return this.players.filter((player) => {
      if (this.filterType === 'team') {
        return (player.team || '').toLowerCase() === value;
      }
      if (this.filterType === 'game') {
        return (player.game || '').toLowerCase() === value;
      }
      return (player.name || '').toLowerCase().includes(value);
    });
  }

  async fetchPlayers() {
    if (!this.src) return;
    this._lastFetchedSrc = this.src;
    this.loading = true;
    this.error = '';
    try {
      const target = this.resolveSrc(this.src);
      const useApi = target.startsWith('/api/');
      const res = await (useApi ? apiFetch(apiUrl(target)) : fetch(target));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();
      this.players = Array.isArray(payload) ? payload : payload ? [payload] : [];
      this.buildFilterOptions();
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
      this.players = [];
    } finally {
      this.loading = false;
    }
  }

  resolveSrc(value) {
    if (!value) return '';
    if (value.startsWith('http')) {
      const url = new URL(value);
      return url.pathname + url.search;
    }
    return value;
  }

  syncSelected() {
    if (!this.players.length) {
      this.selected = null;
      return;
    }
    const current = (this.id || '').toLowerCase();
    const found = this.players.find((player) => (player.id || '').toLowerCase() === current);
    this.selected = found || this.players[0];
  }

  handleSearchInput = (event) => {
    this.filterValue = (event.target?.value || '').slice(0, 60);
  };

  handleFilterTypeChange = (event) => {
    this.filterType = event.target.value;
    this.filterValue = '';
  };

  clearFilters = () => {
    this.filterType = 'player';
    this.filterValue = '';
  };

  handleSelectOption(event) {
    this.filterValue = event.target.value || '';
  }

  handleSelect(player, event) {
    event?.preventDefault();
    if (!player?.id) return;
    this.id = player.id;
    this.updateHistory(player.id);
  }

  updateHistory(id) {
    try {
      const url = new URL(location.href);
      url.searchParams.set('id', id);
      history.replaceState(null, '', url.toString());
    } catch {
      /* ignore */
    }
  }

  loadFavorites() {
    try {
      const raw = localStorage.getItem('favPlayers');
      const parsed = raw ? JSON.parse(raw) : [];
      this.favorites = Array.isArray(parsed) ? parsed : [];
    } catch {
      this.favorites = [];
    }
  }

  isFavorite(id) {
    if (!id) return false;
    const target = id.toLowerCase();
    return this.favorites.some((fav) => fav.toLowerCase() === target);
  }

  async toggleFavorite() {
    const player = this.selected;
    if (!player?.id) return;
    const authed = Boolean(localStorage.getItem('token'));
    if (!authed) {
      location.href = 'login.html';
      return;
    }
    try {
      const token = localStorage.getItem('token') || '';
      const meRes = await fetch(apiUrl('/api/me'), { headers: { Authorization: `Bearer ${token}` } });
      const me = meRes.ok ? await meRes.json() : { favPlayers: this.favorites };
      const favs = Array.isArray(me.favPlayers) ? me.favPlayers : this.favorites;
      const exists = favs.includes(player.id);
      const next = exists ? favs.filter((item) => item !== player.id) : [...new Set([...favs, player.id])];
      await fetch(apiUrl('/api/me'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ favPlayers: next })
      });
      localStorage.setItem('favPlayers', JSON.stringify(next));
      this.favorites = next;
    } catch {
      /* ignore */
    }
  }

  buildFilterOptions() {
    const teamSet = new Set();
    const gameSet = new Set();
    this.players.forEach((player) => {
      const team = (player.team || '').trim();
      if (team) teamSet.add(team);
      const game = (player.game || '').trim();
      if (game) gameSet.add(game);
    });
    this.teamOptions = Array.from(teamSet).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    this.gameOptions = Array.from(gameSet).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }

  renderFilters() {
    const value = this.filterValue;
    return html`
      <div class="filter-panel">
        <label>
          Filter Type
          <select .value=${this.filterType} @change=${this.handleFilterTypeChange}>
            <option value="player">Player Name</option>
            <option value="team">Team</option>
            <option value="game">Game</option>
          </select>
        </label>
        ${this.renderFilterControl(value)}
        <button class="clear-btn" type="button" @click=${this.clearFilters}>Reset</button>
      </div>
      <div class="filter-results" role="listbox" aria-label="Player results">
        ${this.filteredPlayers.map((player) => {
          const active = this.selected?.id === player.id;
          return html`
            <button
              type="button"
              class=${active ? 'result-item active' : 'result-item'}
              @click=${(event) => this.handleSelect(player, event)}
              aria-selected=${String(active)}
            >
              <span>${player.name}</span>
              ${this.isFavorite(player.id) ? html`<span class="fav-dot" aria-label="Favorite"></span>` : null}
            </button>
          `;
        })}
        ${!this.filteredPlayers.length
          ? html`<p class="muted empty-msg">No players match the current filter.</p>`
          : null}
      </div>
    `;
  }

  renderFilterControl(value) {
    if (this.filterType === 'team') {
      return html`
        <label>
          Team
          <select .value=${value} @change=${(event) => this.handleSelectOption(event)}>
            <option value="">All teams</option>
            ${this.teamOptions.map((team) => html`<option value=${team}>${team}</option>`)}
          </select>
        </label>
      `;
    }
    if (this.filterType === 'game') {
      return html`
        <label>
          Game
          <select .value=${value} @change=${(event) => this.handleSelectOption(event)}>
            <option value="">All games</option>
            ${this.gameOptions.map((game) => html`<option value=${game}>${game}</option>`)}
          </select>
        </label>
      `;
    }
    return html`
      <label>
        Search
        <input
          type="search"
          placeholder="Find a player"
          .value=${value}
          @input=${this.handleSearchInput}
        />
      </label>
    `;
  }

  renderStats(player) {
    const s = player?.stats || {};
    const cards = [
      {
        label: 'K/D/A',
        value: s.kda ?? '—',
        icon: 'insights',
        accent: '#2563eb',
        footer: 'Last 10 games'
      },
      {
        label: 'Win Rate',
        value: s.winRate != null ? String(s.winRate) : '—',
        unit: s.winRate != null ? '%' : '',
        icon: 'trending_up',
        accent: '#10b981'
      },
      {
        label: 'Matches Played',
        value: s.matches != null ? String(s.matches) : '—',
        icon: 'confirmation_number',
        accent: '#f59e0b'
      }
    ];
    return html`
      <div class="stats-grid">
        ${cards.map(
          (card) => html`
            <stat-card
              label=${card.label}
              .value=${card.value}
              icon=${card.icon}
              accent=${card.accent}
              unit=${card.unit || ''}
            >
              ${card.footer ? html`<span slot="footer">${card.footer}</span>` : null}
            </stat-card>
          `
        )}
      </div>
    `;
  }

  renderDetail() {
    const player = this.selected;
    if (!player) {
      return html`<article class="card empty"><p class="muted">Select a player from the roster.</p></article>`;
    }
    const isFav = this.isFavorite(player.id);
    return html`
      <article class="card">
        <header>
          <div>
            <p class="eyebrow">${player.team || 'Free Agent'}</p>
            <h2>${player.name}</h2>
          </div>
          <button class="fav ${isFav ? 'active' : ''}" @click=${this.toggleFavorite}>
            ${isFav ? 'Favorited' : 'Favorite'}
          </button>
        </header>
        <dl class="meta-grid">
          <div>
            <dt>Team</dt>
            <dd>
              ${player.team
                ? html`<a href="team.html?id=${encodeURIComponent(player.team)}">${player.team}</a>`
                : 'Free Agent'}
            </dd>
          </div>
          <div>
            <dt>Game</dt>
            <dd>${player.game || 'Valorant'}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>${player.role || 'Flex'}</dd>
          </div>
        </dl>
        ${this.renderStats(player)}
      </article>
    `;
  }

  render() {
    if (this.loading) return html`<main class="container"><p class="muted">Loading players...</p></main>`;
    if (this.error) return html`<main class="container"><p class="muted">${this.error}</p></main>`;

    return html`
      <main class="container">
        <nav class="back-links">
          <a href="index.html" data-back-link data-back-fallback="index.html">Back</a>
          <span class="divider" aria-hidden="true">&middot;</span>
          <a href="index.html">Back to Home</a>
        </nav>
        <h1>Players</h1>
        <section class="layout">
          <aside>
            <h2>Filters</h2>
            ${this.renderFilters()}
          </aside>
          <div class="content">
            ${this.renderDetail()}
          </div>
        </section>
      </main>
    `;
  }
}

customElements.define('player-view', PlayerView);
