import { LitElement, html, unsafeCSS } from 'lit';
import statCardStyles from '../styles/stat-card.css?inline';

export class StatCard extends LitElement {
  static styles = unsafeCSS(statCardStyles);

  static properties = {
    label: { type: String, reflect: true },
    value: { type: String, reflect: true },
    unit: { type: String, reflect: true },
    icon: { type: String, reflect: true },
    accent: { type: String, reflect: true },
    clickable: { type: Boolean, reflect: true },
    selected: { type: Boolean, reflect: true },
    variant: { type: String, reflect: true }
  };

  constructor() {
    super();
    this.label = '';
    this.value = '';
    this.unit = null;
    this.icon = null;
    this.accent = null;
    this.clickable = false;
    this.selected = false;
    this.variant = 'default';
  }

  onActivate() {
    this.dispatchEvent(new CustomEvent('stat-card:activate', {
      bubbles: true,
      composed: true,
      detail: { label: this.label, value: this.value }
    }));
  }

  onKeyDown(e) {
    const k = e.key || e.code;
    if (k === 'Enter' || k === ' ' || k === 'Spacebar') {
      e.preventDefault();
      this.onActivate();
    }
  }

  render() {
    const hasIcon = !!this.icon;
    const grid = hasIcon ? '40px 1fr' : '1fr';
    const accent = this.accent || 'var(--color-accent)';
    const classes = ['card'];
    if (this.clickable) classes.push('clickable');

    return html`
      <style>
        :host{ --_accent: ${accent}; --_grid: ${grid}; }
      </style>
      <article class=${classes.join(' ')} role=${this.clickable ? 'button' : 'group'}
               aria-label=${this.label} ?tabindex=${this.clickable}
               aria-pressed=${this.clickable ? String(this.selected) : null}
               @click=${this.clickable ? this.onActivate : undefined}
               @keydown=${this.clickable ? this.onKeyDown : undefined}>
        ${hasIcon ? html`<div class="icon" aria-hidden="true"><span class="material-symbols-rounded">${this.icon}</span></div>` : null}
        <div class="meta">
          <div class="label">${this.label}</div>
          <div class="value">${this.value}${this.unit ? html` <span class="unit">${this.unit}</span>` : null}</div>
          <slot></slot>
          <slot name="footer" class="extra"></slot>
        </div>
      </article>
    `;
  }
}

customElements.define('stat-card', StatCard);
