const HeroSection = ({ title, description }) => {
    return (
        <section>
            <h1>{title}</h1>

            <p>{description}</p>

            <button>
                Explore Jobs
            </button>
        </section>
    );
};

export default HeroSection;