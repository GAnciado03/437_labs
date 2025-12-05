import { LitElement, html, css } from "lit";

const links = [
  { href: "user.html", icon: "user-default", label: "User" },
  { href: "player.html", icon: "player-icon-default", label: "Players" },
  { href: "teamchooser.html", icon: "icon-team", label: "Teams" },
  { href: "events.html", icon: "icon-event", label: "Events" }
];

export class HomeView extends LitElement {
  static styles = css`
    :host { display: block; }
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
    .home-list {
      display: inline-block;
      margin: 1rem auto 0;
      text-align: left;
      list-style: none;
      padding: 0;
      display: grid;
      gap: var(--space-2, .75rem);
    }
    .home-list li {
      display: flex;
      align-items: center;
      gap: var(--space-2, .75rem);
      justify-content: flex-start;
    }
    .home-list a {
      color: var(--color-text, #111);
      font-weight: 600;
      text-decoration: none;
      padding: .25rem .25rem;
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
        <ul class="nav-list home-list">
          ${links.map((link) => html`
            <li>
              <svg class="icon" aria-hidden="true">
                <use href="icons/icons.svg#${link.icon}"></use>
              </svg>
              <a href=${link.href}>${link.label}</a>
            </li>
          `)}
        </ul>
      </main>
    `;
  }
}

customElements.define("home-view", HomeView);
