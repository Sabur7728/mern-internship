import { readFile } from "node:fs/promises";

async function readCandidates() {
    try {
        // Read candidates.json
        const file = await readFile(
            "./data/candidates.json",
            "utf8"
        );

        // Convert JSON into JavaScript array
        const candidates = JSON.parse(file);

        // Total candidates
        const totalCandidates = candidates.length;

        // Shortlisted candidates
        const shortlistedCandidates = candidates.filter(
            (candidate) => candidate.status === "shortlisted"
        );

        // Interview candidates
        const interviewCandidates = candidates.filter(
            (candidate) => candidate.status === "interview"
        );

        // Hired candidates
        const hiredCandidates = candidates.filter(
            (candidate) => candidate.status === "hired"
        );

        // Calculate total experience
        const totalExperience = candidates.reduce(
            (total, candidate) => {
                return total + candidate.experience;
            },
            0
        );

        // Calculate average experience
        const averageExperience =
            totalExperience / totalCandidates;

        // Print results
        console.log("Total Candidates:", totalCandidates);

        console.log(
            "Total Shortlisted Candidates:",
            shortlistedCandidates.length
        );

        console.log(
            "Total Interview Candidates:",
            interviewCandidates.length
        );

        console.log(
            "Total Hired Candidates:",
            hiredCandidates.length
        );

        console.log(
            "Average Experience:",
            averageExperience.toFixed(2),
            "years"
        );

    } catch (error) {
        console.error(
            "Error reading candidates:",
            error.message
        );
    }
}

readCandidates();