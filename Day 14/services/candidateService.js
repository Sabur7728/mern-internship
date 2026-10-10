import Candidate from "../models/Candidate.js";

export const getCandidates = async (query) => {
  const {
    search,
    status,
    location,
    experienceMin,
    sortBy = "createdAt",
    order = "desc",
    page = 1,
    limit = 10
  } = query;

  const filter = {};

  if (status) filter.status = status;
  if (location) filter.location = location;
  if (experienceMin) filter.experience = { $gte: Number(experienceMin) };

  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [
      { name: regex },
      { currentPosition: regex },
      { skills: regex }
    ];
  }

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;
  const sortOrder = order === "asc" ? 1 : -1;

  const [data, total] = await Promise.all([
    Candidate.find(filter)
      .select("name email phone location experience currentPosition skills status createdAt")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limitNum),
    Candidate.countDocuments(filter)
  ]);

  return {
    data,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};