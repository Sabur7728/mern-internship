import jobs from "../data/jobs";
import JobCard from "./JobCard";

const JobList = () => {
    return (
        <section className="jobs-section">
            <div className="section-title">
                <h2>Featured Jobs</h2>
                <p>Explore the latest opportunities</p>
            </div>

            <div className="job-grid">
                {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>
        </section>
    );
};

export default JobList;