import type { Player } from "server/models";

export type Msg =
  | ["players/request"]
  | ["players/load", { players: Player[] }]
  | ["players/error", { error: string }]
  | ["favorites/init"]
  | ["favorites/toggle", { playerId: string }];
