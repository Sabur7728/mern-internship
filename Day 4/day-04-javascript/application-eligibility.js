const candidate = {
    name: "Shaikh Sabur",
    experience: 2,
    skills: ["JavaScript", "Node.js", "MongoDB"]
};

const job = {
    title: "MERN Stack Developer",
    requiredExperience: 1,
    requiredSkills: ["JavaScript", "Node.js"],
    status: "open"
};


// Application Eligibility Function
function checkEligibility(candidate, job) {

    // Check job status
    if (job.status !== "open") {
        return "Candidate is not eligible: Job is closed.";
    }

    // Check experience
    if (candidate.experience < job.requiredExperience) {
        return "Candidate is not eligible: Insufficient experience.";
    }

    // Check required skills
    const hasRequiredSkills = job.requiredSkills.every((requiredSkill) =>
        candidate.skills.includes(requiredSkill)
    );

    if (!hasRequiredSkills) {
        return "Candidate is not eligible: Required skills are missing.";
    }

    return "Candidate is eligible to apply.";
}


// Call the function
const result = checkEligibility(candidate, job);

console.log(result);