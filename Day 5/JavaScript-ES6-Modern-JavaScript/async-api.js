// Day 5 - Async API Simulation

// Simulated API function

const getCandidates = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    name: "Amit",
                    position: "Frontend Developer"
                },
                {
                    name: "Priya",
                    position: "Data Analyst"
                }
            ]);
        }, 1500);
    });
};


// Async function

const displayCandidates = async () => {
    try {
        // Wait for API response
        const candidates = await getCandidates();

        // 1. Print candidates
        console.log("Candidates:");
        console.log(candidates);


        // 2. Extract candidate names
        const candidateNames = candidates.map(
            candidate => candidate.name
        );

        console.log("\nCandidate Names:");
        console.log(candidateNames);


        // 3. Display formatted message
        console.log("\nCandidate Details:");

        candidates.forEach(({ name, position }) => {
            console.log(
                `${name} has applied for the ${position} position.`
            );
        });

    } catch (error) {
        console.error("Error:", error.message);
    }
};


// Call function

displayCandidates();