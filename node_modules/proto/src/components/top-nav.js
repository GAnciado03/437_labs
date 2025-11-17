import { LitElement, html, unsafeCSS } from 'lit';
import topNavStyles from '../styles/top-nav.css?inline';

export class TopNav extends LitElement {
  static styles = unsafeCSS(topNavStyles);

  static properties = {
    home: { type: String }
  };

  constructor() {
    super();
    this.home = 'index.html';
  }

  getPrevHref() {
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

  isHomePath(path) {
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

customElements.define('top-nav', TopNav);
