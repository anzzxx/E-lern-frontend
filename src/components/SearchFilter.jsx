import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
import Fuse from "fuse.js";
import Select from "react-select";
import { Form, Button, InputGroup, Card } from "react-bootstrap";
import "../styles/serchfilter.css"; // Make sure the path is correct

const SearchFilter = ({ data, fields, onFilter, showFilters = true }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);

  const fuse = new Fuse(data, {
    keys: fields,
    threshold: 0.3,
  });

  const filterOptions = fields.flatMap((field) =>
    Array.from(new Set(data.map((item) => item[field])))
      .filter((val) => val)
      .map((value) => ({ label: `${field}: ${value}`, value, field }))
  );

  const applyFilter = useCallback(
    _.debounce(() => {
      let filteredData = data;

      if (showFilters && selectedFilters.length > 0) {
        selectedFilters.forEach(({ field, value }) => {
          filteredData = filteredData.filter((item) => item[field] === value);
        });
      }

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
  }, [searchQuery, selectedFilters, applyFilter]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (selectedOptions) => {
    setSelectedFilters(selectedOptions || []);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedFilters([]);
    onFilter(data);
  };

  return (
    <div className="search-filter-wrapper">
      <Card className="search-filter-card">
        <Card.Body>
          <h5>Search & Filter</h5>

          <div className="d-flex align-items-center mb-3">
            <Form.Control
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={handleSearch}
              className="flex-grow-1"
            />
            <Button 
              variant="outline-primary" 
              onClick={clearSearch}
              className="clear-btn ml-2"
            >
              Clear All
            </Button>
          </div>

          {showFilters && (
            <Select
              isMulti
              options={filterOptions}
              value={selectedFilters}
              onChange={handleFilterChange}
              className="filter-select"
              placeholder="Select filters..."
              classNamePrefix="select"
            />
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default SearchFilter;