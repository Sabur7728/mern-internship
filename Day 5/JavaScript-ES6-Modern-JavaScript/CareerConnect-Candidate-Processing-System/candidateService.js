// CareerConnect Candidate Service

const candidates = [
    {
        id: 1,
        name: "Amit Sharma",
        email: "amit@example.com",
        position: "MERN Developer",
        experience: 2,
        skills: ["JavaScript", "React", "Node.js"],
        location: "Bangalore",
        status: "Shortlisted"
    },
    {
        id: 2,
        name: "Priya Singh",
        email: "priya@example.com",
        position: "Data Analyst",
        experience: 3,
        skills: ["Excel", "SQL", "Python"],
        location: "Pune",
        status: "Applied"
    },
    {
        id: 3,
        name: "Rahul Kumar",
        email: "rahul@example.com",
        position: "Backend Developer",
        experience: 4,
        skills: ["Node.js", "Express", "MongoDB"],
        location: "Hyderabad",
        status: "Shortlisted"
    },
    {
        id: 4,
        name: "Neha Verma",
        email: "neha@example.com",
        position: "Frontend Developer",
        experience: 5,
        skills: ["HTML", "CSS", "JavaScript", "React"],
        location: "Mumbai",
        status: "Rejected"
    },
    {
        id: 5,
        name: "Vikash Singh",
        email: "vikash@example.com",
        position: "React Developer",
        experience: 2,
        skills: ["JavaScript", "React"],
        location: "Delhi",
        status: "Applied"
    },
    {
        id: 6,
        name: "Sneha Patil",
        email: "sneha@example.com",
        position: "MERN Developer",
        experience: 4,
        skills: ["JavaScript", "React", "Node.js", "MongoDB"],
        location: "Pune",
        status: "Shortlisted"
    },
    {
        id: 7,
        name: "Arjun Mehta",
        email: "arjun@example.com",
        position: "DevOps Engineer",
        experience: 6,
        skills: ["AWS", "Docker", "Linux"],
        location: "Bangalore",
        status: "Applied"
    },
    {
        id: 8,
        name: "Kavya Reddy",
        email: "kavya@example.com",
        position: "Backend Developer",
        experience: 3,
        skills: ["Node.js", "Express", "MongoDB"],
        location: "Hyderabad",
        status: "Rejected"
    },
    {
        id: 9,
        name: "Rohit Joshi",
        email: "rohit@example.com",
        position: "Frontend Developer",
        experience: 1,
        skills: ["HTML", "CSS", "JavaScript"],
        location: "Mumbai",
        status: "Applied"
    },
    {
        id: 10,
        name: "Anjali Deshmukh",
        email: "anjali@example.com",
        position: "Full Stack Developer",
        experience: 5,
        skills: ["JavaScript", "React", "Node.js", "MongoDB"],
        location: "Pune",
        status: "Shortlisted"
    }
];


// Get all candidates

const getCandidates = () => {
    return new Promise((resolve) => {

        setTimeout(() => {
            resolve(candidates);
        }, 1500);

    });
};


// Get candidate by ID

const getCandidateById = id => {
    return new Promise((resolve, reject) => {

        setTimeout(() => {

            const candidate = candidates.find(
                candidate => candidate.id === id
            );

            if (candidate) {
                resolve(candidate);
            } else {
                reject(new Error("Candidate not found"));
            }

        }, 1000);

    });
};


// Export service functions

module.exports = {
    getCandidates,
    getCandidateById
};