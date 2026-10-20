module.exports = (err, req, res, next) => { // eslint-disable-line
  let status = err.status || 500, message = err.message || 'Server error';
  if (err.name === 'CastError') { status = 400; message = `Invalid ${err.path}`; }
  else if (err.name === 'ValidationError') { status = 422; message = Object.values(err.errors).map((e) => e.message).join(', '); }
  else if (err.code === 11000) { status = 409; message = `${Object.keys(err.keyValue || {})[0] || 'Value'} already exists`; }
  if (status === 500) console.error(err);
  res.status(status).json({ success: false, message });
};
