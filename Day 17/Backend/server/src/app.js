const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({ success: true, message: "CareerConnect API is running" });
});

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/candidates", require("./routes/candidateRoutes"));
app.use("/api/companies", require("./routes/companyRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler (sabse last mein)
app.use(errorHandler);

module.exports = app;