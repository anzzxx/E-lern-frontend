import React from "react";
import "../styles/table.css";

const ReusableTable = ({ columns, data }) => {
  return (
    <table className="custom-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.field}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id || row._id}> {/* Use a unique identifier from your data */}
            {columns.map((column) => (
              <td key={`${column.field}-${row.id}`}>
                {column.render ? column.render(row) : row[column.field]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default React.memo(ReusableTable);