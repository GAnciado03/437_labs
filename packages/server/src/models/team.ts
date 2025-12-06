import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Team extends Document {
  id: string;
  name: string;
  tag?: string;
  region?: string;
  game?: string;
  rank?: number;
  country?: string;
  record?: string;
  earnings?: string;
  logo?: string;
  lastPlayed?: string;
  lastOpponent?: string;
  lastOpponentLogo?: string;
}

const TeamSchema = new Schema<Team>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    region: { type: String },
    tag: { type: String, index: true, sparse: true },
    game: { type: String, default: 'Valorant' },
    rank: { type: Number },
    country: { type: String },
    record: { type: String },
    earnings: { type: String },
    logo: { type: String },
    lastPlayed: { type: String },
    lastOpponent: { type: String },
    lastOpponentLogo: { type: String },
  },
  { timestamps: true }
);

export const TeamModel: Model<Team> =
  mongoose.models.Team || mongoose.model<Team>('Team', TeamSchema);
