import Candidate from "../models/Candidate.js";

// GET /api/candidates?search=&status=&experience=&page=1&limit=10
export const getCandidates = async (req, res) => {
  try {
    const { search, status, experience, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (status) filter.status = status;
    if (experience) filter.experience = { $gte: Number(experience) };

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit) || 10, 1), 50);

    const [data, total] = await Promise.all([
      Candidate.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Candidate.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/candidates/:id
export const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }
    res.json({ success: true, data: candidate });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid candidate id" });
  }
};

// POST /api/candidates
export const createCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);
    res.status(201).json({ success: true, data: candidate });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PATCH /api/candidates/:id  (sirf status badalna)
export const updateCandidate = async (req, res) => {
  try {
    const update = {};
    if (req.body.status) update.status = req.body.status;

    const candidate = await Candidate.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }
    res.json({ success: true, data: candidate });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};