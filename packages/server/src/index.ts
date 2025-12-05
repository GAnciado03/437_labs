import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import fs from "node:fs/promises";
import path from "node:path";
import { connect } from "./services/mongo";
import { seedFromProtoData } from "./seed";
import players from "./routes/players";
import teams from "./routes/teams";
import matches from "./routes/matches";
import users from "./routes/users";
import auth, { authenticateUser } from "./routes/auth";
import syncRoutes from "./routes/sync";
import { errorHandler } from "./middleware/error";

const app = express();
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";
const publicUrl = process.env.PUBLIC_URL || `http://localhost:${port}`;
const staticDir = process.env.STATIC || "public";
const staticPath = path.resolve(staticDir);
console.log("Static dir:", staticPath);

app.use(cors());
app.use(express.json());
const staticHandler = express.static(staticPath);
app.use(staticHandler);
app.use("/app", staticHandler);

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

// API routes
app.use("/auth", auth);
// Protect data APIs with JWT
app.use("/api/players", players);
app.use("/api/teams", teams);
app.use("/api/matches", authenticateUser, matches);
app.use("/api/me", authenticateUser, users);
app.use("/api/sync", authenticateUser, syncRoutes);

app.use("/app", (req: Request, res: Response, next: NextFunction) => {
  const indexHtml = path.resolve(staticPath, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" })
    .then((html) => res.send(html))
    .catch(next);
});

app.listen(port, host, () => {
  console.log(`Server running at ${publicUrl}`);
});

connect("437esportsdatabase");

if (process.env.SEED === 'true') {
  seedFromProtoData().then(() =>
    console.log('Seeded from proto data')
  ).catch(() => {});
}

// Centralized error handler (keep last)
app.use(errorHandler);
