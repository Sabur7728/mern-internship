db = db.getSiblingDB("careerconnect")

// Applied -> Shortlisted
db.candidates.updateOne({ email: "rahul.sharma@example.com" }, { $set: { status: "Shortlisted" } })

// Shortlisted -> Interview
db.candidates.updateOne({ email: "neha.gupta@example.com" }, { $set: { status: "Interview" } })

// Interview -> Hired
db.candidates.updateOne({ email: "arjun.menon@example.com" }, { $set: { status: "Hired" } })

// Close one job
db.jobs.updateOne({ title: "Frontend Developer" }, { $set: { status: "Closed" } })

// Add a skill (no duplicates)
db.candidates.updateOne({ email: "rahul.sharma@example.com" }, { $addToSet: { skills: "MongoDB" } })

// Increase a tracking counter
const app = db.applications.findOne()
db.applications.updateOne({ _id: app._id }, { $inc: { trackingCounter: 1 } })

// Verify
db.candidates.find({ email: "rahul.sharma@example.com" })