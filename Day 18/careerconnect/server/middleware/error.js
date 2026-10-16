export const notFound = (req, res) =>
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });

export const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message;

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  } else if (err.name === "CastError") {
    status = 400;
    message = "Invalid ID";
  } else if (err.code === 11000) {
    status = 409;
    message = "Duplicate value already exists";
  }

  if (status === 500) {
    console.error(err); // log server-side only
    message = "Server error";
  }
  res.status(status).json({ message });
};