export {};

declare global {
  class StatCard extends HTMLElement {}

  interface HTMLElementTagNameMap {
    'stat-card': StatCard;
  }
}

