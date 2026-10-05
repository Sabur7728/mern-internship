const JobFilters = ({
    selectedLocation,
    selectedType,
    onLocationChange,
    onTypeChange,
    onClearFilters
}) => {
    return (
        <div className="filters">

            <div className="filter-group">
                <label htmlFor="location">
                    Location
                </label>

                <select
                    id="location"
                    value={selectedLocation}
                    onChange={onLocationChange}
                >
                    <option value="All">
                        All Locations
                    </option>

                    <option value="Pune">Pune</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Delhi">Delhi</option>
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="employmentType">
                    Employment Type
                </label>

                <select
                    id="employmentType"
                    value={selectedType}
                    onChange={onTypeChange}
                >
                    <option value="All">
                        All Types
                    </option>

                    <option value="Full-time">
                        Full-time
                    </option>

                    <option value="Remote">
                        Remote
                    </option>

                    <option value="Internship">
                        Internship
                    </option>
                </select>
            </div>

            <button
                type="button"
                onClick={onClearFilters}
                className="clear-btn"
            >
                Clear Filters
            </button>

        </div>
    );
};

export default JobFilters;