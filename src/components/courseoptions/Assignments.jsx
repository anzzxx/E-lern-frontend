import React from "react";

const Assignments = ({ items }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-xl font-semibold mb-4">Assignments</h2>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="p-2 bg-gray-50 rounded flex justify-between items-center">
          <div>
            <span className="font-medium">{item.name}</span>
            <span className="block text-sm text-gray-500">Due: {item.dueDate}</span>
          </div>
          <button className="text-blue-600 hover:text-blue-800">
            {item.dueDate === "Add Assignment" ? "Add" : "View"}
          </button>
        </li>
      ))}
    </ul>
    <button className="mt-3 text-sm text-blue-600 hover:text-blue-800">
      + Add Assignment
    </button>
  </div>
);

export default Assignments;