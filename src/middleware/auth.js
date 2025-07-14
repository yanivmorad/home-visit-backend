// src/middleware/auth.js
require("dotenv").config();

const secret = process.env.ACCESS_TOKEN;

function authorize(req, res, next) {
  const token =
    req.headers["x-access-token"] ||
    req.query.access ||
    (req.body && req.body.access); // רק אם body קיים

  console.log("📬 Header:", req.headers["x-access-token"]);
  console.log("📬 Query:", req.query.access);
  console.log("📬 Body:", req.body?.access); // הצגת ערך אם יש
  console.log("✅ Token received:", token);

  if (token !== secret) {
    return res.status(403).json({ error: "Access Denied" });
  }

  next();
}

module.exports = { authorize };
