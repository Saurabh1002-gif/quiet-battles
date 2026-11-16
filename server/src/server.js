import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import seriesRoutes from "./routes/series.js";
import chapterRoutes from "./routes/chapters.js";
import productRoutes from "./routes/products.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok", message: "QUIET BATTLES API is running." }));
app.use("/api/auth", authRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/products", productRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 11000) return res.status(409).json({ message: "This URL slug is already in use. Please choose another one." });
  if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
  if (err.name === "CastError") return res.status(400).json({ message: "The selected record is not valid." });
  res.status(500).json({ message: "The server could not complete this request." });
});

connectDatabase()
  .then(() => app.listen(port, () => console.log(`QUIET BATTLES API listening on port ${port}`)))
  .catch((error) => { console.error("Could not start the API:", error.message); process.exit(1); });
