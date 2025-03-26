import React from "react";

function TaskHistory({ taskHistory }) {
  return (
    <div className="bg-white p-4 md:p-8 rounded-2xl shadow-lg mt-6">
      <h2 className="text-2xl md:text-3xl font-semibold text-purple-600 mb-4 md:mb-6">Task History</h2>
      {taskHistory.length > 0 ? (
        <ul className="space-y-2 md:space-y-3 max-h-80 md:max-h-96 overflow-y-auto">
          {taskHistory.map((entry, index) => (
            <li key={index} className="border-b border-gray-200 pb-2 text-base md:text-lg text-gray-700">
              <p>
                <strong>{entry.action}</strong>: "{entry.text}" (Task ID: {entry.taskId})
              </p>
              <p className="text-xs md:text-sm text-gray-500">
                {new Date(entry.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic text-center text-base md:text-xl">No history available.</p>
      )}
    </div>
  );
}

export default TaskHistory;