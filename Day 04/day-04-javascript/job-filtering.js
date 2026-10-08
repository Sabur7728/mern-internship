const jobs = [
    {
        title: "MERN Stack Developer",
        company: "Tech Solutions",
        location: "Pune",
        experience: 2,
        workMode: "Hybrid",
        salary: 600000
    },
    {
        title: "Frontend Developer",
        company: "Digital Labs",
        location: "Mumbai",
        experience: 1,
        workMode: "Remote",
        salary: 500000
    },
    {
        title: "Backend Developer",
        company: "Software Hub",
        location: "Bangalore",
        experience: 3,
        workMode: "Office",
        salary: 750000
    },
    {
        title: "Node.js Developer",
        company: "Cloud Tech",
        location: "Hyderabad",
        experience: 1,
        workMode: "Remote",
        salary: 550000
    },
    {
        title: "JavaScript Developer",
        company: "WebWorks",
        location: "Pune",
        experience: 2,
        workMode: "Office",
        salary: 650000
    },
    {
        title: "Full Stack Developer",
        company: "Innovate Labs",
        location: "Mumbai",
        experience: 4,
        workMode: "Hybrid",
        salary: 900000
    },
    {
        title: "Junior Web Developer",
        company: "CodeCraft",
        location: "Nagpur",
        experience: 0,
        workMode: "Remote",
        salary: 400000
    },
    {
        title: "MongoDB Developer",
        company: "Data Systems",
        location: "Delhi",
        experience: 2,
        workMode: "Hybrid",
        salary: 700000
    },
    {
        title: "React Developer",
        company: "AppTech",
        location: "Bangalore",
        experience: 1,
        workMode: "Remote",
        salary: 600000
    },
    {
        title: "Software Developer",
        company: "NextGen Solutions",
        location: "Chennai",
        experience: 3,
        workMode: "Office",
        salary: 800000
    }
];


// 1. Find Remote Jobs
const remoteJobs = jobs.filter((job) => {
    return job.workMode === "Remote";
});

console.log("Remote Jobs:");
console.log(remoteJobs);


// 2. Find Jobs Requiring Less Than 2 Years Experience
const juniorJobs = jobs.filter((job) => {
    return job.experience < 2;
});

console.log("Jobs requiring less than 2 years experience:");
console.log(juniorJobs);


// 3. Find Jobs With Salary Above 6 Lakh
const highSalaryJobs = jobs.filter((job) => {
    return job.salary > 600000;
});

console.log("Jobs with salary above ₹6 Lakh:");
console.log(highSalaryJobs);


// 4. Find One Specific Job
const specificJob = jobs.find((job) => {
    return job.title === "Node.js Developer";
});

console.log("Specific Job:");
console.log(specificJob);