import { LitElement, html, css } from "lit";
import { define, Auth, History } from "@calpoly/mustang";
import "./app-router.ts";

const HISTORY_CONTEXT = "mu:history";
const AUTH_CONTEXT = "mu:auth";

class AppShell extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--color-app-bg, var(--color-base,#f8fafc));
    }
    .shell {
      min-height: 100vh;
    }
  `;

  render() {
    return html`
      <mu-history provides=${HISTORY_CONTEXT}>
        <mu-auth provides=${AUTH_CONTEXT} redirect="/login.html">
          <div class="shell">
            <app-router></app-router>
          </div>
        </mu-auth>
      </mu-history>
    `;
  }

  createRenderRoot() {
    return this;
  }
}

define({
  "app-shell": AppShell,
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider
});
