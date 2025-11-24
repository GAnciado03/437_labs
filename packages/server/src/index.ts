import express, { Request, Response } from "express";
import cors from "cors";
import { resolve } from "node:path";
import { connect } from "./services/mongo";
import { seedFromProtoData } from "./seed";
import players from "./routes/players";
import teams from "./routes/teams";
import users from "./routes/users";
import auth, { authenticateUser } from "./routes/auth";
import { errorHandler } from "./middleware/error";

const app = express();
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";
const publicUrl = process.env.PUBLIC_URL || `http://localhost:${port}`;
const staticDir = process.env.STATIC || "public";
const staticPath = resolve(staticDir);
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
