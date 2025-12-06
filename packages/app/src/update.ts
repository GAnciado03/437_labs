import { Auth, Message, Update } from "@calpoly/mustang";
import type { Player } from "server/models";
import type { Msg, PlayerSaveCallbacks } from "./messages";
import type { Model } from "./model";
import { apiUrl } from "./utils/api";
import { MODEL_CONTEXT } from "./contexts";

const FAVORITES_KEY = "favPlayers";
const STORE_SELECTOR = `mu-store[provides="${MODEL_CONTEXT}"]`;

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "players/request": {
      let shouldFetch = false;
      apply((model) => {
        if (
          model.playersStatus === "loading" ||
          (model.playersStatus === "loaded" && model.players.length)
        ) {
          return model;
        }
        shouldFetch = true;
        return {
          ...model,
          playersStatus: "loading",
          playersError: undefined
        };
      });
      if (!shouldFetch) return;
      return () => {
        requestPlayers(user)
          .then((players) =>
            dispatchToStore(["players/load", { players }])
          )
          .catch((error) =>
            dispatchToStore([
              "players/error",
              { error: errorMessage(error) }
            ])
          );
      };
    }
    case "players/load": {
      const { players } = message[1];
      apply((model) => ({
        ...model,
        players,
        playersStatus: "loaded",
        playersError: undefined
      }));
      return;
    }
    case "players/error": {
      const { error } = message[1];
      apply((model) => ({
        ...model,
        playersError: error,
        playersStatus: "error"
      }));
      return;
    }
    case "favorites/init": {
      const favorites = readFavorites();
      apply((model) => ({
        ...model,
        favorites
      }));
      return;
    }
    case "favorites/toggle": {
      const { playerId } = message[1];
      if (!playerId) return;
      let next: string[] = [];
      apply((model) => {
        const normalized = playerId.toLowerCase();
        const existing = model.favorites.some(
          (fav) => fav.toLowerCase() === normalized
        );
        next = existing
          ? model.favorites.filter(
              (fav) => fav.toLowerCase() !== normalized
            )
          : [...model.favorites, playerId];
        return {
          ...model,
          favorites: next
        };
      });
      return () => {
        persistFavorites(next);
      };
    }
    case "player/merge": {
      const { player } = message[1];
      if (!player?.id) return;
      apply((model) => {
        const list = model.players ?? [];
        const index = list.findIndex(
          (existing) =>
            existing.id &&
            player.id &&
            existing.id.toLowerCase() === player.id.toLowerCase()
        );
        const players =
          index >= 0
            ? [
                ...list.slice(0, index),
                player,
                ...list.slice(index + 1)
              ]
            : [...list, player];
        return {
          ...model,
          players
        };
      });
      return;
    }
    case "player/save": {
      const [, payload] = message;
      const callbacks: PlayerSaveCallbacks = payload.callbacks ?? {};
      const { player } = payload;
      if (!player?.id) return;
      return () => {
        savePlayer(player, user)
          .then((saved) => {
            dispatchToStore(["player/merge", { player: saved }]);
            callbacks.onSuccess?.();
          })
          .catch((error) => {
            callbacks.onFailure?.(
              error instanceof Error
                ? error
                : new Error(String(error))
            );
          });
      };
    }
    default:
      return;
  }
}

async function requestPlayers(user: Auth.User) {
  const response = await fetch(apiUrl("/api/players"), {
    headers: {
      ...Auth.headers(user)
    }
  });
  if (response.status === 401) {
    throw new Error("Please log in to view player data.");
  }
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const payload = await response.json();
  if (Array.isArray(payload)) return payload;
  if (payload) return [payload];
  return [];
}

function readFavorites(): string[] {
  try {
    if (typeof localStorage === "undefined") return [];
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistFavorites(favorites: string[]) {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favorites)
    );
  } catch {
    // ignore storage failures
  }
}

function dispatchToStore(msg: Msg) {
  const target = document.querySelector<HTMLElement>(
    STORE_SELECTOR
  );
  if (!target) return;
  Message.dispatch(target, ...msg);
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

async function savePlayer(player: Player, user: Auth.User) {
  const id = player.id;
  if (!id) throw new Error("Player id is required to save.");
  const response = await fetch(apiUrl(`/api/players/${encodeURIComponent(id)}`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(player)
  });
  if (response.status === 401) {
    throw new Error("Please log in to edit player data.");
  }
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return (await response.json()) as Player;
}
