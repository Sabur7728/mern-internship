const ApplicationSummary = ({
    candidateName,
    jobTitle,
    company,
    applicationStatus
}) => {
    return (
        <div className="application-summary">

            <h2>Application Summary</h2>

            <p>
                <strong>Candidate:</strong> {candidateName}
            </p>

            <p>
                <strong>Position:</strong> {jobTitle}
            </p>

            <p>
                <strong>Company:</strong> {company}
            </p>

            <p>
                <strong>Status:</strong> {applicationStatus}
            </p>

        </div>
    );
};

export default ApplicationSummary;