const CompanyInfo = ({ company, location }) => {
    return (
        <div>
            <p>
                <strong>Company:</strong> {company}
            </p>

            <p>
                <strong>Location:</strong> {location}
            </p>
        </div>
    );
};

export default CompanyInfo;