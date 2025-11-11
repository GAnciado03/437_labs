import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("register-form")
export class RegisterFormElement extends LitElement {
  static styles = css`
    :host { display: block; }
    form { display: grid; gap: .75rem; }
    label { display: grid; gap: .25rem; }
    input { padding: .5rem .6rem; border: 1px solid var(--color-border,#e5e7eb); border-radius: 8px; }
    button { padding: .6rem 1rem; border-radius: 8px; border: none; background: var(--color-accent,#4f46e5); color: white; font-weight: 600; }
    .row { display: grid; gap: .75rem; grid-template-columns: 1fr 1fr; }
    .error { color: #b91c1c; }
  `;

  @property({ type: String }) api = "/auth/register";
  @property({ type: String }) redirect = "/";
  @state() private error: string | null = null;
  @state() private formData: { first?: string; last?: string; username?: string; password?: string; confirm?: string } = {};

  get canSubmit() {
    const { first, last, username, password, confirm } = this.formData;
    return Boolean(this.api && first && last && username && password && confirm && password === confirm);
  }

  private handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const name = target?.name as keyof RegisterFormElement["formData"];
    const value = target?.value ?? "";
    this.formData = { ...this.formData, [name]: value };
  }

  private onSubmit = (ev: Event) => {
    ev.preventDefault();
    if (!this.canSubmit) { this.error = "Please complete all fields"; return; }
    const body = { username: this.formData.username, password: this.formData.password };
    fetch(this.api || "", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
      .then((res) => {
        if (res.status !== 201) throw new Error("Registration failed");
        return res.json();
      })
      .then((json: { token: string }) => {
        try {
          localStorage.setItem('token', json.token);
          const { first, last, username } = this.formData;
          localStorage.setItem('profile', JSON.stringify({ first, last, username }));
          // Persist profile server-side
          fetch('/api/me', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${json.token}`
            },
            body: JSON.stringify({ first, last })
          }).catch(() => {});
        } catch {}
        const evt = new CustomEvent("auth:message", {
          bubbles: true, composed: true,
          detail: ["auth/signin", { token: json.token, redirect: this.redirect }]
        });
        this.dispatchEvent(evt);
      })
      .catch((err: any) => { this.error = err?.message || String(err); });
  };

  render() {
    const mismatch = this.formData.password && this.formData.confirm && this.formData.password !== this.formData.confirm;
    return html`
      <form @change=${this.handleChange} @submit=${this.onSubmit}>
        <div class="row">
          <label>
            <span>First Name:</span>
            <input name="first" autocomplete="given-name" />
          </label>
          <label>
            <span>Last Name:</span>
            <input name="last" autocomplete="family-name" />
          </label>
        </div>
        <label>
          <span>Username:</span>
          <input name="username" autocomplete="off" />
        </label>
        <div class="row">
          <label>
            <span>Password:</span>
            <input type="password" name="password" />
          </label>
          <label>
            <span>Confirm Password:</span>
            <input type="password" name="confirm" />
          </label>
        </div>
        ${mismatch ? html`<div class="error">Passwords do not match</div>` : null}
        <button type="submit" ?disabled=${!this.canSubmit}>Register</button>
        ${this.error ? html`<div class="error">${this.error}</div>` : null}
      </form>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { "register-form": RegisterFormElement } }
