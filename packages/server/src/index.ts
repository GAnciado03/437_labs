import express, { Request, Response } from "express";
import cors from "cors";
import { connect } from "./services/mongo";
import { seedFromProtoData } from "./seed";
import players from "./routes/players";
import teams from "./routes/teams";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(cors());
app.use(express.json());
app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

// API routes
app.use("/api/players", players);
app.use("/api/teams", teams);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

connect("437esportsdatabase");

if (process.env.SEED === 'true') {
  seedFromProtoData().then(() =>
    console.log('Seeded from proto data')
  ).catch(() => {});
}
