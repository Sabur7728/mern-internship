import CompanyInfo from "./CompanyInfo";
import SkillBadge from "./SkillBadge";
import ApplyButton from "./ApplyButton";

const JobCard = ({ job, onApply }) => {

    const {
        title,
        company,
        location,
        salary,
        experience,
        employmentType,
        skills,
        featured
    } = job;

    return (
        <article className="job-card">

            {featured && (
                <span>
                    ⭐ Featured Job
                </span>
            )}

            <h2>{title}</h2>

            <CompanyInfo
                company={company}
                location={location}
            />

            <p>
                <strong>Salary:</strong> {salary}
            </p>

            <p>
                <strong>Experience:</strong> {experience}
            </p>

            <p>
                <strong>Employment Type:</strong> {employmentType}
            </p>

            <h3>Skills</h3>

            <div>
                {skills.map((skill) => (
                    <SkillBadge
                        key={skill}
                        skill={skill}
                    />
                ))}
            </div>

            <ApplyButton
                onApply={onApply}
            />

        </article>
    );
};

export default JobCard;