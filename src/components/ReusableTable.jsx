import React from "react";
import "../styles/table.css";

const ReusableTable = ({ columns, data }) => {
  return (
    <table className="custom-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.field}>{column.label}</th> // ✅ Corrected to <th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column.field}>
                {column.render ? column.render(row) : row[column.field]} {/* ✅ Now supports icons in "Action" column */}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ReusableTable;
