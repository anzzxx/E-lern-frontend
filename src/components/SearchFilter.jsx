import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
import Fuse from "fuse.js";
import "../styles/serchfilter.css";

const SearchFilter = ({ data, fields, onFilter }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const fuse = new Fuse(data, {
    keys: fields,
    threshold: 0.3,
  });

  const applyFilter = useCallback(
    _.debounce(() => {
      if (searchQuery) {
        const results = fuse.search(searchQuery);
        onFilter(results.map((result) => result.item));
      } else {
        onFilter(data);
      }
    }, 300),
    [searchQuery, data]
  );

  useEffect(() => {
    applyFilter();
    return () => applyFilter.cancel();
  }, [searchQuery, applyFilter]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="minimal-search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search records..."
          value={searchQuery}
          onChange={handleSearch}
          className="minimal-search-input"
        />
        {searchQuery && (
          <button onClick={clearSearch} className="clear-search-btn">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(SearchFilter);