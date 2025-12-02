import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Player extends Document {
  id: string;
  name: string;
  team: string;
  role: string;
  game?: string;
  kda?: string;
  achievements?: string[];
  stats?: {
    kda?: string;
    winRate?: number;
    matches?: number;
    rating?: number;
    averageCombatScore?: number;
    averageDamagePerRound?: number;
    killsPerRound?: number;
    assistsPerRound?: number;
    firstKillsPerRound?: number;
    firstDeathsPerRound?: number;
    headshotPercentage?: number;
    clutchSuccessPercentage?: number;
    killAssistsSurvivedTraded?: number;
  };
}

const StatsSchema = new Schema(
  {
    kda: String,
    winRate: Number,
    matches: Number,
    rating: Number,
    averageCombatScore: Number,
    averageDamagePerRound: Number,
    killsPerRound: Number,
    assistsPerRound: Number,
    firstKillsPerRound: Number,
    firstDeathsPerRound: Number,
    headshotPercentage: Number,
    clutchSuccessPercentage: Number,
    killAssistsSurvivedTraded: Number,
  },
  { _id: false }
);

const PlayerSchema = new Schema<Player>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    team: { type: String, required: true },
    role: { type: String, default: 'Flex' },
    game: { type: String, default: 'Valorant' },
    kda: { type: String },
    achievements: { type: [String], default: [] },
    stats: { type: StatsSchema, default: undefined },
  },
  { timestamps: true }
);

export const PlayerModel: Model<Player> =
  mongoose.models.Player || mongoose.model<Player>('Player', PlayerSchema);
