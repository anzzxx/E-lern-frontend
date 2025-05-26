import React, { useState } from "react";
import "../styles/table.css";
import { FaSync } from "react-icons/fa";

const ReusableTable = ({ columns, data, onRefresh }) => {
  const [expandedCells, setExpandedCells] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const toggleExpand = (rowId, columnField) => {
    setExpandedCells(prev => ({
      ...prev,
      [`${rowId}-${columnField}`]: !prev[`${rowId}-${columnField}`]
    }));
  };

  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    try {
      setIsRefreshing(true);
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="table-container">
      <div className="table-header">
        {onRefresh && (
          <button 
            onClick={handleRefresh} 
            className="refresh-button"
            disabled={isRefreshing}
            aria-label="Refresh table data"
          >
            <FaSync className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`} />
            <span className="refresh-text">Refresh</span>
          </button>
        )}
      </div>
      <table className="modern-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.field}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id || row._id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
              {columns.map((column, colIndex) => {
                const content = column.render ? column.render(row) : row[column.field];
                const isLastColumn = colIndex === columns.length - 1;
                const cellKey = `${row.id}-${column.field}`;
                const isExpanded = expandedCells[cellKey];
                const shouldTruncate = String(content).length > 100 && !isLastColumn;

                return (
                  <td key={`${column.field}-${row.id}`}>
                    <div className={`cell-content ${isExpanded ? 'expanded' : ''} ${isLastColumn ? 'no-truncate' : ''}`}>
                      {content}
                    </div>
                    {shouldTruncate && (
                      <button 
                        onClick={() => toggleExpand(row.id, column.field)} 
                        className="expand-toggle"
                      >
                        {isExpanded ? 'Show Less' : 'Show More...'}
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(ReusableTable);