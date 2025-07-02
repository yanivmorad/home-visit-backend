// src/server.js
require("dotenv").config(); // טען משתני סביבה מ‐.env
const express = require("express");
const cors = require("cors");
const db = require("./db"); // מופע Knex
const childrenRoutes = require("./routes/childrenRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const { errorMiddleware } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Health-check (אופציונלי)
app.get("/health", async (req, res) => {
  try {
    await db.raw("SELECT 1+1 AS result");
    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Routes
app.use("/api/children", childrenRoutes);
app.use("/api/meetings", meetingRoutes);

// Global error handler
app.use(errorMiddleware);

// Start server after לוודא חיבור ל-DB
(async () => {
  try {
    await db.raw("SELECT 1");
    console.log("✅ Database connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
  }
})();
