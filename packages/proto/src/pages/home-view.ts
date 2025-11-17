import { LitElement, html, css } from "lit";

const links = [
  { href: "user.html", icon: "user-default", label: "User" },
  { href: "game.html", icon: "icon-controller", label: "Games" },
  { href: "player.html", icon: "player-icon-default", label: "Players" },
  { href: "teamchooser.html", icon: "icon-team", label: "Teams" },
  { href: "events.html", icon: "icon-event", label: "Events" }
];

export class HomeView extends LitElement {
  static styles = css`
    :host { display: block; }
    .home-list {
      display: inline-block;
      margin: 1rem auto 0;
      text-align: left;
    }
    .home-list li { justify-content: flex-start; }
  `;

  render() {
    return html`
      <main class="container" style="text-align: center;">
        <h1 style="text-align: center;">Welcome to the Esports Database</h1>
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
