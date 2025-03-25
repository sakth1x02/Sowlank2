import React, { useState } from "react";
import { PlusCircle, CheckCircle2, XCircle, Info, X } from "lucide-react";

const MSCWMethod = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("must-have");
  const [showInfo, setShowInfo] = useState(false);

  const categories = {
    "must-have": {
      title: "Must-Have",
      description: "Critical for project success",
      color: "bg-red-100 border-red-500",
      textColor: "text-red-700",
    },
    "should-have": {
      title: "Should-Have",
      description: "Important but not critical",
      color: "bg-yellow-100 border-yellow-500",
      textColor: "text-yellow-700",
    },
    "could-have": {
      title: "Could-Have",
      description: "Desirable, if time and resources",
      color: "bg-green-100 border-green-500",
      textColor: "text-green-700",
    },
    "wont-have": {
      title: "Won't-Have",
      description: "Deferred for future phases",
      color: "bg-blue-100 border-blue-500",
      textColor: "text-blue-700",
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    setItems([
      ...items,
      {
        id: Date.now(),
        text: newItem,
        category: selectedCategory,
        completed: false,
        liked: false,
      },
    ]);
    setNewItem("");
  };

  const toggleComplete = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const toggleLike = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, liked: !item.liked } : item
      )
    );
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-800">
            MSCW Prioritization Tool
          </h1>
          <button
            onClick={() => setShowInfo(true)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Show information about MSCW Method"
          >
            <Info className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <p className="text-center text-gray-600 mb-8">
          Organize and prioritize your project requirements
        </p>

        {/* Add New Item Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4 items-start">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add a new item..."
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(categories).map(([key, { title }]) => (
                <option key={key} value={key}>
                  {title}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <PlusCircle className="w-6 h-6" />
            </button>
          </div>
        </form>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(categories).map(([key, category]) => (
            <div
              key={key}
              className={`rounded-lg border-2 ${category.color} p-4`}
            >
              <h2 className={`text-xl font-bold mb-2 ${category.textColor}`}>
                {category.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {category.description}
              </p>

              <div className="space-y-3">
                {items
                  .filter((item) => item.category === key)
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`bg-white p-3 rounded-lg shadow-sm ${
                        item.completed ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={item.completed ? "line-through" : ""}>
                          {item.text}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleComplete(item.id)}
                            className={`p-1 rounded-full ${
                              item.completed
                                ? "text-green-500 hover:text-green-600"
                                : "text-gray-400 hover:text-gray-500"
                            }`}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => toggleLike(item.id)}
                            className={`p-1 rounded-full ${
                              item.liked
                                ? "text-red-500 hover:text-red-600"
                                : "text-gray-400 hover:text-gray-500"
                            }`}
                          >
                            <svg
                              className="w-5 h-5"
                              fill={item.liked ? "currentColor" : "none"}
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Info Modal */}
        {showInfo && (
          <div className="fixed inset-0 overflow-scroll bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white top-40 rounded-lg p-8 max-w-2xl mx-4 relative">
              <button
                onClick={() => setShowInfo(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                About the MoSCoW Method
              </h2>

              <div className="space-y-4 text-gray-600">
                <p>
                  The MoSCoW method is a prioritization technique used in
                  project management and business analysis to reach a common
                  understanding with stakeholders on the importance of each
                  requirement or task.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mt-6">
                  Categories Explained:
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Must-Have:</strong> Non-negotiable requirements that
                    are critical for success
                  </li>
                  <li>
                    <strong>Should-Have:</strong> Important requirements that
                    add significant value but are not vital
                  </li>
                  <li>
                    <strong>Could-Have:</strong> Desirable requirements that
                    would be nice to include if resources permit
                  </li>
                  <li>
                    <strong>Won't-Have:</strong> Requirements that are not
                    planned for the current delivery timeframe
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mt-6">
                  Benefits:
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Clear prioritization of requirements</li>
                  <li>Better resource allocation</li>
                  <li>Improved stakeholder communication</li>
                  <li>Realistic project planning</li>
                  <li>Focused delivery approach</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mt-6">
                  How to Use This Tool:
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Add new requirements or tasks using the input field</li>
                  <li>Select the appropriate category for each item</li>
                  <li>Use the checkmark to mark completed items</li>
                  <li>Heart icon to mark favorite or important items</li>
                  <li>Delete items that are no longer relevant</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mt-6">
                  Best Practices:
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Keep Must-Haves to 60% or less of total requirements</li>
                  <li>Regularly review and update priorities</li>
                  <li>
                    Involve all stakeholders in the prioritization process
                  </li>
                  <li>Document the reasoning behind priority decisions</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MSCWMethod;
