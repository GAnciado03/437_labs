import { LitElement, css, html } from "lit";

declare global {
  interface Window {
    toggleTheme?: (event?: Event) => void;
  }
}

const navLinks = [
  { href: "/app", label: "Home" },
  { href: "/app/players", label: "Players" },
  { href: "/app/players/favorites", label: "Favorites" }
];

export default class HeaderElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      border-bottom: 1px solid var(--color-border, #e2e8f0);
      background: var(--color-header, #0f172a);
      color: #fff;
    }
    header {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      padding: 1rem 1.5rem;
      gap: 0.75rem;
    }
    nav {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    nav a {
      color: inherit;
      text-decoration: none;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 999px;
    }
    nav a::after {
      content: "|";
      margin: 0 0.5rem;
      opacity: 0.6;
    }
    nav a:last-child::after {
      content: "";
      margin: 0;
    }
    nav a:hover {
      background: rgba(255, 255, 255, 0.15);
    }
    .actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      justify-content: center;
    }
    button.theme-btn {
      border: 1px solid rgba(255, 255, 255, 0.6);
      background: transparent;
      color: inherit;
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      cursor: pointer;
    }
  `;

  render() {
    return html`
      <header>
        <nav>
          ${navLinks.map(
            (link) => html`<a href=${link.href}>${link.label}</a>`
          )}
        </nav>
        <div class="actions">
          <button class="theme-btn" data-theme-button @click=${this.handleThemeToggle}>
            Dark: Off
          </button>
        </div>
      </header>
    `;
  }

  private handleThemeToggle = (event: Event) => {
    window.toggleTheme?.(event);
  };

  createRenderRoot() {
    return this;
  }
}

