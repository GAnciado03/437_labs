import type { Player } from "server/models";

export type LoadingState = "idle" | "loading" | "loaded" | "error";

export interface Model {
  players: Player[];
  playersStatus: LoadingState;
  playersError?: string;
  favorites: string[];
}

export const init: Model = {
  players: [],
  playersStatus: "idle",
  favorites: []
};
