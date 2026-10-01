import { useState } from "react";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import JobFilters from "./components/JobFilters";
import JobList from "./components/JobList";
import ApplicationForm from "./components/ApplicationForm";
import SuccessMessage from "./components/SuccessMessage";
import Footer from "./components/Footer";

import jobs from "./data/jobs";

function App() {

    // Search
    const [searchTerm, setSearchTerm] = useState("");

    // Filters
    const [selectedLocation, setSelectedLocation] =
        useState("All");

    const [selectedType, setSelectedType] =
        useState("All");

    // Saved jobs
    const [savedJobs, setSavedJobs] = useState([]);

    // Application
    const [selectedJob, setSelectedJob] =
        useState(null);

    const [showApplicationForm, setShowApplicationForm] =
        useState(false);

    // Success
    const [applicationSubmitted, setApplicationSubmitted] =
        useState(false);

    const [submittedJob, setSubmittedJob] =
        useState(null);


    // =========================
    // SEARCH
    // =========================

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };


    // =========================
    // LOCATION FILTER
    // =========================

    const handleLocationChange = (event) => {
        setSelectedLocation(event.target.value);
    };


    // =========================
    // TYPE FILTER
    // =========================

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
    };


    // =========================
    // CLEAR FILTERS
    // =========================

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedLocation("All");
        setSelectedType("All");
    };


    // =========================
    // SAVE / REMOVE JOB
    // =========================

    const handleSaveJob = (job) => {

        setSavedJobs((previousJobs) => {

            const alreadySaved = previousJobs.some(
                (savedJob) => savedJob.id === job.id
            );

            if (alreadySaved) {

                return previousJobs.filter(
                    (savedJob) => savedJob.id !== job.id
                );
            }

            return [
                ...previousJobs,
                job
            ];
        });
    };


    // =========================
    // APPLY JOB
    // =========================

    const handleApplyJob = (job) => {

        setSelectedJob(job);

        setShowApplicationForm(true);

        setApplicationSubmitted(false);

        setSubmittedJob(null);

        setTimeout(() => {

            document
                .getElementById("application")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        }, 100);
    };


    // =========================
    // CLOSE APPLICATION
    // =========================

    const handleCloseApplication = () => {

        setSelectedJob(null);

        setShowApplicationForm(false);
    };


    // =========================
    // SUBMIT APPLICATION
    // =========================

    const handleApplicationSubmit = (formData) => {

        console.log("Application Submitted:", {
            job: selectedJob,
            candidate: formData
        });

        // Store submitted job
        setSubmittedJob(selectedJob);

        // Show success message
        setApplicationSubmitted(true);

        // Hide form
        setShowApplicationForm(false);
    };


    // =========================
    // FILTER JOBS
    // =========================

    const filteredJobs = jobs.filter((job) => {

        const matchesSearch =
            job.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesLocation =
            selectedLocation === "All" ||
            job.location === selectedLocation;

        const matchesType =
            selectedType === "All" ||
            job.employmentType === selectedType;

        return (
            matchesSearch &&
            matchesLocation &&
            matchesType
        );
    });


    // =========================
    // CONTINUE BROWSING
    // =========================

    const handleContinueBrowsing = () => {

        setApplicationSubmitted(false);

        setSubmittedJob(null);

        setSelectedJob(null);
    };


    // =========================
    // UI
    // =========================

    return (
        <div className="app">

            {/* Header */}

            <Header
                savedCount={savedJobs.length}
            />


            <main>

                {/* =====================
                    HERO
                ===================== */}

                <section className="hero">

                    <div>

                        <p className="hero-small">
                            CAREERCONNECT
                        </p>

                        <h1>
                            Find Your Next
                            <br />
                            Career Opportunity
                        </h1>

                        <p>
                            Search opportunities and
                            find the job that's right
                            for you.
                        </p>

                    </div>

                </section>


                {/* =====================
                    SEARCH
                ===================== */}

                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                />


                {/* =====================
                    FILTERS
                ===================== */}

                <JobFilters
                    selectedLocation={selectedLocation}
                    selectedType={selectedType}
                    onLocationChange={handleLocationChange}
                    onTypeChange={handleTypeChange}
                    onClearFilters={handleClearFilters}
                />


                {/* =====================
                    JOB LIST
                ===================== */}

                <JobList
                    jobs={filteredJobs}
                    savedJobs={savedJobs}
                    onSave={handleSaveJob}
                    onApply={handleApplyJob}
                />


                {/* =====================
                    APPLICATION FORM
                ===================== */}

                {showApplicationForm && selectedJob && (

                    <section
                        id="application"
                        className="application-section"
                    >

                        <ApplicationForm
                            selectedJob={selectedJob}
                            onClose={handleCloseApplication}
                            onSubmit={handleApplicationSubmit}
                        />

                    </section>
                )}


                {/* =====================
                    SUCCESS MESSAGE
                ===================== */}

                {applicationSubmitted && submittedJob && (

                    <SuccessMessage
                        submittedJob={submittedJob}
                        onContinue={handleContinueBrowsing}
                    />

                )}

            </main>


            {/* =====================
                FOOTER
            ===================== */}

            <Footer />

        </div>
    );
}

export default App;