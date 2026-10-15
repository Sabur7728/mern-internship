module.exports = (query, { searchFields = [], filterFields = [], sortable = ["createdAt"] }) => {
  const filter = {};

  // Search
  if (query.search) {
    const regex = new RegExp(query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = searchFields.map((f) => ({ [f]: regex }));
  }

  // Exact-match filters
  filterFields.forEach((f) => {
    if (query[f]) filter[f] = query[f];
  });

  // Experience range (works together with the other filters)
  if (query.minExperience || query.maxExperience) {
    filter.experience = {};
    if (query.minExperience) filter.experience.$gte = Number(query.minExperience);
    if (query.maxExperience) filter.experience.$lte = Number(query.maxExperience);
  }

  // Sorting (whitelisted fields only)
  const sortField = sortable.includes(query.sort) ? query.sort : "createdAt";
  const sort = { [sortField]: query.order === "asc" ? 1 : -1 };

  // Pagination
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit) || 10, 1), 100);

  return { filter, sort, page, limit, skip: (page - 1) * limit };
};