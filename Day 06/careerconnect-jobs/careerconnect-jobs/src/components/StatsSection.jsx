const StatsSection = () => {
    const stats = [
        { number: "10,000+", label: "Jobs" },
        { number: "5,000+", label: "Companies" },
        { number: "25,000+", label: "Candidates" },
        { number: "1,500+", label: "Placements" }
    ];

    return (
        <section className="stats">
            {stats.map((stat) => (
                <div className="stat-card" key={stat.label}>
                    <h2>{stat.number}</h2>
                    <p>{stat.label}</p>
                </div>
            ))}
        </section>
    );
};

export default StatsSection;