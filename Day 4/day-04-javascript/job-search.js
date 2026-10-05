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
        location: "Pune",
        mode: "Remote",
        experience: 1,
        salary: 450000,
        skills: ["HTML", "CSS", "JavaScript"],
        status: "open"
    },
    {
        id: 3,
        title: "Backend Developer",
        company: "Software Hub",
        location: "Hyderabad",
        mode: "Office",
        experience: 3,
        salary: 700000,
        skills: ["Node.js", "MongoDB", "Express"],
        status: "open"
    },
    {
        id: 4,
        title: "Full Stack Developer",
        company: "CodeWorks",
        location: "Mumbai",
        mode: "Remote",
        experience: 2,
        salary: 650000,
        skills: ["JavaScript", "Node.js", "MongoDB"],
        status: "open"
    },
    {
        id: 5,
        title: "JavaScript Developer",
        company: "WebTech",
        location: "Delhi",
        mode: "Hybrid",
        experience: 1,
        salary: 500000,
        skills: ["JavaScript", "HTML", "CSS"],
        status: "open"
    }
];


// Search jobs by title
function searchJobs(jobs, keyword) {

    return jobs.filter((job) => {
        return job.title.toLowerCase().includes(keyword.toLowerCase());
    });

}


// Search for Developer
const result = searchJobs(jobs, "developer");

console.log("Search Results:");
console.log(result);