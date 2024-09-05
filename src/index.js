import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import spamRoutes from "./routes/spamRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/spam", spamRoutes);

const DOMAIN = process.env.DOMAIN || "http://localhost";
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${DOMAIN}:${PORT}`);
});
