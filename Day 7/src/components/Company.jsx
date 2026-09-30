const imageUrl = "/images/company-logo.png";

const Company = () => {
    return (
        <div>
            <h2>Our Company</h2>

            <img
                src={imageUrl}
                alt="Company logo"
            />
        </div>
    );
};

export default Company;
