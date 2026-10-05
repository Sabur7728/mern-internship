import { useState } from "react";

const JobSearch = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const jobs = [
        "MERN Stack Developer",
        "Frontend Developer",
        "Backend Developer",
        "Node.js Developer",
        "React Developer",
        "Java Developer",
        "Python Developer",
        "Full Stack Developer"
    ];

    const filteredJobs = jobs.filter(job =>
        job.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleClear = () => {
        setSearchTerm("");
    };

    return (
        <div className="job-search">
            <h2>Interactive Job Search</h2>

            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by job title..."
            />

            <button onClick={handleClear}>
                Clear Search
            </button>

            <p>
                Searching for: {searchTerm || "All Jobs"}
            </p>

            {filteredJobs.length > 0 ? (
                <ul>
                    {filteredJobs.map((job, index) => (
                        <li key={index}>
                            {job}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>
                    No jobs found matching "{searchTerm}"
                </p>
            )}
        </div>
    );
};

export default JobSearch;