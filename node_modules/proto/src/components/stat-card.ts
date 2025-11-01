import { LitElement, css, html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('stat-card')
export class StatCard extends LitElement {
  // Attributes / properties
  @property({ type: String, reflect: true }) label = '';
  @property({ type: String, reflect: true }) value = '';
  @property({ type: String, reflect: true }) unit: string | null = null;
  @property({ type: String, reflect: true }) icon: string | null = null;
  @property({ type: String, reflect: true }) accent: string | null = null;
  @property({ type: Boolean, reflect: true }) clickable = false;
  @property({ type: String, reflect: true }) variant: 'default' | 'compact' = 'default';

  static styles = css`
    :host { display: block; }
    :host([variant="compact"]) .card { padding: var(--space-2, .75rem); }
    :host([variant="compact"]) .value { font-size: clamp(1.1rem, .9rem + .6vw, 1.35rem); }
    :host([variant="compact"]) .icon { width: 34px; height: 34px; }

    .card {
      background: var(--color-surface, #fff);
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-lg, 14px);
      padding: var(--space-3, 1rem);
      min-height: 120px;
      box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,.08));
      display: grid;
      grid-template-columns: var(--_grid, 1fr);
      gap: var(--space-3, 1rem);
      align-items: center;
    }
    .card.clickable { cursor: pointer; }

    .icon {
      width: 40px; height: 40px; border-radius: 10px;
      background: color-mix(in srgb, var(--_accent) 10%, transparent);
      color: var(--_accent);
      display: grid; place-items: center;
    }
    .material-symbols-rounded {
      font-family: 'Material Symbols Rounded';
      font-variation-settings: 'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24;
      line-height: 1; font-size: 24px;
    }
    .meta { display: grid; gap: 2px; }
    .label { color: var(--color-muted, #666); font-size: 0.9rem; }
    .value { color: var(--color-heading, #111); font-weight: 800;
      font-size: clamp(1.25rem, 1rem + 1vw, 1.75rem); letter-spacing: .2px; }
    .unit { color: var(--color-muted, #666); font-weight: 600; font-size: .95rem; }
    .extra { color: var(--color-muted, #666); font-size: .9rem; }
  `;

  private onActivate() {
    this.dispatchEvent(new CustomEvent('stat-card:activate', {
      bubbles: true,
      composed: true,
      detail: { label: this.label, value: this.value }
    }));
  }

  private onKeyDown(e: KeyboardEvent) {
    const k = e.key || (e as any).code;
    if (k === 'Enter' || k === ' ' || k === 'Spacebar') {
      e.preventDefault();
      this.onActivate();
    }
  }

  protected render(): TemplateResult {
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

declare global {
  interface HTMLElementTagNameMap { 'stat-card': StatCard }
}

