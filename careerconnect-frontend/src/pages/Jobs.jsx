import { useEffect, useState } from "react";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadJobs() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://localhost:5000/api/jobs"
                );

                if (!response.ok) {
                    throw new Error("Unable to load jobs");
                }

                const result = await response.json();

                setJobs(result.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadJobs();
    }, []);

    if (loading) {
        return <h2>Loading jobs...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>
            <h1>CareerConnect Jobs</h1>

            {jobs.map((job) => (
                <div key={job.id}>
                    <h2>{job.title}</h2>

                    <p>
                        Company: {job.company}
                    </p>

                    <p>
                        Location: {job.location}
                    </p>

                    <p>
                        Experience: {job.experience}
                    </p>

                    <p>
                        Salary: {job.salary}
                    </p>

                    <hr />
                </div>
            ))}
        </div>
    );
}

export default Jobs;