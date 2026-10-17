exports.notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || "Server error";

  if (err.type === "entity.parse.failed") { status = 400; message = "Malformed JSON body"; }
  else if (err.name === "CastError") { status = 400; message = `Invalid ${err.path}`; }
  else if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  }
  else if (err.code === 11000) { status = 409; message = "Duplicate value already exists"; }
  else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    status = 401; message = "Invalid or expired token";
  }
  else if (["MongooseServerSelectionError", "MongoNetworkError", "MongoServerSelectionError"].includes(err.name)) {
    status = 503; message = "Service temporarily unavailable. Please try again later.";
  }

  if (status >= 500) console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, err);

  if (status === 500 && process.env.NODE_ENV === "production") {
    message = "Something went wrong. Please try again later.";
  }

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV !== "production" && status >= 500 ? { stack: err.stack } : {}),
  });
};
