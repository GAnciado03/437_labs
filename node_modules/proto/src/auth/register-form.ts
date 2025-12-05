import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import registerFormStyles from "../../styles/register-form.css?inline";
import { apiUrl } from "../utils/api.ts";

const USERNAME_PATTERN = /^[A-Za-z]{3,16}$/;
const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_ ]).+$/;

@customElement("register-form")
export class RegisterFormElement extends LitElement {
  static styles = unsafeCSS(registerFormStyles);

  @property({ type: String }) api = apiUrl("/auth/register");
  @property({ type: String }) redirect = "/";
  @state() private error: string | null = null;
  @state() private formData: { first?: string; last?: string; username?: string; password?: string; confirm?: string } = {};

  get usernameError() {
    const username = this.formData.username || "";
    if (!username) return null;
    if (!USERNAME_PATTERN.test(username)) {
      return "Username must be 3-16 characters with no spaces.";
    }
    return null;
  }

  get passwordError() {
    const password = this.formData.password || "";
    if (!password) return null;
    if (!PASSWORD_PATTERN.test(password)) {
      return "Password needs an uppercase letter, a number, and a special character.";
    }
    return null;
  }

  get canSubmit() {
    const { first, last, username, password, confirm } = this.formData;
    const basicFilled = Boolean(this.api && first && last && username && password && confirm);
    const passwordsMatch = password === confirm;
    return Boolean(
      basicFilled &&
      passwordsMatch &&
      !this.usernameError &&
      !this.passwordError
    );
  }

  private handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const name = target?.name as keyof RegisterFormElement["formData"];
    const value = target?.value ?? "";
    this.formData = { ...this.formData, [name]: value };
    this.error = null;
  }

  private onSubmit = (ev: Event) => {
    ev.preventDefault();
    if (!this.canSubmit) { this.error = "Please fix the highlighted fields."; return; }
    const body = { username: this.formData.username, password: this.formData.password };
    fetch(this.api || "", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
      .then((res) => {
        if (res.status === 409) throw new Error("Username already exists. Try a different one.");
        if (res.status === 400) throw new Error("Invalid registration data.");
        if (res.status !== 201) throw new Error("Registration failed");
        return res.json();
      })
      .then((json: { token: string }) => {
        try {
          localStorage.setItem('token', json.token);
          const { first, last, username } = this.formData;
          localStorage.setItem('profile', JSON.stringify({ first, last, username }));
          // Persist profile server-side
          fetch(apiUrl('/api/me'), {
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
    const confirmMessage = mismatch ? "Passwords do not match" : "";
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
          ${this.usernameError ? html`<div class="error">${this.usernameError}</div>` : null}
        </label>
        <div class="row vertical">
          <label>
            <span>Password:</span>
            <input type="password" name="password" />
            <div class="error">${this.passwordError || ""}</div>
          </label>
          <label>
            <span>Confirm Password:</span>
            <input type="password" name="confirm" />
            <div class="error">${confirmMessage}</div>
          </label>
        </div>
        <button type="submit" ?disabled=${!this.canSubmit}>Register</button>
        ${this.error ? html`<div class="error">${this.error}</div>` : null}
      </form>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { "register-form": RegisterFormElement } }
