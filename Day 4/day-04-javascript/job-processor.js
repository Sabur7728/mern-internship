const jobs = [
    {
        id: 1,
        title: "MERN Stack Developer",
        company: "Tech Solutions",
        location: "Bangalore",
        mode: "Hybrid",
        experience: 2,
        salary: 600000,
        skills: ["JavaScript", "React", "Node.js"],
        status: "open"
    },
    {
        id: 2,
        title: "Frontend Developer",
        company: "Digital Labs",
        location: "Mumbai",
        mode: "Remote",
        experience: 1,
        salary: 500000,
        skills: ["HTML", "CSS", "JavaScript", "React"],
        status: "open"
    },
    {
        id: 3,
        title: "Backend Developer",
        company: "Software Hub",
        location: "Pune",
        mode: "Office",
        experience: 3,
        salary: 750000,
        skills: ["Node.js", "Express.js", "MongoDB"],
        status: "open"
    },
    {
        id: 4,
        title: "JavaScript Developer",
        company: "WebWorks",
        location: "Hyderabad",
        mode: "Remote",
        experience: 2,
        salary: 650000,
        skills: ["JavaScript", "Node.js", "Express.js"],
        status: "closed"
    },
    {
        id: 5,
        title: "React Developer",
        company: "AppTech",
        location: "Bangalore",
        mode: "Hybrid",
        experience: 2,
        salary: 700000,
        skills: ["JavaScript", "React", "Redux"],
        status: "open"
    },
    {
        id: 6,
        title: "Node.js Developer",
        company: "Cloud Systems",
        location: "Pune",
        mode: "Remote",
        experience: 1,
        salary: 550000,
        skills: ["JavaScript", "Node.js", "MongoDB"],
        status: "open"
    },
    {
        id: 7,
        title: "Full Stack Developer",
        company: "Innovate Labs",
        location: "Delhi",
        mode: "Office",
        experience: 4,
        salary: 900000,
        skills: ["JavaScript", "React", "Node.js", "MongoDB"],
        status: "open"
    },
    {
        id: 8,
        title: "Junior Web Developer",
        company: "CodeCraft",
        location: "Nagpur",
        mode: "Remote",
        experience: 0,
        salary: 400000,
        skills: ["HTML", "CSS", "JavaScript"],
        status: "open"
    },
    {
        id: 9,
        title: "MongoDB Developer",
        company: "Data Systems",
        location: "Chennai",
        mode: "Hybrid",
        experience: 3,
        salary: 700000,
        skills: ["MongoDB", "Node.js", "JavaScript"],
        status: "closed"
    },
    {
        id: 10,
        title: "Software Developer",
        company: "NextGen Solutions",
        location: "Mumbai",
        mode: "Office",
        experience: 3,
        salary: 800000,
        skills: ["JavaScript", "Python", "SQL"],
        status: "open"
    },
    {
        id: 11,
        title: "Express.js Developer",
        company: "Backend Labs",
        location: "Hyderabad",
        mode: "Remote",
        experience: 2,
        salary: 620000,
        skills: ["Node.js", "Express.js", "MongoDB"],
        status: "open"
    },
    {
        id: 12,
        title: "Web Designer",
        company: "Creative Studio",
        location: "Pune",
        mode: "Hybrid",
        experience: 1,
        salary: 450000,
        skills: ["HTML", "CSS", "JavaScript"],
        status: "closed"
    },
    {
        id: 13,
        title: "Senior MERN Developer",
        company: "TechVision",
        location: "Bangalore",
        mode: "Office",
        experience: 5,
        salary: 1200000,
        skills: ["JavaScript", "React", "Node.js", "MongoDB"],
        status: "open"
    },
    {
        id: 14,
        title: "API Developer",
        company: "CloudWorks",
        location: "Delhi",
        mode: "Remote",
        experience: 2,
        salary: 650000,
        skills: ["Node.js", "Express.js", "REST API"],
        status: "open"
    },
    {
        id: 15,
        title: "Junior JavaScript Developer",
        company: "Startup Hub",
        location: "Latur",
        mode: "Office",
        experience: 1,
        salary: 350000,
        skills: ["JavaScript", "HTML", "CSS"],
        status: "open"
    }
];

// 1. Display all open jobs

const openJobs = jobs.filter((job) => {
    return job.status === "open";
});

console.log("===== OPEN JOBS =====");
console.log(openJobs);


// 2. Find a job using its ID

const jobById = jobs.find((job) => {
    return job.id === 7;
});

console.log("===== JOB WITH ID 7 =====");
console.log(jobById);


// 3. Filter jobs by location

const puneJobs = jobs.filter((job) => {
    return job.location === "Pune";
});

console.log("===== PUNE JOBS =====");
console.log(puneJobs);


// 4. Filter remote jobs

const remoteJobs = jobs.filter((job) => {
    return job.mode === "Remote";
});

console.log("===== REMOTE JOBS =====");
console.log(remoteJobs);


// 5. Filter jobs based on minimum experience

const minimumExperience = 2;

const experiencedJobs = jobs.filter((job) => {
    return job.experience >= minimumExperience;
});

console.log("===== JOBS REQUIRING 2+ YEARS EXPERIENCE =====");
console.log(experiencedJobs);


// 6. Filter jobs above a specified salary

const minimumSalary = 600000;

const highSalaryJobs = jobs.filter((job) => {
    return job.salary > minimumSalary;
});

console.log("===== JOBS ABOVE ₹6 LAKH =====");
console.log(highSalaryJobs);


// 7. Find jobs requiring JavaScript

const javascriptJobs = jobs.filter((job) => {
    return job.skills.includes("JavaScript");
});

console.log("===== JOBS REQUIRING JAVASCRIPT =====");
console.log(javascriptJobs);


// 8. Create an array containing only job titles

const jobTitles = jobs.map((job) => {
    return job.title;
});

console.log("===== JOB TITLES =====");
console.log(jobTitles);


// 9. Create an array containing only company names

const companyNames = jobs.map((job) => {
    return job.company;
});

console.log("===== COMPANY NAMES =====");
console.log(companyNames);


// 10. Display total number of jobs

const totalJobs = jobs.length;

console.log("===== TOTAL JOBS =====");
console.log(totalJobs);


// 11. Display number of open jobs

const totalOpenJobs = jobs.filter((job) => {
    return job.status === "open";
}).length;

console.log("===== TOTAL OPEN JOBS =====");
console.log(totalOpenJobs);

console.log("Total Jobs:", jobs.length);

// Dashboard Statistics

const statistics = {
    totalJobs: jobs.length,

    openJobs: jobs.filter((job) => {
        return job.status === "open";
    }).length,

    closedJobs: jobs.filter((job) => {
        return job.status === "closed";
    }).length,

    remoteJobs: jobs.filter((job) => {
        return job.mode === "Remote";
    }).length,

    hybridJobs: jobs.filter((job) => {
        return job.mode === "Hybrid";
    }).length,

    officeJobs: jobs.filter((job) => {
        return job.mode === "Office";
    }).length,

    javascriptJobs: jobs.filter((job) => {
        return job.skills.includes("JavaScript");
    }).length,

    reactJobs: jobs.filter((job) => {
        return job.skills.includes("React");
    }).length,

    nodeJsJobs: jobs.filter((job) => {
        return job.skills.includes("Node.js");
    }).length
};


// Display statistics
console.log("Job Portal Dashboard Statistics");
console.log(statistics);