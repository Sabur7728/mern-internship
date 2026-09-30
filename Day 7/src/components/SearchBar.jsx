const SearchBar = () => {
    return (
        <div>
            <input
                type="text"
                placeholder="Search jobs..."
            />

            <input
                type="text"
                placeholder="Location"
            />

            <button>
                Search
            </button>
        </div>
    );
};

export default SearchBar;