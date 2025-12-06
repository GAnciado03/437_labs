import { Auth, Form, History, Store, Switch, define } from "@calpoly/mustang";
import { html } from "lit";
import "./views/home-view";
import "./views/player-view";
import "./views/favorites-view";
import "./views/player-edit-view";
import HeaderElement from "./components/blazing-header";
import { AUTH_CONTEXT, HISTORY_CONTEXT } from "./contexts";
import type { Model } from "./model";
import { init } from "./model";
import type { Msg } from "./messages";
import update from "./update";

type Route = Switch.Route;

const routes: Route[] = [
  { path: "/app", view: () => html`<home-view></home-view>` },
  { path: "/app/", redirect: "/app" },
  {
    path: "/app/players/favorites",
    view: () => html`<favorites-view></favorites-view>`
  },
  {
    path: "/app/players/:id/edit",
    view: (params: Switch.Params) =>
      html`<player-edit-view player-id=${params.id}></player-edit-view>`
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
    super(routes, HISTORY_CONTEXT, AUTH_CONTEXT);
  }
}

class AppStore extends Store.Provider<Model, Msg> {
  constructor() {
    super(update, init, AUTH_CONTEXT);
  }
}

const elements = {
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-switch": AppSwitch,
  "mu-store": AppStore,
  "mu-form": Form.Element,
  "blazing-header": HeaderElement
} as const;

define(elements);
