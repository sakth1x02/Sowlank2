import React, { useState, useEffect } from "react";
import TimePicker from "react-time-picker";
import toast from "react-hot-toast";

function TimeBlockSchedule({
  timeBlocks,
  setTimeBlocks,
  tasks,
  taskAssignments,
  handleDeleteBlock,
  calculateProgress,
  renderTasksForBlock,
}) {
  const [editingBlock, setEditingBlock] = useState(null);
  const [editBlockData, setEditBlockData] = useState({
    start: "",
    end: "",
    title: "",
    description: "",
  });
  const [showAddBlockForm, setShowAddBlockForm] = useState(false);
  const [newBlockData, setNewBlockData] = useState({
    start: "09:00",
    end: "10:00",
    title: "",
    description: "",
  });
  const [countdowns, setCountdowns] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updatedCountdowns = {};
      timeBlocks.forEach((block) => {
        const [endHours, endMinutes] = block.end.split(":");
        const endTime = new Date();
        endTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);
        if (isBlockActive(block) && endTime > now) {
          const timeLeft = Math.max(0, endTime - now);
          const minutes = Math.floor(timeLeft / 60000);
          const seconds = Math.floor((timeLeft % 60000) / 1000);
          updatedCountdowns[block.id] = `${minutes}:${seconds
            .toString()
            .padStart(2, "0")}`;
        }
      });
      setCountdowns(updatedCountdowns);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeBlocks]);

  const isBlockActive = (block) => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    return currentTime >= block.start && currentTime <= block.end;
  };

  const openEditModal = (block) => {
    setEditingBlock(block);
    setEditBlockData({
      start: block.start,
      end: block.end,
      title: block.title || "",
      description: block.description || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditBlockData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditTimeChange = (name, value) =>
    setEditBlockData((prev) => ({ ...prev, [name]: value || "" }));

  const saveBlockEdits = () => {
    if (!editBlockData.start || !editBlockData.end) {
      toast.error("Start and End times are required!");
      return;
    }
    const startTime = new Date(`1970-01-01T${editBlockData.start}:00`);
    const endTime = new Date(`1970-01-01T${editBlockData.end}:00`);
    if (endTime <= startTime) {
      toast.error("End time must be after start time!");
      return;
    }
    setTimeBlocks((prev) =>
      prev.map((block) =>
        block.id === editingBlock.id
          ? {
              ...block,
              ...editBlockData,
              title: editBlockData.title.trim() || "Untitled Block",
              description: editBlockData.description.trim() || "No description provided.",
            }
          : block
      )
    );
    toast.success("Time block updated!");
    setEditingBlock(null);
  };

  const handleNewBlockChange = (e) => {
    const { name, value } = e.target;
    setNewBlockData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewBlockTimeChange = (name, value) =>
    setNewBlockData((prev) => ({ ...prev, [name]: value || "" }));

  const handleAddTimeBlock = (e) => {
    e.preventDefault();
    if (!newBlockData.start || !newBlockData.end) {
      toast.error("Start and End times are required!");
      return;
    }
    const startTime = new Date(`1970-01-01T${newBlockData.start}:00`);
    const endTime = new Date(`1970-01-01T${newBlockData.end}:00`);
    if (endTime <= startTime) {
      toast.error("End time must be after start time!");
      return;
    }
    const newBlock = {
      id: Date.now().toString(),
      start: newBlockData.start,
      end: newBlockData.end,
      title: newBlockData.title.trim() || "Untitled Block",
      description: newBlockData.description.trim() || "No description provided.",
    };
    setTimeBlocks((prev) => [...prev, newBlock]);
    setNewBlockData({ start: "09:00", end: "10:00", title: "", description: "" });
    setShowAddBlockForm(false);
    toast.success("New time block added!");
  };

  return (
    <div className="bg-white p-4 md:p-8 rounded-2xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 md:mb-6 gap-2">
        <h2 className="text-2xl md:text-3xl font-semibold text-purple-600">Time Blocking Schedule</h2>
        <button
          onClick={() => setShowAddBlockForm(true)}
          className="px-4 py-2 md:px-6 md:py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold text-base md:text-lg shadow-md"
        >
          Add Time Block
        </button>
      </div>
      <div className="space-y-4">
        {timeBlocks.map((block) => (
          <div
            key={block.id}
            className={`border-l-4 pl-4 rounded-lg bg-gray-50 p-3 md:p-4 ${
              isBlockActive(block) ? "border-green-500 bg-green-50" : "border-purple-700"
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-medium text-gray-800">
                  {block.start} - {block.end}: {block.title || "Untitled Block"}
                </h3>
                <p className="text-base md:text-lg text-gray-600 mt-1">{block.description}</p>
                {countdowns[block.id] && (
                  <p className="text-xs md:text-sm text-green-600 mt-1">
                    Time Left: {countdowns[block.id]}
                  </p>
                )}
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${calculateProgress(block.id)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    Progress: {Math.round(calculateProgress(block.id))}%
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => openEditModal(block)}
                  className="text-purple-700 hover:text-purple-800 text-base md:text-lg font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBlock(block.id)}
                  className="text-red-500 hover:text-red-600 text-base md:text-lg font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
            {renderTasksForBlock(block.id)}
          </div>
        ))}
      </div>

      {editingBlock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 md:p-8 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl md:text-2xl font-bold text-purple-700 mb-4 md:mb-6">Edit Time Block</h3>
            <div className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-base md:text-lg font-medium text-gray-700">Start Time</label>
                <TimePicker
                  onChange={(value) => handleEditTimeChange("start", value)}
                  value={editBlockData.start}
                  disableClock={true}
                  clearIcon={null}
                  className="mt-1 md:mt-2 block w-full border border-gray-300 rounded-lg p-2 md:p-3 text-base md:text-lg"
                />
              </div>
              <div>
                <label className="block text-base md:text-lg font-medium text-gray-700">End Time</label>
                <TimePicker
                  onChange={(value) => handleEditTimeChange("end", value)}
                  value={editBlockData.end}
                  disableClock={true}
                  clearIcon={null}
                  className="mt-1 md:mt-2 block w-full border border-gray-300 rounded-lg p-2 md:p-3 text-base md:text-lg"
                />
              </div>
              <div>
                <label className="block text-base md:text-lg font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editBlockData.title}
                  onChange={handleEditChange}
                  className="mt-1 md:mt-2 block w-full p-3 md:p-4 border border-gray-300 rounded-lg text-base md:text-lg"
                />
              </div>
              <div>
                <label className="block text-base md:text-lg font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={editBlockData.description}
                  onChange={handleEditChange}
                  className="mt-1 md:mt-2 block w-full p-3 md:p-4 border border-gray-300 rounded-lg text-base md:text-lg resize-none h-24 md:h-32"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 md:mt-6 gap-2 md:gap-4">
              <button
                onClick={() => setEditingBlock(null)}
                className="px-4 py-2 md:px-6 md:py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 text-base md:text-lg"
              >
                Cancel
              </button>
              <button
                onClick={saveBlockEdits}
                className="px-4 py-2 md:px-6 md:py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 text-base md:text-lg shadow-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddBlockForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 md:p-8 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl md:text-2xl font-bold text-purple-700 mb-4 md:mb-6">Add New Time Block</h3>
            <form onSubmit={handleAddTimeBlock} className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-base md:text-lg font-medium text-gray-700">Start Time</label>
                <TimePicker
                  onChange={(value) => handleNewBlockTimeChange("start", value)}
                  value={newBlockData.start}
                  disableClock={true}
                  clearIcon={null}
                  className="mt-1 md:mt-2 block w-full border border-gray-300 rounded-lg p-2 md:p-3 text-base md:text-lg"
                />
              </div>
              <div>
                <label className="block text-base md:text-lg font-medium text-gray-700">End Time</label>
                <TimePicker
                  onChange={(value) => handleNewBlockTimeChange("end", value)}
                  value={newBlockData.end}
                  disableClock={true}
                  clearIcon={null}
                  className="mt-1 md:mt-2 block w-full border border-gray-300 rounded-lg p-2 md:p-3 text-base md:text-lg"
                />
              </div>
              <div>
                <label className="block text-base md:text-lg font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newBlockData.title}
                  onChange={handleNewBlockChange}
                  className="mt-1 md:mt-2 block w-full p-3 md:p-4 border border-gray-300 rounded-lg text-base md:text-lg"
                />
              </div>
              <div>
                <label className="block text-base md:text-lg font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={newBlockData.description}
                  onChange={handleNewBlockChange}
                  className="mt-1 md:mt-2 block w-full p-3 md:p-4 border border-gray-300 rounded-lg text-base md:text-lg resize-none h-24 md:h-32"
                />
              </div>
              <div className="flex justify-end mt-4 md:mt-6 gap-2 md:gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddBlockForm(false)}
                  className="px-4 py-2 md:px-6 md:py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 text-base md:text-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 md:px-6 md:py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 text-base md:text-lg shadow-md"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeBlockSchedule;