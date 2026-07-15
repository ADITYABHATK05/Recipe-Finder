const CATEGORIES = [
  "All",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Dessert",
  "Beverages",
];

const SearchBar = ({ searchTerm, onSearchChange, category, onCategoryChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search recipes by name..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        className="category-select"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchBar;
