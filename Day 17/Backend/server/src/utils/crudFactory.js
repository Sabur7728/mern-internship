const buildQuery = require("./queryBuilder");

const httpError = (status, message) => Object.assign(new Error(message), { statusCode: status });
const pick = (obj, keys) =>
  keys.reduce((acc, k) => (obj[k] !== undefined ? { ...acc, [k]: obj[k] } : acc), {});

// Skills may arrive as "React, Node" from a form
const normalize = (body) => {
  if (typeof body.skills === "string") {
    body.skills = body.skills.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return body;
};

module.exports = (Model, opts) => {
  const {
    allowedFields,
    searchFields,
    filterFields,
    sortable,
    populate = "",
    ownerField = "createdBy",
  } = opts;

  // Admin always allowed; others only if they own the doc
  const canModify = (doc, user) =>
    user.role === "admin" || String(doc[ownerField]) === String(user._id);

  return {
    list: async (req, res, next) => {
      try {
        const { filter, sort, page, limit, skip } = buildQuery(req.query, {
          searchFields, filterFields, sortable,
        });
        const [data, total] = await Promise.all([
          Model.find(filter).sort(sort).skip(skip).limit(limit).populate(populate),
          Model.countDocuments(filter),
        ]);
        res.json({
          success: true,
          data,
          pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
        });
      } catch (e) { next(e); }
    },

    getOne: async (req, res, next) => {
      try {
        const doc = await Model.findById(req.params.id).populate(populate);
        if (!doc) throw httpError(404, "Resource not found");
        res.json({ success: true, data: doc });
      } catch (e) { next(e); }
    },

    create: async (req, res, next) => {
      try {
        const body = pick(normalize(req.body), allowedFields);
        body[ownerField] = req.user._id; // set by server, never by client
        const doc = await Model.create(body);
        res.status(201).json({ success: true, data: doc });
      } catch (e) { next(e); }
    },

    update: async (req, res, next) => {
      try {
        const doc = await Model.findById(req.params.id);
        if (!doc) throw httpError(404, "Resource not found");
        if (!canModify(doc, req.user)) throw httpError(403, "You do not have permission to edit this resource");

        doc.set(pick(normalize(req.body), allowedFields));
        await doc.save(); // runs validators + updates updatedAt
        res.json({ success: true, data: doc });
      } catch (e) { next(e); }
    },

    remove: async (req, res, next) => {
      try {
        const doc = await Model.findById(req.params.id);
        if (!doc) throw httpError(404, "Resource not found");
        if (!canModify(doc, req.user)) throw httpError(403, "You do not have permission to delete this resource");

        await doc.deleteOne();
        res.json({ success: true, message: "Deleted successfully", id: req.params.id });
      } catch (e) { next(e); }
    },
  };
};