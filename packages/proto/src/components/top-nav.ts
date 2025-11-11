import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('top-nav')
export class TopNav extends LitElement {
  static styles = css`
    :host { display: block; }
    .row { margin: 0 0 var(--space-2, .75rem); }
    a { font-weight: 600; }
  `;

  @property({ type: String }) home = 'index.html';

  getPrevHref(): string | null {
    try {
      const ref = document.referrer;
      if (!ref) return null;
      const refUrl = new URL(ref);
      if (refUrl.origin !== location.origin) return null;
      return refUrl.pathname + refUrl.search + refUrl.hash || refUrl.pathname;
    } catch {
      return null;
    }
  }

  isHomePath(path: string | null): boolean {
    if (!path) return false;
    if (path === '/' || path.endsWith('/index.html')) return true;
    return path === `/${this.home}` || path === this.home;
  }

  render() {
    const prev = this.getPrevHref();
    const prevIsHome = this.isHomePath(prev);
    return html`
      <div class="row">
        ${prev && !prevIsHome ? html`<a href="${prev}">Back</a> · ` : null}
        <a href="${this.home}">Back to Home</a>
      </div>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'top-nav': TopNav } }

