import { useState } from "react";

function SearchBar({ value, onChange, onSubmit, ratingFilter, setRatingFilter }) {
  const [showDropdown, setShowDropdown] = useState(false);

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

        {/* Rating filter */}
        <div className="rating-filter">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Rating – {ratingFilter}
          </button>

          {showDropdown && (
            <ul className="rating-dropdown">
              {["All", 5, 4, 3, 2, 1].map((r) => (
                <li
                  key={r}
                  onClick={() => {
                    setRatingFilter(r);
                    setShowDropdown(false);
                  }}
                >
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
    </div>
  );
}

export default SearchBar