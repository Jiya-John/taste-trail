function SearchBar({ value, onChange, onSubmit }) {
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <div className="home-top">
        <form onSubmit={handleSubmit} className="home-search-form">
            <input
                className="search"
                placeholder="Search by restaurant, city, or dish…"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <button type="submit" className="search-button">Search</button>
        </form>
    </div>
  );
}

export default SearchBar