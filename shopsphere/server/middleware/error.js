exports.notFound = (req, res) => res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
const DB_DOWN = ['MongoNetworkError', 'MongoServerSelectionError', 'MongooseServerSelectionError', 'MongoNotConnectedError'];
exports.errorHandler = (err, req, res, next) => {
  let status = err.status || 500, message = err.message;
  if (err.type === 'entity.parse.failed') { status = 400; message = 'Invalid JSON in request body'; }
  else if (err.type === 'entity.too.large') { status = 413; message = 'Request body too large'; }
  else if (err.name === 'CastError') { status = 400; message = `Invalid ${err.path}`; }
  else if (err.name === 'ValidationError') { status = 400; message = Object.values(err.errors).map((e) => e.message).join(', '); }
  else if (err.code === 11000) { status = 409; message = `${Object.keys(err.keyValue)[0]} already exists`; }
  else if (DB_DOWN.includes(err.name)) { console.error(err); status = 503; message = 'Database is temporarily unavailable'; }
  if (status === 500) { console.error(err); message = 'Internal server error'; } // never leak internals
  res.status(status).json({ message });
};
