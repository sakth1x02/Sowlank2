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
  const [editBlockData, setEditBlockData] = useState({ start: "", end: "", title: "", description: "" });
  const [showAddBlockForm, setShowAddBlockForm] = useState(false);
  const [newBlockData, setNewBlockData] = useState({ start: "09:00", end: "10:00", title: "", description: "" });
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
          updatedCountdowns[block.id] = `${minutes}:${seconds.toString().padStart(2, "0")}`;
        }
      });
      setCountdowns(updatedCountdowns);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeBlocks]);

  const isBlockActive = (block) => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    return currentTime >= block.start && currentTime <= block.end;
  };

  const openEditModal = (block) => {
    setEditingBlock(block);
    setEditBlockData({ start: block.start, end: block.end, title: block.title || "", description: block.description || "" });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditBlockData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditTimeChange = (name, value) => setEditBlockData((prev) => ({ ...prev, [name]: value || "" }));

  const saveBlockEdits = () => {
    if (!editBlockData.start || !editBlockData.end) return toast.error("Start and End times are required!");
    const startTime = new Date(`1970-01-01T${editBlockData.start}:00`);
    const endTime = new Date(`1970-01-01T${editBlockData.end}:00`);
    if (endTime <= startTime) return toast.error("End time must be after start time!");
    setTimeBlocks((prev) =>
      prev.map((block) =>
        block.id === editingBlock.id
          ? { ...block, ...editBlockData, title: editBlockData.title.trim() || "Untitled Block", description: editBlockData.description.trim() || "No description provided." }
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

  const handleNewBlockTimeChange = (name, value) => setNewBlockData((prev) => ({ ...prev, [name]: value || "" }));

  const handleAddTimeBlock = (e) => {
    e.preventDefault();
    if (!newBlockData.start || !newBlockData.end) return toast.error("Start and End times are required!");
    const startTime = new Date(`1970-01-01T${newBlockData.start}:00`);
    const endTime = new Date(`1970-01-01T${newBlockData.end}:00`);
    if (endTime <= startTime) return toast.error("End time must be after start time!");
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
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-purple-600">Time Blocks</h2>
        <button onClick={() => setShowAddBlockForm(true)} className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold">Add Block</button>
      </div>
      <div className="space-y-4">
        {timeBlocks.map((block) => (
          <div key={block.id} className={`p-4 rounded-lg bg-gray-50 border-l-4 ${isBlockActive(block) ? "border-green-500" : "border-purple-700"}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-800">{block.start} - {block.end}: {block.title}</h3>
                <p className="text-gray-600">{block.description}</p>
                {countdowns[block.id] && <p className="text-sm text-green-600">Time Left: {countdowns[block.id]}</p>}
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${calculateProgress(block.id)}%` }}></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">Progress: {Math.round(calculateProgress(block.id))}%</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEditModal(block)} className="text-purple-700 hover:text-purple-800 font-semibold">Edit</button>
                <button onClick={() => handleDeleteBlock(block.id)} className="text-red-500 hover:text-red-600 font-semibold">Delete</button>
              </div>
            </div>
            {renderTasksForBlock(block.id)}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingBlock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h3 className="text-2xl font-bold text-purple-700 mb-4">Edit Time Block</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700">Start Time</label>
                <TimePicker onChange={(value) => handleEditTimeChange("start", value)} value={editBlockData.start} disableClock={true} clearIcon={null} className="mt-1 w-full border border-gray-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="block font-medium text-gray-700">End Time</label>
                <TimePicker onChange={(value) => handleEditTimeChange("end", value)} value={editBlockData.end} disableClock={true} clearIcon={null} className="mt-1 w-full border border-gray-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Title</label>
                <input type="text" name="title" value={editBlockData.title} onChange={handleEditChange} className="mt-1 w-full p-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Description</label>
                <textarea name="description" value={editBlockData.description} onChange={handleEditChange} className="mt-1 w-full p-2 border border-gray-300 rounded-lg h-24 resize-none" />
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-4">
              <button onClick={() => setEditingBlock(null)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">Cancel</button>
              <button onClick={saveBlockEdits} className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Block Modal */}
      {showAddBlockForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h3 className="text-2xl font-bold text-purple-700 mb-4">Add New Time Block</h3>
            <form onSubmit={handleAddTimeBlock} className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700">Start Time</label>
                <TimePicker onChange={(value) => handleNewBlockTimeChange("start", value)} value={newBlockData.start} disableClock={true} clearIcon={null} className="mt-1 w-full border border-gray-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="block font-medium text-gray-700">End Time</label>
                <TimePicker onChange={(value) => handleNewBlockTimeChange("end", value)} value={newBlockData.end} disableClock={true} clearIcon={null} className="mt-1 w-full border border-gray-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Title</label>
                <input type="text" name="title" value={newBlockData.title} onChange={handleNewBlockChange} className="mt-1 w-full p-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Description</label>
                <textarea name="description" value={newBlockData.description} onChange={handleNewBlockChange} className="mt-1 w-full p-2 border border-gray-300 rounded-lg h-24 resize-none" />
              </div>
              <div className="flex justify-end mt-6 gap-4">
                <button type="button" onClick={() => setShowAddBlockForm(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeBlockSchedule;