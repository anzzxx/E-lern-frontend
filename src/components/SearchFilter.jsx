import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
import Fuse from "fuse.js";
import Select from "react-select";
import { Form, Button, InputGroup, Card } from "react-bootstrap";
import "../styles/serchfilter.css"; // Import CSS file

const SearchFilter = ({ data, fields, onFilter, showFilters = true }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Fuse.js instance for searching
  const fuse = new Fuse(data, {
    keys: fields,
    threshold: 0.3,
  });

  // Generate filter options dynamically
  const filterOptions = fields.flatMap((field) =>
    Array.from(new Set(data.map((item) => item[field])))
      .filter((val) => val)
      .map((value) => ({ label: value, value, field }))
  );

  // Function to apply filtering
  const applyFilter = useCallback(
    _.debounce(() => {
      let filteredData = data;

      // Apply filter selection
      if (showFilters && selectedFilters.length > 0) {
        selectedFilters.forEach(({ field, value }) => {
          filteredData = filteredData.filter((item) => item[field] === value);
        });
      }

      // Apply search filtering
      if (searchQuery) {
        const results = fuse.search(searchQuery);
        filteredData = results.map((result) => result.item);
      }

      onFilter(filteredData);
    }, 300),
    [searchQuery, selectedFilters, data, showFilters]
  );

  useEffect(() => {
    applyFilter();
  }, [searchQuery, selectedFilters]);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter selection change
  const handleFilterChange = (selectedOptions) => {
    setSelectedFilters(selectedOptions || []);
  };

  // Clear search and filters
  const clearSearch = () => {
    setSearchQuery("");
    setSelectedFilters([]);
    onFilter(data);
  };

  return (
    <div className="search-filter-wrapper">
      <Card className="p-3 shadow-sm search-filter-card">
        <h5 className="mb-3 text-primary">Search & Filter</h5>

        {/* Search Input */}
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <Button variant="outline-primary" onClick={clearSearch}>
            Clear
          </Button>
        </InputGroup>

        {/* Filter Dropdown */}
        {showFilters && (
          <Select
            isMulti
            options={filterOptions}
            value={selectedFilters}
            onChange={handleFilterChange}
            className="filter-select mb-2"
            placeholder="Filter by..."
          />
        )}
      </Card>
    </div>
  );
};

export default SearchFilter;
