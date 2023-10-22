import React from "react";
import "./SearchBox.css";

function SearchBox({ handleSearch, searchResult }) {
  return (
    <div className="search-box-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search by name, email or role..."
        value={searchResult}
        onChange={handleSearch}
      />
    </div>
  );
}

export default SearchBox;
