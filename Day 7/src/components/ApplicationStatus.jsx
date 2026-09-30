const ApplicationStatus = ({ status }) => {
    return (
        <p>
            Status:{" "}
            {status === "Selected"
                ? "🎉 Congratulations"
                : "Under Review"}
        </p>
    );
};

export default ApplicationStatus;