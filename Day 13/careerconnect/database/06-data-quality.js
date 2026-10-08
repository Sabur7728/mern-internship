db = db.getSiblingDB("careerconnect")

// Missing or empty candidate emails
db.candidates.find({ $or: [{ email: { $exists: false } }, { email: "" }] })

// Duplicate emails
db.candidates.aggregate([
  { $group: { _id: "$email", count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } }
])

// Invalid candidate statuses
db.candidates.find({ status: { $nin: ["Applied", "Shortlisted", "Interview", "Rejected", "Hired"] } })

// Missing job titles
db.jobs.find({ $or: [{ title: { $exists: false } }, { title: "" }] })

// Jobs without a company, or pointing to a company that doesn't exist
db.jobs.find({ companyId: { $exists: false } })
db.jobs.aggregate([
  { $lookup: { from: "companies", localField: "companyId", foreignField: "_id", as: "company" } },
  { $match: { company: { $size: 0 } } }
])

// Applications referencing invalid candidates or jobs
db.applications.aggregate([
  { $lookup: { from: "candidates", localField: "candidateId", foreignField: "_id", as: "c" } },
  { $lookup: { from: "jobs",       localField: "jobId",       foreignField: "_id", as: "j" } },
  { $match: { $or: [{ c: { $size: 0 } }, { j: { $size: 0 } }] } }
])

// Invalid experience (not a number, or negative)
db.candidates.find({ $or: [{ experience: { $not: { $type: "number" } } }, { experience: { $lt: 0 } }] })

// Empty skill arrays
db.candidates.find({ skills: { $size: 0 } })