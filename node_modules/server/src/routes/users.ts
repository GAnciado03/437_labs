import express, { Request, Response } from "express";
import { UserModel } from "../models/user";

const router = express.Router();

// Helper to ensure a user record exists
async function ensureUser(username: string) {
  let user = await UserModel.findOne({ username }).lean();
  if (!user) {
    user = (await UserModel.create({ username, favPlayers: [], favTeams: [] })).toObject();
  }
  return user;
}

// GET /api/me
router.get("/", async (req: Request, res: Response) => {
  const username = (res.locals && res.locals.username) as string | undefined;
  if (!username) return res.status(401).end();
  try {
    const user = await ensureUser(username);
    res.json({
      username: user.username,
      first: user.first,
      last: user.last,
      favPlayers: user.favPlayers || [],
      favTeams: user.favTeams || []
    });
  } catch (e: any) {
    res.status(500).json({ error: String(e) });
  }
});

// PUT /api/me
router.put("/", async (req: Request, res: Response) => {
  const username = (res.locals && res.locals.username) as string | undefined;
  if (!username) return res.status(401).end();
  try {
    const { first, last, favPlayers, favTeams } = req.body || {};
    const update: any = {};
    if (typeof first === "string") update.first = first;
    if (typeof last === "string") update.last = last;
    if (Array.isArray(favPlayers)) update.favPlayers = favPlayers.filter((x) => typeof x === "string");
    if (Array.isArray(favTeams)) update.favTeams = favTeams.filter((x) => typeof x === "string");

    const saved = await UserModel.findOneAndUpdate(
      { username },
      { $set: update },
      { new: true, upsert: true }
    ).lean();

    res.json({
      username: saved?.username,
      first: saved?.first,
      last: saved?.last,
      favPlayers: saved?.favPlayers || [],
      favTeams: saved?.favTeams || []
    });
  } catch (e: any) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;

