import type { Player } from "server/models";

export type PlayerSaveCallbacks = {
  onSuccess?: () => void;
  onFailure?: (error: Error) => void;
};

export type Msg =
  | ["players/request"]
  | ["players/load", { players: Player[] }]
  | ["players/error", { error: string }]
  | ["favorites/init"]
  | ["favorites/toggle", { playerId: string }]
  | ["player/merge", { player: Player }]
  | ["player/save", { player: Player; callbacks?: PlayerSaveCallbacks }];
