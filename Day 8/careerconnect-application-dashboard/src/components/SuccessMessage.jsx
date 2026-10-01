const SuccessMessage = ({
    submittedJob,
    onContinue
}) => {

    return (
        <section className="success-section">

            <div className="success-card">

                <div className="success-icon">
                    ✓
                </div>

                <h2>
                    Application Submitted Successfully
                </h2>

                <h3>
                    {submittedJob.title}
                </h3>

                <p>
                    {submittedJob.company}
                </p>

                <p>
                    Your application has been recorded.
                </p>

                <button
                    type="button"
                    onClick={onContinue}
                >
                    Continue Browsing Jobs
                </button>

            </div>

        </section>
    );
};

export default SuccessMessage;