import React, { useState } from "react";
import "./StickyNotes.css";

const StickyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ text: "", color: "#ffff88" });
  const [isAddingNote, setIsAddingNote] = useState(false);

  const colors = [
    "#ffff88", // Yellow
    "#ff8888", // Red
    "#88ff88", // Green
    "#8888ff", // Blue
    "#ff88ff", // Pink
    "#88ffff", // Cyan
  ];

  const addNote = () => {
    if (newNote.text.trim() === "") return;

    setNotes([
      ...notes,
      {
        id: Date.now(),
        text: newNote.text,
        color: newNote.color,
        position: { x: 100, y: 100 },
      },
    ]);

    setNewNote({ text: "", color: "#ffff88" });
    setIsAddingNote(false);
  };

  const updateNote = (id, newText) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, text: newText } : note))
    );
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const changeColor = (id, color) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, color } : note)));
  };

  const startDrag = (e, id) => {
    e.preventDefault();
    const note = notes.find((n) => n.id === id);
    const startX = e.clientX - note.position.x;
    const startY = e.clientY - note.position.y;

    const handleDrag = (e) => {
      const x = e.clientX - startX;
      const y = e.clientY - startY;

      setNotes(
        notes.map((note) =>
          note.id === id ? { ...note, position: { x, y } } : note
        )
      );
    };

    const stopDrag = () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", stopDrag);
    };

    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  return (
    <div className="h-[500px] md:h-[340px] w-[400px] z-auto bg-black bg-opacity-50 p-4 rounded-lg shadow-lg overflow-scroll">
      <h2 className="text-white">Sticky Notes</h2>

      <button className="add-note-btn" onClick={() => setIsAddingNote(true)}>
        + Add New Note
      </button>

      {isAddingNote && (
        <div className="w-full p-4 bg-white rounded-lg mt-4">
          <textarea
            value={newNote.text}
            onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}
            placeholder="Write your note here..."
            className="w-full h-20 p-2 border border-gray-300 rounded-lg mb-2"
            autoFocus
          />
          <div className="color-picker">
            {colors.map((color) => (
              <div
                key={color}
                className="color-option"
                style={{ backgroundColor: color }}
                onClick={() => setNewNote({ ...newNote, color })}
              >
                {newNote.color === color && <span>✓</span>}
              </div>
            ))}
          </div>
          <div className="note-actions">
            <button onClick={addNote}>Save</button>
            <button onClick={() => setIsAddingNote(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="notes-container">
        {notes.map((note) => (
          <div
            key={note.id}
            className="sticky-note"
            style={{
              backgroundColor: note.color,
              left: `${note.position.x}px`,
              top: `${note.position.y}px`,
            }}
            onMouseDown={(e) => startDrag(e, note.id)}
          >
            <textarea
              value={note.text}
              onChange={(e) => updateNote(note.id, e.target.value)}
            />
            <div className="note-footer">
              <div className="color-picker">
                {colors.map((color) => (
                  <div
                    key={color}
                    className="color-option"
                    style={{ backgroundColor: color }}
                    onClick={() => changeColor(note.id, color)}
                  >
                    {note.color === color && <span>✓</span>}
                  </div>
                ))}
              </div>
              <button
                className="delete-btn"
                onClick={() => deleteNote(note.id)}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StickyNotes;
