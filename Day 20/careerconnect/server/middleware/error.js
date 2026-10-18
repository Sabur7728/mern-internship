import ApiError from '../utils/ApiError.js';

export const notFound = (req, _res, next) =>
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));

// Centralized error handler
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  let status = err.status || 500;
  let message = err.message;
  let details = err.details;

  if (err.name === 'ValidationError' && err.errors) {
    status = 400; message = 'Validation failed';
    details = Object.values(err.errors).map((e) => e.message);
  } else if (err.name === 'CastError') {
    status = 400; message = `Invalid value for ${err.path}`;
  } else if (err.code === 11000) {
    status = 409; message = `Duplicate value for: ${Object.keys(err.keyValue || {}).join(', ')}`;
  } else if (err.type === 'entity.parse.failed') {
    status = 400; message = 'Invalid JSON body';
  }

  if (status >= 500) {
    console.error(err);
    if (process.env.NODE_ENV === 'production') message = 'Internal server error';
  }
  res.status(status).json({ success: false, message, details });
};
