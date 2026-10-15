module.exports = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || "Server error";
  let errors;

  if (err.name === "ValidationError") {
    status = 400;
    errors = {};
    Object.values(err.errors).forEach((e) => (errors[e.path] = e.message));
    message = "Validation failed";
  }
  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `This ${field} is already registered`;
  }
  if (err.name === "CastError") {
    status = 400;
    message = "Invalid ID";
  }

  if (status === 500) console.error(err);
  res.status(status).json({ success: false, message, errors });
};