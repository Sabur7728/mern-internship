function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      className="search-input"
      placeholder="Search candidates or positions..."
      value={search}
      onChange={(event) => setSearch(event.target.value)}
    />
  );
}

export default SearchBar;