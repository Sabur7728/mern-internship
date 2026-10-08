db = db.getSiblingDB("careerconnect")

// 1. How many open jobs?
db.jobs.countDocuments({ status: "Open" })

// 2. How many candidates in Interview?
db.candidates.countDocuments({ status: "Interview" })

// 3. Jobs in Bangalore
db.jobs.find({ location: "Bangalore" })

// 4. Jobs requiring React
db.jobs.find({ skills: "React" })

// 5. Candidates with more than 3 years of experience
db.candidates.find({ experience: { $gt: 3 } })

// 6. Candidates who know both React and Node.js
db.candidates.find({ skills: { $all: ["React", "Node.js"] } })

// 7. Shortlisted candidates
db.candidates.find({ status: "Shortlisted" })

// 8. Full-time jobs
db.jobs.find({ employmentType: "Full-time" })

// 9. Candidates in Delhi or Bangalore
db.candidates.find({ location: { $in: ["Delhi", "Bangalore"] } })

// 10. Five most experienced candidates
db.candidates.find().sort({ experience: -1 }).limit(5)

// 11. Applications for one particular job
const someJob = db.jobs.findOne({ title: "MERN Stack Developer" })
db.applications.countDocuments({ jobId: someJob._id })

// 12. Applications created after a date
db.applications.find({ appliedAt: { $gt: new Date("2026-09-15") } })