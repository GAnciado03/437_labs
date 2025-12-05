import { LitElement, html, css } from "lit";
import { apiUrl } from "../utils/api.ts";

export class UserDashboard extends LitElement {
  static styles = css`
    :host { display: block; color: var(--color-text, #111); }
    .dashboard {
      max-width: 960px;
      margin: var(--space-4, 1.5rem) auto;
      padding: 0 var(--space-3, 1rem);
    }
    .profile-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-3, 1rem);
    }
    .profile-meta {
      text-align: center;
      margin-bottom: var(--space-2, 0.75rem);
    }
    .profile-meta h1 {
      margin: 0;
      color: var(--color-heading, #0f172a);
      font-size: clamp(1.5rem, 1rem + 2vw, 2.5rem);
    }
    .profile-meta button {
      margin-top: var(--space-2, .75rem);
    }
    .fav-card {
      background: var(--color-surface, #fff);
      border-radius: var(--radius-lg, 14px);
      box-shadow: var(--shadow-sm, 0 20px 35px rgba(15,23,42,0.15));
      padding: var(--space-4, 1.5rem);
    }
    .fav-card h2,
    .fav-card h3 {
      text-align: center;
      margin: 0 0 var(--space-3, 1rem);
      color: var(--color-heading, #0f172a);
    }
    .avatar {
      text-align: center;
      margin: var(--space-3, 1rem) 0;
    }
    .avatar svg {
      width: 48px;
      height: 48px;
      color: var(--color-heading, #0f172a);
    }
    .fav-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--space-3, 1rem);
    }
    @media (max-width: 640px) {
      .fav-grid { grid-template-columns: 1fr; }
      .profile-head { flex-direction: column; gap: var(--space-2); }
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: .35rem;
    }
    li {
      display: flex;
      align-items: center;
      gap: .5rem;
      justify-content: flex-start;
      font-weight: 600;
    }
    li.muted {
      color: var(--color-muted,#666);
      font-weight: 500;
      justify-content: center;
    }
    li svg {
      width: 20px;
      height: 20px;
      color: inherit;
    }
    button.mono {
      font-weight: 600;
      padding: .35rem .75rem;
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-sm, 6px);
      background: var(--color-surface, #fff);
      color: var(--color-text, #111);
    }
    .remove-btn {
      border: 1px solid var(--color-border, #e5e7eb);
      background: transparent;
      color: var(--color-muted, #6b7280);
      font-size: 1rem;
      line-height: 1;
      cursor: pointer;
      padding: 0;
      margin-right: 0.5rem;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    :host-context(body.dark) .remove-btn {
      border-color: #475569;
      color: #94a3b8;
    }
    .remove-btn:hover {
      color: var(--color-accent, #ef4444);
      border-color: var(--color-accent, #ef4444);
    }
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

  updateLocalStorage() {
    try {
      localStorage.setItem("favPlayers", JSON.stringify(this.favPlayers));
      localStorage.setItem("favTeams", JSON.stringify(this.favTeams));
    } catch {
      /* ignore */
    }
  }

  async persistFavorites(partial: Partial<{ favPlayers: string[]; favTeams: string[] }>) {
    if (!this.token) return;
    try {
      await fetch(apiUrl("/api/me"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`
        },
        body: JSON.stringify(partial)
      });
    } catch {
      /* ignore */
    }
  }

  async removeFavorite(kind: "player" | "team", id: string) {
    if (kind === "player") {
      this.favPlayers = this.favPlayers.filter((p) => p !== id);
      this.updateLocalStorage();
      await this.persistFavorites({ favPlayers: this.favPlayers });
    } else {
      this.favTeams = this.favTeams.filter((t) => t !== id);
      this.updateLocalStorage();
      await this.persistFavorites({ favTeams: this.favTeams });
    }
    this.requestUpdate();
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
        this.updateLocalStorage();
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

  renderList(kind: "player" | "team", items: string[], link: (id: string) => string, iconId: string) {
    if (!items.length) {
      return html`<li class="muted">None</li>`;
    }
    return items.map((id) => html`
      <li>
        <button
          class="remove-btn"
          type="button"
          aria-label=${`Remove ${id}`}
          @click=${() => this.removeFavorite(kind, id)}
        >&times;</button>
        <svg class="icon" aria-hidden="true"><use href="icons/icons.svg#${iconId}"></use></svg>
        <a href=${link(id)}>${id}</a>
      </li>
    `);
  }

  renderUnauthed() {
    return html`
      <section class="card" style="max-width: 420px; margin: 15vh auto; text-align: center;">
        <nav class="back-links" style="justify-content:center;">
          <a href="index.html" data-back-link data-back-fallback="index.html">Back</a>
          <span class="divider" aria-hidden="true">·</span>
          <a href="index.html">Back to Home</a>
        </nav>
        <h1>User</h1>
        <p style="margin: var(--space-3) 0;">
          <a class="mono" href="login.html" style="display:inline-block;padding:.6rem 1rem;border:1px solid var(--color-border);border-radius:10px;">Log In</a>
        </p>
        <p>
          <a class="mono" href="newuser.html" style="display:inline-block;padding:.5rem 1rem;border:1px solid var(--color-border);border-radius:10px;">Register</a>
        </p>
        <p style="margin-top: var(--space-3)"><a href="index.html" data-back-link>Back to Home</a></p>
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
      <section class="dashboard">
        <div class="profile-head">
          <nav class="back-links" style="margin:0;">
            <a href="index.html" data-back-link data-back-fallback="index.html">Back</a>
            <span class="divider" aria-hidden="true">·</span>
            <a href="index.html">Back to Home</a>
          </nav>
          <button class="mono" @click=${this.handleLogout}>Log Out</button>
        </div>
        <div class="profile-meta">
          <h1>Hey ${name.toUpperCase()}</h1>
          <button
            type="button"
            class="mono"
            data-theme-button
            aria-pressed="false"
            data-label-on="Dark: On"
            data-label-off="Dark: Off"
            @click=${() => (window as any).toggleTheme?.()}
          >Dark: Off</button>
        </div>
        <div class="avatar">
          <svg class="icon" aria-hidden="true"><use href="icons/icons.svg#user-default"></use></svg>
        </div>
        ${this.loading ? html`<p class="muted" style="text-align:center;">Loading...</p>` : null}
        <section class="fav-card">
          <h2>Favorites</h2>
          <div class="fav-grid">
            <div>
              <h3>Players</h3>
              <ul>
                ${this.renderList(
                  "player",
                  this.favPlayers,
                  (id) => `stats.html?id=${encodeURIComponent(id)}`,
                  "player-icon-default"
                )}
              </ul>
            </div>
            <div>
              <h3>Teams</h3>
              <ul>
                ${this.renderList(
                  "team",
                  this.favTeams,
                  (id) => `team.html?id=${encodeURIComponent(id)}`,
                  "icon-team"
                )}
              </ul>
            </div>
          </div>
        </section>
      </section>
    `;
  }
}

customElements.define("user-dashboard", UserDashboard);
