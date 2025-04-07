import React from "react";

function TaskHistory({ taskHistory }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
      <h2 className="text-2xl font-semibold text-purple-600 mb-4">Task History</h2>
      {taskHistory.length > 0 ? (
        <ul className="space-y-3 max-h-80 overflow-y-auto">
          {taskHistory.map((entry, index) => (
            <li key={index} className="border-b border-gray-200 pb-2 text-gray-700">
              <p><strong>{entry.action}</strong>: "{entry.text}" (Task ID: {entry.taskId})</p>
              <p className="text-sm text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic text-center">No history available.</p>
      )}
    </div>
  );
}

export default TaskHistory;