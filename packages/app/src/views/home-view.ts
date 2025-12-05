import { LitElement, html, css } from "lit";

const links = [
  { href: "/app/players", icon: "player-icon-default", label: "Players (SPA)" },
  { href: "/app/players/favorites", icon: "user-default", label: "Favorites (SPA)" }
];

export class HomeViewElement extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    main {
      max-width: var(--content-max, 960px);
      margin: 0 auto;
      padding: var(--space-4, 2rem);
      text-align: center;
    }
    h1 {
      font-size: clamp(2rem, 1.2rem + 2.5vw, 3rem);
      margin-bottom: var(--space-4, 2rem);
      color: var(--color-heading, #0f172a);
    }
    .home-subtext {
      color: var(--color-muted, #475569);
      margin: 0 auto var(--space-3, 1.25rem);
      max-width: 56ch;
    }
    .home-list {
      display: inline-grid;
      margin: 1rem auto 0;
      text-align: center;
      list-style: none;
      padding: 0;
      gap: var(--space-2, 0.75rem);
      justify-items: center;
    }
    .home-list li {
      display: flex;
      align-items: center;
      gap: var(--space-2, 0.75rem);
      justify-content: center;
    }
    .home-list a {
      color: var(--color-text, #111);
      font-weight: 600;
      text-decoration: none;
      padding: 0.25rem 0.25rem;
    }
    .home-list a:hover {
      color: var(--color-accent, #4f46e5);
      text-decoration: underline;
    }
    .icon {
      width: 24px;
      height: 24px;
      fill: currentColor;
      flex: 0 0 auto;
    }
  `;

  render() {
    return html`
      <main class="container">
        <h1>Welcome to the Esports Database</h1>
        <p class="home-subtext">
          Enjoy the familiar navigation plus the new SPA-powered Players and Favorites pages without leaving the app.
        </p>
        <ul class="nav-list home-list">
          ${links.map(
            (link) => html`
              <li>
                <svg class="icon" aria-hidden="true">
                  <use href="/icons/icons.svg#${link.icon}"></use>
                </svg>
                <a href=${link.href}>${link.label}</a>
              </li>
            `
          )}
        </ul>
      </main>
    `;
  }
}

customElements.define("home-view", HomeViewElement);
