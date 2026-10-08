import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import SearchBar from "./components/SearchBar";
import StatsSection from "./components/StatsSection";
import JobList from "./components/JobList";
import Footer from "./components/Footer";

const App = () => {

    const handleApply = () => {
        console.log("Application started");
        alert("Application started!");
    };

    return (
        <div>

            <Header />

            <HeroSection
                title="Find Your Next Career Opportunity"
                description="Discover jobs from companies hiring across India."
            />

            <SearchBar />

            <StatsSection />

            <JobList
                onApply={handleApply}
            />

            <Footer />

        </div>
    );
};

export default App;