export {};

declare global {
  type StatCardElement = import('../components/stat-card').StatCard;

  interface HTMLElementTagNameMap {
    'stat-card': StatCardElement;
  }
}
