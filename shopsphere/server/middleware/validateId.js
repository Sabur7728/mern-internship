const mongoose = require('mongoose');
const HttpError = require('../utils/HttpError');
// router.param('id', validateId('product')) -> 400 on malformed ObjectId before any DB call
module.exports = (label) => (req, res, next, id) =>
  mongoose.isValidObjectId(id) ? next() : next(new HttpError(400, `Invalid ${label} ID`));
