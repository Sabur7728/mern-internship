const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(PORT, () => console.log(`API running on port ${PORT} (${process.env.NODE_ENV})`));
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
})();

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  process.exit(1);
});
