const JobCard = ({ job }) => {
    return (
        <div className="job-card">
            <span className="job-type">{job.type}</span>

            <h3>{job.title}</h3>

            <p className="company">{job.company}</p>

            <p>📍 {job.location}</p>

            <p>💰 {job.salary}</p>

            <div className="skills">
                {job.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                ))}
            </div>

            <button>Apply Now</button>
        </div>
    );
};

export default JobCard;