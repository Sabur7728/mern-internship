// CareerConnect Candidate Processing System
// Day 5 - JavaScript ES6+ Mini Project


// ==========================================
// CANDIDATE DATA
// ==========================================

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


// ==========================================
// 1. DISPLAY ALL CANDIDATES
// ==========================================

const displayCandidates = (candidateList = candidates) => {
    console.log("\n========== ALL CANDIDATES ==========");

    candidateList.forEach(({ id, name, position, location, status }) => {
        console.log(
            `${id}. ${name} | ${position} | ${location} | ${status}`
        );
    });
};


// ==========================================
// 2. SHORTLISTED CANDIDATES
// ==========================================

const getShortlistedCandidates = candidateList => {
    return candidateList.filter(
        ({ status }) => status === "Shortlisted"
    );
};


// ==========================================
// 3. REJECTED CANDIDATES
// ==========================================

const getRejectedCandidates = candidateList => {
    return candidateList.filter(
        ({ status }) => status === "Rejected"
    );
};


// ==========================================
// 4. SEARCH CANDIDATE BY ID
// ==========================================

const findCandidateById = (candidateList, id) => {
    return candidateList.find(candidate => candidate.id === id);
};


// ==========================================
// 5. SEARCH BY POSITION
// ==========================================

const searchByPosition = (candidateList, position) => {
    return candidateList.filter(
        candidate =>
            candidate.position.toLowerCase() === position.toLowerCase()
    );
};


// ==========================================
// 6. FILTER BY LOCATION
// ==========================================

const filterByLocation = (candidateList, location) => {
    return candidateList.filter(
        candidate =>
            candidate.location.toLowerCase() === location.toLowerCase()
    );
};


// ==========================================
// 7. FILTER BY EXPERIENCE
// ==========================================

const filterByExperience = (
    candidateList,
    minimumExperience = 0
) => {
    return candidateList.filter(
        candidate => candidate.experience >= minimumExperience
    );
};


// ==========================================
// 8. DISPLAY CANDIDATE NAMES
// ==========================================

const getCandidateNames = candidateList => {
    return candidateList.map(({ name }) => name);
};


// ==========================================
// 9. GET UNIQUE SKILLS
// ==========================================

const getUniqueSkills = candidateList => {

    const allSkills = candidateList.flatMap(
        ({ skills = [] }) => skills
    );

    return [...new Set(allSkills)];
};


// ==========================================
// 10. COUNT CANDIDATES BY STATUS
// ==========================================

const countByStatus = candidateList => {

    return candidateList.reduce((result, candidate) => {

        const { status } = candidate;

        result[status] = (result[status] ?? 0) + 1;

        return result;

    }, {});
};


// ==========================================
// 11. CALCULATE AVERAGE EXPERIENCE
// ==========================================

const calculateAverageExperience = candidateList => {

    if (candidateList.length === 0) {
        return 0;
    }

    const totalExperience = candidateList.reduce(
        (total, { experience }) => total + experience,
        0
    );

    return totalExperience / candidateList.length;
};


// ==========================================
// 12. CANDIDATE SUMMARY
// ==========================================

const createCandidateSummary = ({
    name,
    position,
    location,
    experience,
    status
}) => {

    return `${name} is a ${position} with ${experience} years of experience from ${location}. Application status: ${status}.`;
};


// ==========================================
// 13. REST PARAMETERS
// ==========================================

const combineSkills = (...skillGroups) => {

    return [
        ...new Set(
            skillGroups.flat()
        )
    ];
};


// ==========================================
// 14. OPTIONAL CHAINING
// ==========================================

const getCandidatePhone = candidate => {

    return candidate?.contact?.phone ?? "Phone number not available";
};


// ==========================================
// 15. SOME()
// ==========================================

const hasExperiencedCandidate = (
    candidateList,
    experience = 5
) => {

    return candidateList.some(
        candidate => candidate.experience >= experience
    );
};


// ==========================================
// 16. EVERY()
// ==========================================

const allCandidatesHaveSkills = candidateList => {

    return candidateList.every(
        candidate => candidate.skills?.length > 0
    );
};


// ==========================================
// 17. OBJECT.ENTRIES()
// ==========================================

const displayStatusReport = candidateList => {

    const statusCount = countByStatus(candidateList);

    console.log("\n========== STATUS REPORT ==========");

    Object.entries(statusCount).forEach(
        ([status, count]) => {
            console.log(`${status}: ${count}`);
        }
    );
};


// ==========================================
// PROGRAM OUTPUT
// ==========================================

console.log("\n");
console.log("==============================================");
console.log("   CAREERCONNECT CANDIDATE PROCESSING SYSTEM");
console.log("==============================================");


// All candidates

displayCandidates();


// Shortlisted

console.log("\n========== SHORTLISTED CANDIDATES ==========");

const shortlisted = getShortlistedCandidates(candidates);

shortlisted.forEach(({ name, position }) => {
    console.log(`${name} - ${position}`);
});


// Rejected

console.log("\n========== REJECTED CANDIDATES ==========");

const rejected = getRejectedCandidates(candidates);

rejected.forEach(({ name, position }) => {
    console.log(`${name} - ${position}`);
});


// Search by ID

console.log("\n========== SEARCH BY ID ==========");

const candidate = findCandidateById(candidates, 3);

console.log(candidate);


// Search by position

console.log("\n========== MERN DEVELOPERS ==========");

const mernDevelopers = searchByPosition(
    candidates,
    "MERN Developer"
);

console.log(mernDevelopers);


// Filter by location

console.log("\n========== PUNE CANDIDATES ==========");

const puneCandidates = filterByLocation(
    candidates,
    "Pune"
);

puneCandidates.forEach(({ name, position }) => {
    console.log(`${name} - ${position}`);
});


// Filter by experience

console.log("\n========== 4+ YEARS EXPERIENCE ==========");

const experiencedCandidates = filterByExperience(
    candidates,
    4
);

experiencedCandidates.forEach(
    ({ name, experience }) => {
        console.log(`${name} - ${experience} years`);
    }
);


// Candidate names

console.log("\n========== ALL CANDIDATE NAMES ==========");

console.log(getCandidateNames(candidates));


// Unique skills

console.log("\n========== UNIQUE SKILLS ==========");

console.log(getUniqueSkills(candidates));


// Status report

displayStatusReport(candidates);


// Average experience

console.log("\n========== AVERAGE EXPERIENCE ==========");

const averageExperience = calculateAverageExperience(
    candidates
);

console.log(
    `${averageExperience.toFixed(2)} years`
);


// Candidate summary

console.log("\n========== CANDIDATE SUMMARY ==========");

console.log(
    createCandidateSummary(candidates[0])
);


// Rest parameter

console.log("\n========== COMBINED SKILLS ==========");

console.log(
    combineSkills(
        ["JavaScript", "React"],
        ["Node.js", "MongoDB"],
        ["Express", "AWS"]
    )
);


// Optional chaining

console.log("\n========== OPTIONAL CHAINING ==========");

console.log(
    getCandidatePhone(candidates[0])
);


// Some

console.log("\n========== SOME() CHECK ==========");

console.log(
    "Has candidate with 5+ years experience:",
    hasExperiencedCandidate(candidates, 5)
);


// Every

console.log("\n========== EVERY() CHECK ==========");

console.log(
    "All candidates have skills:",
    allCandidatesHaveSkills(candidates)
);