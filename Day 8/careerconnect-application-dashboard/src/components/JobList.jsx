import JobCard from "./JobCard";

const JobList = ({
    jobs,
    savedJobs,
    onSave,
    onApply
}) => {
    return (
        <section id="jobs" className="job-section">

            <div className="section-title">
                <h2>Available Jobs</h2>

                <span>
                    {jobs.length} Jobs Found
                </span>
            </div>

            {jobs.length === 0 ? (
                <div className="no-results">
                    <h3>No Jobs Found</h3>

                    <p>
                        Try changing your search or filters.
                    </p>
                </div>
            ) : (
                <div className="job-grid">

                    {jobs.map((job) => (

                        <JobCard
                            key={job.id}
                            job={job}
                            isSaved={savedJobs.some(
                                savedJob => savedJob.id === job.id
                            )}
                            onSave={onSave}
                            onApply={onApply}
                        />

                    ))}

                </div>
            )}

        </section>
    );
};

export default JobList;