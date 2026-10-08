import JobCard from "./JobCard";
import { jobs } from "../data/jobs";

const JobList = ({ onApply }) => {
    return (
        <section>

            <h2>Latest Job Opportunities</h2>

            <div>
                {jobs.map((job) => (
                    <JobCard
                        key={job.id}
                        job={job}
                        onApply={onApply}
                    />
                ))}
            </div>

        </section>
    );
};

export default JobList;