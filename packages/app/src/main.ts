import { Auth, History, Switch, define } from "@calpoly/mustang";
import { html } from "lit";
import "./views/home-view";
import "./views/player-view";
import "./views/favorites-view";
import HeaderElement from "./components/blazing-header";

const HISTORY_KEY = "app:history";
const AUTH_KEY = "app:auth";

type Route = Switch.Route;

const routes: Route[] = [
  { path: "/app", view: () => html`<home-view></home-view>` },
  { path: "/app/", redirect: "/app" },
  {
    path: "/app/players/favorites",
    view: () => html`<favorites-view></favorites-view>`
  },
  {
    path: "/app/players/:id",
    view: (params: Switch.Params) =>
      html`<player-view player-id=${params.id}></player-view>`
  },
  {
    path: "/app/players",
    view: () => html`<player-view></player-view>`
  },
  { path: "/", redirect: "/app" }
];

class AppSwitch extends Switch.Element {
  constructor() {
    super(routes, HISTORY_KEY, AUTH_KEY);
  }
}

const elements = {
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-switch": AppSwitch,
  "blazing-header": HeaderElement
} as const;

define(elements);

