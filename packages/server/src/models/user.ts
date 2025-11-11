import { Document, Schema, model, Model } from "mongoose";

export interface User extends Document {
  username: string;
  first?: string;
  last?: string;
  favPlayers: string[];
  favTeams: string[];
}

const UserSchema = new Schema<User>(
  {
    username: { type: String, required: true, unique: true, index: true },
    first: { type: String },
    last: { type: String },
    favPlayers: { type: [String], default: [] },
    favTeams: { type: [String], default: [] }
  },
  { collection: "users" }
);

export const UserModel: Model<User> =
  model<User>("User", UserSchema);

