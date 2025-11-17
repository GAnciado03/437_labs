import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { join, resolve } from "node:path";
import { connect } from "./services/mongo";
import { seedFromProtoData } from "./seed";
import players from "./routes/players";
import teams from "./routes/teams";
import users from "./routes/users";
import auth, { authenticateUser } from "./routes/auth";
import { errorHandler } from "./middleware/error";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
const staticPath = resolve(staticDir);
const indexFile = join(staticPath, "index.html");
console.log("Static dir:", staticPath);

app.use(cors());
app.use(express.json());
app.use(express.static(staticPath));

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

// API routes
app.use("/auth", auth);
// Protect data APIs with JWT
app.use("/api/players", authenticateUser, players);
app.use("/api/teams", authenticateUser, teams);
app.use("/api/me", authenticateUser, users);

// SPA fallback for non-API routes
app.get("*", (req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "GET") return next();
  if (req.path.startsWith("/api") || req.path.startsWith("/auth")) return next();
  res.sendFile(indexFile, (err) => {
    if (err) next(err);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

connect("437esportsdatabase");

if (process.env.SEED === 'true') {
  seedFromProtoData().then(() =>
    console.log('Seeded from proto data')
  ).catch(() => {});
}

// Centralized error handler (keep last)
app.use(errorHandler);
