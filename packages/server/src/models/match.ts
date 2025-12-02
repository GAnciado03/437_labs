import mongoose, { Schema, Document, Model } from 'mongoose';

export type MatchType = 'upcoming' | 'live' | 'result';

export interface Match extends Document {
  id: string;
  type: MatchType;
  team1: string;
  team2: string;
  flag1?: string;
  flag2?: string;
  team1Logo?: string;
  team2Logo?: string;
  score1?: string;
  score2?: string;
  team1RoundCt?: string;
  team1RoundT?: string;
  team2RoundCt?: string;
  team2RoundT?: string;
  mapNumber?: string;
  currentMap?: string;
  matchSeries?: string;
  matchEvent?: string;
  timeUntilMatch?: string;
  timeCompleted?: string;
  scheduledAt?: Date;
  matchPage: string;
  tournamentName?: string;
  tournamentIcon?: string;
  raw?: unknown;
}

const MatchSchema = new Schema<Match>(
  {
    id: { type: String, required: true, unique: true, index: true },
    type: {
      type: String,
      enum: ['upcoming', 'live', 'result'],
      required: true,
    },
    team1: { type: String, required: true },
    team2: { type: String, required: true },
    flag1: { type: String },
    flag2: { type: String },
    team1Logo: { type: String },
    team2Logo: { type: String },
    score1: { type: String },
    score2: { type: String },
    team1RoundCt: { type: String },
    team1RoundT: { type: String },
    team2RoundCt: { type: String },
    team2RoundT: { type: String },
    mapNumber: { type: String },
    currentMap: { type: String },
    matchSeries: { type: String },
    matchEvent: { type: String },
    timeUntilMatch: { type: String },
    timeCompleted: { type: String },
    scheduledAt: { type: Date },
    matchPage: { type: String, required: true },
    tournamentName: { type: String },
    tournamentIcon: { type: String },
    raw: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const MatchModel: Model<Match> =
  mongoose.models.Match || mongoose.model<Match>('Match', MatchSchema);
