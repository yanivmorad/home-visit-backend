// src/server.js
const express = require("express");
const cors = require("cors");
const { PORT } = require("./config/constants");
const { initializeDataFiles } = require("./utils/fileUtils");
const childrenRoutes = require("./routes/childrenRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const { errorMiddleware } = require("./middleware/errorHandler");
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/children", childrenRoutes);
app.use("/api/meetings", meetingRoutes);
app.use(errorMiddleware);

// Start server
app.listen(PORT, async () => {
  await initializeDataFiles();
  console.log(`Server running on http://localhost:${PORT}`);
});
