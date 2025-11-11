import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("login-form")
export class LoginFormElement extends LitElement {
  static styles = css`
    :host { display: block; }
    form { display: grid; gap: .75rem; }
    label { display: grid; gap: .25rem; }
    input { padding: .5rem .6rem; border: 1px solid var(--color-border,#e5e7eb); border-radius: 8px; }
    button { padding: .6rem .9rem; border-radius: 8px; border: none; background: var(--color-accent,#4f46e5); color: white; font-weight: 600; }
    .error { color: #b91c1c; }
  `;

  @property({ type: String }) api = "/auth/login";
  @property({ type: String }) redirect = "/";
  @state() private error: string | null = null;
  @state() private formData: { username?: string; password?: string } = {};

  get canSubmit() {
    return Boolean(this.api && this.formData.username && this.formData.password);
  }

  private handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const name = target?.name as "username" | "password";
    const value = target?.value ?? "";
    const prev = this.formData;
    switch (name) {
      case "username":
        this.formData = { ...prev, username: value };
        break;
      case "password":
        this.formData = { ...prev, password: value };
        break;
    }
  }

  private onSubmit = (ev: Event) => {
    ev.preventDefault();
    if (!this.canSubmit) return;
    fetch(this.api || "", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.formData)
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) throw new Error("Login failed");
        return res.json();
      })
      .then((json: { token: string }) => {
        try {
          localStorage.setItem('token', json.token);
          if (this.formData.username) {
            const prof = JSON.parse(localStorage.getItem('profile') || '{}');
            localStorage.setItem('profile', JSON.stringify({ ...prof, username: this.formData.username }));
          }
          // Load server profile details (e.g., first/last) and cache locally
          fetch('/api/me', { headers: { 'Authorization': `Bearer ${json.token}` } })
            .then((r) => r.ok ? r.json() : null)
            .then((me) => {
              if (me) {
                const prev = JSON.parse(localStorage.getItem('profile') || '{}');
                localStorage.setItem('profile', JSON.stringify({ ...prev, first: me.first, last: me.last }));
                try {
                  if (Array.isArray(me.favPlayers)) localStorage.setItem('favPlayers', JSON.stringify(me.favPlayers));
                  if (Array.isArray(me.favTeams)) localStorage.setItem('favTeams', JSON.stringify(me.favTeams));
                } catch {}
              }
            }).catch(() => {});
        } catch {}
        const evt = new CustomEvent("auth:message", {
          bubbles: true,
          composed: true,
          detail: ["auth/signin", { token: json.token, redirect: this.redirect }]
        });
        this.dispatchEvent(evt);
      })
      .catch((err: any) => {
        this.error = err?.message || String(err);
      });
  };

  render() {
    return html`
      <form @change=${this.handleChange} @submit=${this.onSubmit}>
        <label>
          <span>Username:</span>
          <input name="username" autocomplete="off" />
        </label>
        <label>
          <span>Password:</span>
          <input type="password" name="password" />
        </label>
        <button type="submit">Login</button>
        ${this.error ? html`<div class="error">${this.error}</div>` : null}
      </form>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { "login-form": LoginFormElement } }
