import React from "react";

const Filter = ({ search, handleSearch }) => (
  <form>
    <div className="search-container">
      Filter with (name or number){" "}
      <input value={search} onChange={handleSearch} id="search" />
    </div>
  </form>
);

export default Filter;
