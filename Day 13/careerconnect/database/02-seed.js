db = db.getSiblingDB("careerconnect")

db.companies.insertMany([
  { name: "CareerConnect Technologies", industry: "Technology", location: "Bangalore", website: "https://careerconnect.example.com", companySize: "201-500", description: "Technology and recruitment solutions company." },
  { name: "TechNova",  industry: "Software",  location: "Delhi",     website: "https://technova.example.com",  companySize: "51-200",  description: "Product engineering company." },
  { name: "DataWorks", industry: "Analytics", location: "Pune",      website: "https://dataworks.example.com", companySize: "201-500", description: "Data and analytics services." },
  { name: "CloudSpire", industry: "Cloud",    location: "Hyderabad", website: "https://cloudspire.example.com", companySize: "501-1000", description: "Cloud infrastructure provider." },
  { name: "FinEdge",   industry: "Fintech",   location: "Mumbai",    website: "https://finedge.example.com",   companySize: "51-200",  description: "Digital payments platform." }
])

db.companies.find({}, { name: 1 })

const companyId = (name) => db.companies.findOne({ name: name })._id

// [title, company, location, type, expMin, expMax, salaryMin, salaryMax, skills, status]
const jobRows = [
  ["MERN Stack Developer",  "CareerConnect Technologies", "Bangalore", "Full-time", 2, 4, 600000, 1000000, ["React", "Node.js", "MongoDB", "Express.js"], "Open"],
  ["Frontend Developer",    "CareerConnect Technologies", "Bangalore", "Full-time", 1, 3, 450000,  800000, ["React", "JavaScript", "CSS"],               "Open"],
  ["Backend Developer",     "CareerConnect Technologies", "Bangalore", "Contract",  3, 6, 900000, 1500000, ["Node.js", "Express.js", "MongoDB"],        "Open"],

  ["React Developer",       "TechNova", "Delhi",  "Full-time", 2, 5, 700000, 1200000, ["React", "Redux", "JavaScript"],      "Open"],
  ["Full Stack Engineer",   "TechNova", "Delhi",  "Full-time", 3, 6, 1000000, 1800000, ["React", "Node.js", "SQL"],          "Open"],
  ["UI Developer",          "TechNova", "Delhi",  "Part-time", 0, 2, 300000,  500000, ["HTML", "CSS", "JavaScript"],         "Closed"],

  ["Node.js Developer",     "DataWorks", "Pune",  "Full-time", 2, 4, 650000, 1100000, ["Node.js", "MongoDB", "REST APIs"],   "Open"],
  ["Data Engineer",         "DataWorks", "Pune",  "Full-time", 3, 7, 1200000, 2000000, ["Python", "SQL", "Spark"],           "Open"],
  ["MongoDB DBA",           "DataWorks", "Pune",  "Contract",  4, 8, 1100000, 1900000, ["MongoDB", "Indexing", "Linux"],     "Open"],

  ["DevOps Engineer",       "CloudSpire", "Hyderabad", "Full-time", 3, 6, 1000000, 1700000, ["Docker", "AWS", "CI/CD"],         "Open"],
  ["Cloud Architect",       "CloudSpire", "Hyderabad", "Full-time", 7, 12, 2500000, 4000000, ["AWS", "Kubernetes", "Terraform"], "Open"],
  ["React Native Developer","CloudSpire", "Hyderabad", "Full-time", 2, 4, 700000, 1200000, ["React Native", "React", "JavaScript"], "Closed"],

  ["Payments Backend Dev",  "FinEdge", "Mumbai", "Full-time", 3, 5, 1200000, 2000000, ["Node.js", "MongoDB", "Security"],   "Open"],
  ["React Frontend Lead",   "FinEdge", "Mumbai", "Full-time", 5, 8, 1800000, 2800000, ["React", "TypeScript", "Leadership"], "Open"],
  ["QA Automation Engineer","FinEdge", "Mumbai", "Internship", 0, 1, 200000,  350000, ["Selenium", "JavaScript"],          "Open"]
]

const jobDocs = jobRows.map(([title, company, location, employmentType, experienceMin, experienceMax, salaryMin, salaryMax, skills, status]) => ({
  title,
  companyId: companyId(company),
  location,
  employmentType,
  experienceMin,
  experienceMax,
  salaryMin,
  salaryMax,
  skills,
  status,
  applicationCount: 0,
  createdAt: new Date()
}))

db.jobs.insertMany(jobDocs)
db.jobs.countDocuments()   // expect 15

db.users.insertMany([
  { name: "Anita Verma",  email: "anita@careerconnect.example.com", passwordHash: "REPLACE_WITH_BCRYPT_HASH", role: "recruiter", companyId: companyId("CareerConnect Technologies"), createdAt: new Date() },
  { name: "Vikram Rao",   email: "vikram@technova.example.com",     passwordHash: "REPLACE_WITH_BCRYPT_HASH", role: "recruiter", companyId: companyId("TechNova"),                   createdAt: new Date() },
  { name: "Admin User",   email: "admin@careerconnect.example.com", passwordHash: "REPLACE_WITH_BCRYPT_HASH", role: "admin",     createdAt: new Date() }
])
db.users.createIndex({ email: 1 }, { unique: true })

