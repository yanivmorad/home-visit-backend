// src/middleware/errorHandler.js

const handleErrors = (res, error, message = "Server error", status = 500) => {
  console.error(error);
  const response = { success: false, message };
  if (process.env.NODE_ENV !== "production" && error?.message) {
    response.error = error.message;
  }
  res.status(status).json(response);
};

// Middleware גלובלי לתפיסת שגיאות מ־next(err)
const errorMiddleware = (err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    success: false,
    message: "Unexpected server error",
    ...(process.env.NODE_ENV !== "production" && err.message
      ? { error: err.message }
      : {}),
  });
};

module.exports = {
  handleErrors,
  errorMiddleware,
};
