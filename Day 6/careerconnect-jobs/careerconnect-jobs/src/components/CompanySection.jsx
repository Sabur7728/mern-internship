const CompanySection = () => {
    const companies = [
        "Tech Solutions",
        "Digital Labs",
        "CloudTech",
        "WebWorks",
        "CareerTech"
    ];

    return (
        <section className="companies" id="companies">
            <h2>Top Companies Hiring</h2>

            <div className="company-grid">
                {companies.map((company) => (
                    <div className="company-card" key={company}>
                        <h3>{company}</h3>
                        <p>Hiring talented developers</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CompanySection;