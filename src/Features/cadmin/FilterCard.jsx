import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const FilterCard = ({ filters, setFilters, onApplyFilters }) => {
  const { instructorCourses, isLoading, error } = useSelector((state) => state.courses);

  // Local state to manage form inputs
  const [localFilters, setLocalFilters] = useState(filters);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle apply filters
  const handleApply = () => {
    setFilters(localFilters); // Update parent state
    onApplyFilters(localFilters); // Call the parent's apply filters handler
  };

  // Handle clear filters
  const handleClear = () => {
    const clearedFilters = {
      search: '',
      course: '',
      month: '',
      paymentStatus: ''
    };
    setLocalFilters(clearedFilters);
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f9f9ff 100%)',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
        width: '100%',
        height: '80%',
        border: '1px solid rgba(108, 99, 255, 0.1)',
        transition: 'transform 0.2s ease-in-out',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <h3
        style={{
          margin: '0 0 15px 0',
          fontSize: '18px',
          color: '#2c2c54',
          fontWeight: '600',
          letterSpacing: '0.5px',
        }}
      >
        Filter
      </h3>
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          name="search"
          value={localFilters.search}
          onChange={handleInputChange}
          placeholder="Search..."
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid rgba(108, 99, 255, 0.3)',
            backgroundColor: '#fff',
            color: '#444',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#6c63ff')}
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = 'rgba(108, 99, 255, 0.3)')
          }
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#6c63ff';
            e.currentTarget.style.boxShadow = '0 0 5px rgba(108, 99, 255, 0.3)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(108, 99, 255, 0.3)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '15px',
          background: 'rgba(245, 245, 255, 0.6)',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '15px',
        }}
      >
        <div>
          <select
            name="course"
            value={localFilters.course}
            onChange={handleInputChange}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid rgba(108, 99, 255, 0.3)',
              minWidth: '120px',
              backgroundColor: '#fff',
              color: '#444',
              fontSize: '14px',
              width: '100%',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#6c63ff')}
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = 'rgba(108, 99, 255, 0.3)')
            }
          >
            <option value="">Select Course</option>
            {instructorCourses?.map((course) => (
              <option key={course.id} value={course.title}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            name="month"
            value={localFilters.month}
            onChange={handleInputChange}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid rgba(108, 99, 255, 0.3)',
              minWidth: '120px',
              backgroundColor: '#fff',
              color: '#444',
              fontSize: '14px',
              width: '100%',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#6c63ff')}
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = 'rgba(108, 99, 255, 0.3)')
            }
          >
            <option value="">Select Month</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>
        <div>
          <select
            name="paymentStatus"
            value={localFilters.paymentStatus}
            onChange={handleInputChange}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid rgba(108, 99, 255, 0.3)',
              minWidth: '120px',
              backgroundColor: '#fff',
              color: '#444',
              fontSize: '14px',
              width: '100%',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#6c63ff')}
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = 'rgba(108, 99, 255, 0.3)')
            }
          >
            <option value="">Payment Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px',
        }}
      >
        <button
          onClick={handleClear}
          style={{
            background: 'linear-gradient(45deg, #f5f5f5, #e0e0e0)',
            color: '#666',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            width: '100%',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = 'linear-gradient(45deg, #e0e0e0, #d0d0d0)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = 'linear-gradient(45deg, #f5f5f5, #e0e0e0)')
          }
        >
          Clear Filters
        </button>
        <button
          onClick={handleApply}
          style={{
            background: 'linear-gradient(45deg, #6c63ff, #8a82ff)',
            color: '#fff',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            width: '100%',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(108, 99, 255, 0.3)',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = 'linear-gradient(45deg, #5a51ff, #7870ff)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = 'linear-gradient(45deg, #6c63ff, #8a82ff)')
          }
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterCard;