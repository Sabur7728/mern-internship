const HeroSection = () => {
    return (
        <section className="hero" id="home">
            <div>
                <h1>Find Your Dream Job</h1>

                <p>
                    Discover thousands of opportunities from top companies
                    and take your career to the next level.
                </p>

                <div className="hero-search">
                    <input
                        type="text"
                        placeholder="Job title or keyword"
                    />

                    <input
                        type="text"
                        placeholder="Location"
                    />

                    <button>Search Jobs</button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;