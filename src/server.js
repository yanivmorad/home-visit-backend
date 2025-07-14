require("dotenv").config(); // טען משתני סביבה מ‐.env
const express = require("express");
const cors = require("cors");
const db = require("./db"); // מופע Knex
const { authorize } = require("./middleware/auth");
const { errorMiddleware } = require("./middleware/errorHandler");
const childrenRoutes = require("./routes/childrenRoutes");
const meetingRoutes = require("./routes/meetingRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// סדר חשוב: קודם body-parser, אחר כך cors
app.use(express.json());
app.use(cors());

// נקודת בדיקת בריאות (לא דורשת אימות)
app.get("/health", async (req, res, next) => {
  try {
    await db.raw("SELECT 1+1 AS result");
    res.status(200).json({ status: "ok" });
  } catch (err) {
    next(err);
  }
});

// כל נתיב תחת /api/children ו‐/api/meetings יעבור קודם דרך המידלוור authorize
app.use("/api/children", authorize, childrenRoutes);
app.use("/api/meetings", authorize, meetingRoutes);

// מטפל בשגיאות מכל הקוד שקדם
app.use(errorMiddleware);

// הפעלת השרת רק אחרי חיבור תקין לבסיס הנתונים
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
