import { LitElement, html, css } from "lit";
import { define, Auth, History } from "@calpoly/mustang";
import "./app-router.ts";

const HISTORY_CONTEXT = "mu:history";
const AUTH_CONTEXT = "mu:auth";

class AppShell extends LitElement {
  static styles = css`
    :host { display: block; min-height: 100vh; }
    .layout { min-height: 100vh; display: flex; flex-direction: column; }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-2) var(--space-3);
      border-bottom: 1px solid var(--color-border,#e5e7eb);
      gap: 1rem;
    }
    nav ul {
      list-style: none;
      display: flex;
      gap: 1rem;
      padding: 0;
      margin: 0;
      font-weight: 600;
    }
    nav a { text-decoration: none; color: inherit; }
    main { flex: 1; }
  `;

  render() {
    return html`
      <mu-history provides=${HISTORY_CONTEXT}>
        <mu-auth provides=${AUTH_CONTEXT} redirect="/login.html">
          <div class="layout">
            <header>
              <a href="index.html" style="font-weight: 800;">Esports DB</a>
              <nav>
                <ul>
                  <li><a href="game.html">Games</a></li>
                  <li><a href="player.html">Players</a></li>
                  <li><a href="teamchooser.html">Teams</a></li>
                  <li><a href="events.html">Events</a></li>
                  <li><a href="user.html">User</a></li>
                </ul>
              </nav>
            </header>
            <app-router></app-router>
          </div>
        </mu-auth>
      </mu-history>
    `;
  }
}

define({
  "app-shell": AppShell,
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider
});
