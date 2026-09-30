const StatsCard = ({ value, label }) => {
    return (
        <div>
            <h2>{value}</h2>
            <p>{label}</p>
        </div>
    );
};

export default StatsCard;