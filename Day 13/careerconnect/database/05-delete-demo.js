db = db.getSiblingDB("careerconnect")

// Insert clearly labelled test data
db.candidates.insertMany([
  { name: "TEST One",   email: "test1@test.local", experience: 0, skills: ["Test"], status: "Test" },
  { name: "TEST Two",   email: "test2@test.local", experience: 0, skills: ["Test"], status: "Test" },
  { name: "TEST Three", email: "test3@test.local", experience: 0, skills: ["Test"], status: "Test" }
])

// deleteOne: check first, then delete
db.candidates.find({ email: "test1@test.local" })
db.candidates.deleteOne({ email: "test1@test.local" })

// deleteMany: run find() with the SAME filter first
db.candidates.find({ status: "Test" })          // confirm only the TEST records match
db.candidates.deleteMany({ status: "Test" })

// Verify real data is intact
db.candidates.countDocuments()                 // still 25