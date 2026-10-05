const SearchBar = () => {
    return (
        <section className="search-section">
            <h2>Search Jobs</h2>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search by job title"
                />

                <select>
                    <option>All Locations</option>
                    <option>Pune</option>
                    <option>Mumbai</option>
                    <option>Bangalore</option>
                    <option>Hyderabad</option>
                </select>

                <button>Search</button>
            </div>
        </section>
    );
};

export default SearchBar;