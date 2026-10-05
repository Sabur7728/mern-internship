function SearchBar({ search, setSearch }) {
  return (
    <input
      className="search-input"
      type="text"
      value={search}
      onChange={(event) =>
        setSearch(event.target.value)
      }
      placeholder="Search..."
    />
  );
}

export default SearchBar;