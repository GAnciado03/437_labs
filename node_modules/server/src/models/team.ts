import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Team extends Document {
  id: string;
  name: string;
  region?: string;
}

const TeamSchema = new Schema<Team>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    region: { type: String },
  },
  { timestamps: true }
);

export const TeamModel: Model<Team> =
  mongoose.models.Team || mongoose.model<Team>('Team', TeamSchema);

