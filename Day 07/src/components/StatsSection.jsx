import StatsCard from "./StatsCard";
import { stats } from "../data/stats";

const StatsSection = () => {
    return (
        <section>

            <h2>CareerConnect at a Glance</h2>

            <div>
                {stats.map((stat) => (
                    <StatsCard
                        key={stat.id}
                        value={stat.value}
                        label={stat.label}
                    />
                ))}
            </div>

        </section>
    );
};

export default StatsSection;