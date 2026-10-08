const PageSection = ({ title, children }) => {
    return (
        <section className="page-section">

            <h2>{title}</h2>

            <div>
                {children}
            </div>

        </section>
    );
};

export default PageSection;