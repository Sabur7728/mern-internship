// Day 5 - Candidate Data Transformation

const candidates = [
    {
        id: 1,
        name: "Amit Sharma",
        email: "amit@example.com",
        position: "Frontend Developer",
        experience: 2,
        skills: ["HTML", "CSS", "JavaScript"],
        status: "Shortlisted"
    },
    {
        id: 2,
        name: "Priya Singh",
        email: "priya@example.com",
        position: "Data Analyst",
        experience: 3,
        skills: ["Excel", "SQL", "Python"],
        status: "Applied"
    },
    {
        id: 3,
        name: "Rahul Kumar",
        email: "rahul@example.com",
        position: "MERN Developer",
        experience: 4,
        skills: ["JavaScript", "React", "Node.js", "MongoDB"],
        status: "Shortlisted"
    },
    {
        id: 4,
        name: "Neha Verma",
        email: "neha@example.com",
        position: "Backend Developer",
        experience: 5,
        skills: ["Node.js", "Express", "MongoDB"],
        status: "Rejected"
    },
    {
        id: 5,
        name: "Vikash Singh",
        email: "vikash@example.com",
        position: "React Developer",
        experience: 2,
        skills: ["JavaScript", "React"],
        status: "Applied"
    }
];


// 1. Array containing only candidate names

const candidateNames = candidates.map(candidate => candidate.name);

console.log("Candidate Names:");
console.log(candidateNames);


// 2. Array containing only candidate email addresses

const candidateEmails = candidates.map(candidate => candidate.email);

console.log("\nCandidate Emails:");
console.log(candidateEmails);


// 3. Filter all shortlisted candidates

const shortlistedCandidates = candidates.filter(
    candidate => candidate.status === "Shortlisted"
);

console.log("\nShortlisted Candidates:");
console.log(shortlistedCandidates);


// 4. Filter candidates with at least 3 years of experience

const experiencedCandidates = candidates.filter(
    candidate => candidate.experience >= 3
);

console.log("\nCandidates with at least 3 years experience:");
console.log(experiencedCandidates);


// 5. Find candidate with ID 3

const candidateId3 = candidates.find(
    candidate => candidate.id === 3
);

console.log("\nCandidate with ID 3:");
console.log(candidateId3);


// 6. Check whether any candidate has more than 5 years experience

const hasMoreThanFiveYears = candidates.some(
    candidate => candidate.experience > 5
);

console.log("\nAny candidate with more than 5 years experience:");
console.log(hasMoreThanFiveYears);


// 7. Check whether all candidates have at least one skill

const allHaveSkills = candidates.every(
    candidate => candidate.skills.length > 0
);

console.log("\nDo all candidates have at least one skill?");
console.log(allHaveSkills);


// 8. Create a list of all unique skills

const allSkills = candidates.flatMap(
    candidate => candidate.skills
);

const uniqueSkills = [...new Set(allSkills)];

console.log("\nUnique Skills:");
console.log(uniqueSkills);


// 9. Create new array with isExperienced property

const candidatesWithExperience = candidates.map(candidate => ({
    ...candidate,
    isExperienced: candidate.experience >= 3
}));

console.log("\nCandidates with isExperienced:");
console.log(candidatesWithExperience);


// 10. Destructuring - extract name, email and position

const {
    name,
    email,
    position
} = candidateId3;

console.log("\nDestructured Candidate:");
console.log(name);
console.log(email);
console.log(position);


// 11. Template literal - candidate summary

const candidateSummary = `
Candidate: ${name}
Email: ${email}
Position: ${position}
Experience: ${candidateId3.experience} years
Status: ${candidateId3.status}
`;

console.log("\nCandidate Summary:");
console.log(candidateSummary);


// 12. Optional chaining

const candidatePhone = candidateId3?.phone?.number;

console.log("\nCandidate Phone:");
console.log(candidatePhone);