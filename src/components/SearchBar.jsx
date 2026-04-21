function SearchBar({ value, onChange, onSubmit }) {
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form className="tt-home-search-form" onSubmit={handleSubmit}>
      <input
        className="tt-search"
        placeholder="Search by restaurant, city, dish, or rating…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </form>
  );
}

export default SearchBar