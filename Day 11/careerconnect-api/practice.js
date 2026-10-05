// Application name
console.log("Application: CareerConnect");

// Node.js version
console.log("Node.js Version:", process.version);

// Current platform
console.log("Platform:", process.platform);

// Jobs array
const jobs = [
    {
        id: 1,
        title: "MERN Stack Developer",
        category: "Developer"
    },
    {
        id: 2,
        title: "Frontend Developer",
        category: "Developer"
    },
    {
        id: 3,
        title: "UI/UX Designer",
        category: "Design"
    },
    {
        id: 4,
        title: "Backend Developer",
        category: "Developer"
    },
    {
        id: 5,
        title: "HR Manager",
        category: "HR"
    }
];

// map() - display job titles
const jobTitles = jobs.map((job) => job.title);

console.log("Job Titles:");
console.log(jobTitles);

// filter() - display developer jobs
const developerJobs = jobs.filter(
    (job) => job.category === "Developer"
);

console.log("Developer Jobs:");
console.log(developerJobs);

// Function to return number of jobs
function getJobCount() {
    return jobs.length;
}

console.log("Total Jobs:", getJobCount());