db = db.getSiblingDB("careerconnect")

db.dropDatabase()   // sirf development me! Fresh start ke liye

db.createCollection("users")
db.createCollection("companies")
db.createCollection("jobs")
db.createCollection("candidates")
db.createCollection("applications")

db.candidates.createIndex({ email: 1 }, { unique: true })
db.jobs.createIndex({ location: 1 })
db.applications.createIndex({ candidateId: 1 })
db.users.createIndex({ email: 1 }, { unique: true })

printjson(db.getCollectionNames())

// Unique email: no two candidates can share an email
db.candidates.createIndex({ email: 1 }, { unique: true })

// Jobs are often searched by location
db.jobs.createIndex({ location: 1 })

// "Show all applications by this candidate" is a common lookup
db.applications.createIndex({ candidateId: 1 })

db.candidates.getIndexes()