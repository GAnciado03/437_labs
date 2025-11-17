import type { LitElement } from 'lit';

export {};

declare global {
  class StatCardElement extends LitElement {
    label: string;
    value: string;
    unit: string | null;
    icon: string | null;
    accent: string | null;
    clickable: boolean;
    selected: boolean;
    variant: 'default' | 'compact';
  }

  interface HTMLElementTagNameMap {
    'stat-card': StatCardElement;
  }
}