// [name, location, experience, currentPosition, skills, status]
const candidateRows = [
  // Applied
  ["Rahul Sharma",   "Bangalore", 3, "Frontend Developer",   ["React", "JavaScript", "Node.js"],      "Applied"],
  ["Priya Singh",    "Delhi",     2, "Junior Developer",     ["React", "JavaScript"],                 "Applied"],
  ["Amit Patel",     "Pune",      4, "Backend Developer",    ["Node.js", "MongoDB", "Express.js"],    "Applied"],
  ["Sneha Reddy",    "Hyderabad", 1, "Web Developer",        ["HTML", "CSS", "JavaScript"],           "Applied"],
  ["Karan Mehta",    "Mumbai",    5, "Full Stack Developer", ["React", "Node.js", "SQL"],             "Applied"],

  // Shortlisted
  ["Neha Gupta",     "Bangalore", 4, "React Developer",      ["React", "Redux", "TypeScript"],        "Shortlisted"],
  ["Rohit Verma",    "Delhi",     3, "Node.js Developer",    ["Node.js", "MongoDB", "REST APIs"],     "Shortlisted"],
  ["Anjali Nair",    "Pune",      6, "Data Engineer",        ["Python", "SQL", "Spark"],              "Shortlisted"],
  ["Vishal Joshi",   "Hyderabad", 5, "DevOps Engineer",      ["Docker", "AWS", "CI/CD"],              "Shortlisted"],
  ["Pooja Kulkarni", "Mumbai",    2, "UI Developer",         ["React", "CSS", "JavaScript"],          "Shortlisted"],

  // Interview
  ["Arjun Menon",    "Bangalore", 5, "MERN Developer",       ["React", "Node.js", "MongoDB", "Express.js"], "Interview"],
  ["Divya Iyer",     "Delhi",     4, "Full Stack Engineer",  ["React", "Node.js", "SQL"],             "Interview"],
  ["Sahil Khan",     "Pune",      3, "Backend Developer",    ["Node.js", "MongoDB"],                  "Interview"],
  ["Meera Das",      "Hyderabad", 7, "Cloud Engineer",       ["AWS", "Kubernetes", "Terraform"],      "Interview"],
  ["Nikhil Jain",    "Mumbai",    6, "Frontend Lead",        ["React", "TypeScript", "Leadership"],   "Interview"],

  // Rejected
  ["Tanya Bose",     "Bangalore", 1, "Intern",               ["HTML", "CSS"],                         "Rejected"],
  ["Manish Tiwari",  "Delhi",     2, "Web Developer",        ["JavaScript", "jQuery"],                "Rejected"],
  ["Ritu Saxena",    "Pune",      3, "QA Engineer",          ["Selenium", "JavaScript"],              "Rejected"],
  ["Deepak Yadav",   "Hyderabad", 4, "Support Engineer",     ["Linux", "SQL"],                        "Rejected"],
  ["Swati Pandey",   "Mumbai",    2, "Junior Developer",     ["React", "JavaScript"],                 "Rejected"],

  // Hired
  ["Aditya Rao",     "Bangalore", 4, "MERN Developer",       ["React", "Node.js", "MongoDB"],         "Hired"],
  ["Kavya Pillai",   "Delhi",     3, "React Developer",      ["React", "Redux", "JavaScript"],        "Hired"],
  ["Harsh Vora",     "Pune",      5, "Database Admin",       ["MongoDB", "Indexing", "Linux"],        "Hired"],
  ["Isha Malhotra",  "Hyderabad", 6, "DevOps Engineer",      ["Docker", "AWS", "CI/CD"],              "Hired"],
  ["Rajat Bhatia",   "Mumbai",    7, "Backend Architect",    ["Node.js", "MongoDB", "Security"],      "Hired"]
]

const candidateDocs = candidateRows.map(([name, location, experience, currentPosition, skills, status], i) => ({
  name,
  email: name.toLowerCase().replace(" ", ".") + "@example.com",
  phone: String(9876500000 + i),
  location,
  experience,                                   // number, not string
  currentPosition,
  skills,
  status,
  contact: { preferredMethod: "email" },        // example of a nested object
  appliedAt: new Date(Date.UTC(2026, 8, 1 + i)) // 1 Sep 2026 onwards
}))

db.candidates.insertMany(candidateDocs)
db.candidates.countDocuments()   // expect 25

const allCandidates = db.candidates.find().toArray()
const allJobs       = db.jobs.find().toArray()

const applicationDocs = []

for (let i = 0; i < 30; i++) {
  const candidate = allCandidates[i % 25]
  const job       = allJobs[(i * 2 + Math.floor(i / 15)) % 15]

  applicationDocs.push({
    candidateId: candidate._id,
    jobId: job._id,
    status: candidate.status,
    trackingCounter: 0,
    appliedAt: new Date(Date.UTC(2026, 8, 1 + i))
  })
}

db.applications.insertMany(applicationDocs)
db.applications.countDocuments()   // expect 30