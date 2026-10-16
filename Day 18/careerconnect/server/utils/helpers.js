export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const httpError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

// Copy only whitelisted fields (prevents mass assignment)
export const pick = (obj, fields) =>
  fields.reduce((acc, f) => {
    if (obj[f] !== undefined) acc[f] = obj[f];
    return acc;
  }, {});