import "dotenv/config";
import express from "express";
import cors from "cors";
import jobRoutes from "./routes/jobRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
const port = process.env.PORT || 5000;

// Middleware (order matters)
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(requestLogger);

// Routes
app.get("/", (request, response) => {
  response.json({ success: true, message: "CareerConnect API is running" });
});

app.get("/api/status", (request, response) => {
  response.json({ success: true, service: "CareerConnect API", status: "running" });
});

app.use("/api/jobs", jobRoutes);
app.use("/api/candidates", candidateRoutes);

// 404 first, then centralized error handler (always last)
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`CareerConnect API running on port ${port}`);
});