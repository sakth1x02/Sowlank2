import React from "react";

function HelpModal({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          The 3-3-3 Method
        </h2>
        <p className="text-gray-600 mb-4">
          The <strong>3-3-3 Method</strong> is a strategy from Oliver Burkeman,
          author of <em>Four Thousand Weeks</em>, to help you structure your
          day:
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>
            <strong>3 Hours Deep Work</strong>: Focus on your most important
            thing.
          </li>
          <li>
            <strong>3 Shorter Tasks</strong>: Complete small tasks you’ve been
            avoiding.
          </li>
          <li>
            <strong>3 Maintenance Tasks</strong>: Keep life in order (health,
            relationships, housekeeping, etc.).
          </li>
        </ul>
        <p className="text-gray-600 mb-4">
          This framework removes the pressure of "never enough" and ensures you
          end each day feeling satisfied and productive.
        </p>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-200"
          title="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default HelpModal;
