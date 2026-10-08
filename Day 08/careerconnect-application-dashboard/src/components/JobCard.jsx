import SaveButton from "./SaveButton";

const JobCard = ({
    job,
    isSaved,
    onSave,
    onApply
}) => {

    return (
        <div className="job-card">

            <div className="job-card-header">

                <div>

                    <h3>
                        {job.title}
                    </h3>

                    <p>
                        {job.company}
                    </p>

                </div>

                <span>
                    {job.employmentType}
                </span>

            </div>


            <div className="job-info">

                <p>
                    📍 {job.location}
                </p>

                <p>
                    💰 {job.salary}
                </p>

                <p>
                    💼 {job.experience}
                </p>

            </div>


            <div className="skills">

                {job.skills.map((skill) => (

                    <span key={skill}>
                        {skill}
                    </span>

                ))}

            </div>


            <div className="job-actions">

                <SaveButton
                    isSaved={isSaved}
                    onClick={() => onSave(job)}
                />

                <button
                    type="button"
                    onClick={() => onApply(job)}
                >
                    Apply Now
                </button>

            </div>

        </div>
    );
};

export default JobCard;