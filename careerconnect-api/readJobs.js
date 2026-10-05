import { readFile } from "node:fs/promises";

async function readJobs() {
    try {
        // Read jobs.json
        const file = await readFile("./data/jobs.json", "utf8");

        // Parse JSON
        const jobs = JSON.parse(file);

        // Total number of jobs
        console.log("Total Jobs:", jobs.length);

        // Print each job title
        console.log("\nJob Titles:");

        jobs.forEach((job) => {
            console.log("-", job.title);
        });

        // Find Bangalore jobs
        const bangaloreJobs = jobs.filter(
            (job) => job.location === "Bangalore"
        );

        console.log("\nJobs in Bangalore:");

        bangaloreJobs.forEach((job) => {
            console.log(
                `- ${job.title} at ${job.company}`
            );
        });

    } catch (error) {
        console.error("Error reading jobs:", error.message);
    }
}

readJobs();