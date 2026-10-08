import Header from "./components/Header";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import SearchBar from "./components/SearchBar";
import StatsSection from "./components/StatsSection";
import CompanyInfo from "./components/CompanyInfo";
import JobList from "./components/JobList";
import CompanySection from "./components/CompanySection";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";

function App() {
    return (
        <>
            <Header />
            <Navigation />
            <HeroSection />
            <SearchBar />
            <StatsSection />
            <CompanyInfo />
            <JobList />
            <CompanySection />
            <CallToAction />
            <Footer />
        </>
    );
}

export default App;