import { html } from "lit";
import { Switch } from "@calpoly/mustang";
import "./pages/home-view.ts";
import "./components/team-chooser.ts";
import "./components/user-dashboard.ts";
import "./pages/static-pages.ts";
import "./components/player-view.js";
import "./components/game-view.js";
import "./components/player-stats.js";
import "./components/team-view.js";
import "./components/top-nav.js";
import "./components/player-list.js";
import "./auth/login-form.ts";
import "./auth/register-form.ts";

const HISTORY_CONTEXT = "mu:history";
const AUTH_CONTEXT = "mu:auth";

type Route = Switch.Route;

const routes: Route[] = [
  { path: "/", view: () => html`<home-view></home-view>` },
  { path: "/index.html", redirect: "/" },
  {
    path: "/login.html",
    view: () => html`
      <main class="container">
        <h2>User Login</h2>
        <section class="card" style="max-width: 420px; margin: 0 auto;">
          <login-form api="/auth/login"></login-form>
          <p style="margin-top: 1rem;">
            New here? <a href="newuser.html">Register</a>
          </p>
        </section>
      </main>
    `
  },
  {
    path: "/newuser.html",
    view: () => html`
      <main class="container">
        <h2>Register</h2>
        <section class="card" style="max-width: 520px; margin: 0 auto;">
          <register-form api="/auth/register"></register-form>
          <p style="margin-top: 1rem;">
            Already have an account? <a href="login.html">Log in</a>
          </p>
        </section>
      </main>
    `
  },
  { path: "/game.html", view: () => html`<main class="container"><top-nav home="index.html"></top-nav><game-view></game-view></main>` },
  { path: "/player.html", view: () => html`<main class="container"><player-view></player-view></main>` },
  { path: "/stats.html", view: () => html`<main class="container"><player-stats></player-stats></main>` },
  { path: "/team.html", view: () => html`<main class="container"><team-view></team-view></main>` },
  { path: "/teamchooser.html", view: () => html`<team-chooser></team-chooser>` },
  { path: "/events.html", view: () => html`<events-view></events-view>` },
  { path: "/match.html", view: () => html`<match-view></match-view>` },
  { path: "/tournament.html", view: () => html`<tournament-view></tournament-view>` },
  {
    path: "/user.html",
    view: () => html`<user-dashboard></user-dashboard>`,
    auth: "protected"
  }
];

export class AppRouter extends Switch.Element {
  constructor() {
    super(routes, HISTORY_CONTEXT, AUTH_CONTEXT);
    this._fallback = () => html`
      <main class="container">
        <h1>Not Found</h1>
        <p class="muted">The requested page does not exist.</p>
        <p><a href="index.html">Back to Home</a></p>
      </main>
    `;
  }
}

customElements.define("app-router", AppRouter);
