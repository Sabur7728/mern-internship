const SearchBar = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="search-section">
            <h2>Find Your Dream Job</h2>

            <input
                type="text"
                value={searchTerm}
                onChange={onSearchChange}
                placeholder="Search by job title..."
            />
        </div>
    );
};

export default SearchBar;