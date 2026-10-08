const candidate = {
    name: "Shaikh Sabur",
    age: 21,
    experience: 1,
    skills: ["JavaScript", "Node.js", "MongoDB"]
};

const minimumAge = 18;
const minimumExperience = 1;
const requiredSkill = "JavaScript";

if (
    candidate.age >= minimumAge &&
    candidate.experience >= minimumExperience &&
    candidate.skills.includes(requiredSkill)
) {
    console.log("Candidate is eligible");
} else {
    console.log("Candidate is not eligible");
}
