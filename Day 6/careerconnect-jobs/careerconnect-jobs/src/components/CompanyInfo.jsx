const CompanyInfo = () => {
    const company = "CareerConnect";
    const openJobs = 128;
    const location = "India";
    const isHiring = true;

    return (
        <section className="company-info">
            <h2>{company}</h2>

            <p>Open Jobs: {openJobs}</p>

            <p>Location: {location}</p>

            <p>
                Hiring Status:{" "}
                {isHiring ? "Currently Hiring" : "Not Hiring"}
            </p>
        </section>
    );
};

export default CompanyInfo;