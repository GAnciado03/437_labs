import { LitElement, html, css } from "lit";
import { apiUrl } from "../utils/api.ts";

export class UserDashboard extends LitElement {
  static styles = css`
    :host { display: block; }
    .card { max-width: 900px; margin: 1rem auto; }
    .fav-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: .5rem;
      max-width: 720px;
      margin: 0 auto;
    }
    ul { list-style: none; padding: 0; margin: 0; }
    li { display: flex; align-items: center; gap: .5rem; justify-content: center; }
    li.muted { color: var(--color-muted,#666); }
    button.mono { font-weight: 600; }
  `;

  static properties = {
    loading: { type: Boolean, reflect: true },
    token: { type: String },
    profile: { state: true },
    favPlayers: { state: true },
    favTeams: { state: true }
  };

  loading: boolean;
  token: string;
  profile: Record<string, unknown>;
  favPlayers: string[];
  favTeams: string[];

  constructor() {
    super();
    this.loading = false;
    this.token = this.readToken();
    this.profile = this.readProfile();
    this.favPlayers = this.readLocal("favPlayers");
    this.favTeams = this.readLocal("favTeams");
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.token) this.fetchProfile();
  }

  readLocal(key: string) {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  readProfile() {
    try {
      const raw = localStorage.getItem("profile");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  readToken() {
    try {
      return localStorage.getItem("token") || "";
    } catch {
      return "";
    }
  }

  async fetchProfile() {
    if (!this.token) return;
    this.loading = true;
    try {
      const res = await fetch(apiUrl("/api/me"), {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const me = await res.json();
      const { favPlayers = [], favTeams = [] } = me || {};
      this.profile = {
        first: me?.first,
        last: me?.last,
        username: me?.username
      };
      this.favPlayers = Array.isArray(favPlayers) ? favPlayers : [];
      this.favTeams = Array.isArray(favTeams) ? favTeams : [];
      try {
        localStorage.setItem("profile", JSON.stringify(this.profile));
        localStorage.setItem("favPlayers", JSON.stringify(this.favPlayers));
        localStorage.setItem("favTeams", JSON.stringify(this.favTeams));
      } catch {
        /* ignore */
      }
    } catch {
      /* ignore network errors */
    } finally {
      this.loading = false;
    }
  }

  handleLogout() {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("profile");
      localStorage.removeItem("favPlayers");
      localStorage.removeItem("favTeams");
    } catch { /* ignore */ }
    this.token = "";
    this.profile = {};
    this.favPlayers = [];
    this.favTeams = [];
    location.href = "login.html";
  }

  renderList(items: string[], link: (id: string) => string) {
    if (!items.length) {
      return html`<li class="muted">None</li>`;
    }
    return items.map((id) => html`
      <li>
        <svg class="icon" aria-hidden="true"><use href="icons/icons.svg#icon-team"></use></svg>
        <a href=${link(id)}>${id}</a>
      </li>
    `);
  }

  renderUnauthed() {
    return html`
      <section class="card" style="max-width: 420px; margin: 15vh auto; text-align: center;">
        <h1>User</h1>
        <p style="margin: var(--space-3) 0;">
          <a class="mono" href="login.html" style="display:inline-block;padding:.6rem 1rem;border:1px solid var(--color-border);border-radius:10px;">Log In</a>
        </p>
        <p>
          <a class="mono" href="newuser.html" style="display:inline-block;padding:.5rem 1rem;border:1px solid var(--color-border);border-radius:10px;">Register</a>
        </p>
        <p style="margin-top: var(--space-3)"><a href="index.html">Back to Home</a></p>
      </section>
    `;
  }

  render() {
    if (!this.token) return this.renderUnauthed();
    const profile = this.profile as {
      username?: string;
      first?: string;
      last?: string;
    };
    const name = typeof profile.username === "string"
      ? profile.username
      : typeof profile.first === "string" && typeof profile.last === "string"
        ? `${profile.first} ${profile.last}`
        : "User";
    return html`
      <section class="card">
        <p style="margin: 0 0 var(--space-2); display:flex; align-items:center; justify-content:space-between; gap:.5rem;">
          <a href="index.html">Back to Home</a>
          <button class="mono" @click=${this.handleLogout}>Log Out</button>
        </p>
        <h1 style="text-align:center; margin: 0;">Hey ${name.toUpperCase()}</h1>
        <p style="text-align:center; margin: 0;">
          <button
            type="button"
            class="mono"
            data-theme-button
            aria-pressed="false"
            data-label-on="Dark: On"
            data-label-off="Dark: Off"
            style="font-weight:600; font-size:.95rem; padding:.25rem .5rem; border:1px solid var(--color-border); background:var(--color-surface); color:var(--color-text); border-radius:var(--radius-sm);"
          >Dark: Off</button>
        </p>
        <div style="text-align:center; margin-top: 0;">
          <svg class="icon" aria-hidden="true" style="--icon-size: 40px; width: var(--icon-size); height: var(--icon-size);"><use href="icons/icons.svg#user-default"></use></svg>
        </div>
        ${this.loading ? html`<p class="muted" style="text-align:center;">Loading...</p>` : null}
        <h2 style="margin: 0; text-align:center;">Favorites</h2>
        <div class="fav-grid">
          <div>
            <h3 style="text-align:center;">Players</h3>
            <ul>
              ${this.renderList(
                this.favPlayers,
                (id) => `stats.html?id=${encodeURIComponent(id)}`
              )}
            </ul>
          </div>
          <div>
            <h3 style="text-align:center;">Teams</h3>
            <ul>
              ${this.renderList(
                this.favTeams,
                (id) => `team.html?id=${encodeURIComponent(id)}`
              )}
            </ul>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define("user-dashboard", UserDashboard);
