import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import Xarrow from "react-xarrows";
// import { button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";

const StickyNote = ({
  note,
  onUpdate,
  onDelete,
  onEdit,
  onCreateLink,
  linkStartId,
  onColorChange,
}) => {
  const handleDrag = (e, data) => {
    onUpdate({ ...note, x: data.x, y: data.y });
  };

  const toggleCheckbox = (index) => {
    const lines = note.text.split("\n");
    if (
      index >= 0 &&
      index < lines.length &&
      typeof lines[index] === "string"
    ) {
      lines[index] = lines[index].startsWith("[x] ")
        ? lines[index].replace("[x] ", "[ ] ")
        : lines[index].startsWith("[ ] ")
        ? lines[index].replace("[ ] ", "[x] ")
        : lines[index];
      onUpdate({ ...note, text: lines.join("\n") });
    }
  };

  return (
    <Draggable
      handle=".handle"
      defaultPosition={{ x: note.x, y: note.y }}
      onStop={handleDrag}
    >
      <div
        id={`note-${note.id}`}
        className={`absolute w-60 min-h-48 rounded-xl p-4 shadow-md cursor-move handle border-2 ${
          linkStartId === note.id ? "border-blue-500" : "border-gray-300"
        }`}
        style={{ backgroundColor: note.color }}
      >
        <div className="flex justify-between items-center mb-2">
          <input
            className="text-md font-bold bg-transparent outline-none w-full"
            value={note.heading}
            onChange={(e) => onUpdate({ ...note, heading: e.target.value })}
          />
          <div className="flex gap-1 ml-2">
            <Pencil
              className="w-4 h-4 cursor-pointer text-gray-600"
              onClick={() => onEdit(note)}
            />
            <Trash2
              className="w-4 h-4 cursor-pointer text-red-500"
              onClick={() => onDelete(note.id)}
            />
          </div>
        </div>

        <textarea
          className="w-full h-24 bg-transparent resize-none outline-none text-sm"
          value={note.text}
          onChange={(e) => onUpdate({ ...note, text: e.target.value })}
        />

        {note.text.split("\n").map((line, index) =>
          line.startsWith("[ ] ") || line.startsWith("[x] ") ? (
            <div key={index} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={line.startsWith("[x] ")}
                onChange={() => toggleCheckbox(index)}
              />
              <span>{line.substring(4)}</span>
            </div>
          ) : null
        )}

        <div className="flex justify-end mt-2">
          <button
            onClick={() => onCreateLink(note.id)}
            className="text-xs px-2 py-1"
            variant={linkStartId === note.id ? "destructive" : "outline"}
          >
            {linkStartId === note.id ? "Cancel" : "Link"}
          </button>
        </div>
      </div>
    </Draggable>
  );
};

export default function StickyNotesBoard() {
  const [notes, setNotes] = useState([]);
  const [editNote, setEditNote] = useState(null);
  const [editText, setEditText] = useState("");
  const [links, setLinks] = useState([]);
  const [linkStartId, setLinkStartId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("sticky-notes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("sticky-notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      heading: "Sticky",
      text: "Type anything, @mention anyone\nGuru",
      color: "#cce5ff",
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
    };
    setNotes([...notes, newNote]);
  };

  const updateNote = (updatedNote) => {
    setNotes(notes.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
    setLinks(links.filter(([from, to]) => from !== id && to !== id));
  };

  const saveEdit = () => {
    if (editNote) {
      updateNote({ ...editNote, text: editText });
      setEditNote(null);
      setEditText("");
    }
  };

  const handleCreateLink = (id) => {
    if (!linkStartId) {
      setLinkStartId(id);
    } else if (linkStartId === id) {
      setLinkStartId(null);
    } else {
      const linkExists = links.some(
        ([from, to]) =>
          (from === linkStartId && to === id) ||
          (from === id && to === linkStartId)
      );
      if (!linkExists) {
        setLinks([...links, [linkStartId, id]]);
      }
      setLinkStartId(null);
    }
  };

  const handleColorChange = (id, color) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      updateNote({ ...note, color });
    }
  };

  return (
    <div
      className="w-full h-screen relative overflow-hidden bg-gray-100"
      onClick={() => linkStartId && setLinkStartId(null)}
    >
      {/* Add Note button */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3">
        <input
          type="color"
          title="Pick default color for new note"
          onChange={(e) => addNote(e.target.value)}
        />
        <button
          onClick={addNote}
          className="rounded-full w-12 h-12 p-0 bg-blue-500 hover:bg-blue-600 shadow-xl"
        >
          <Plus className="text-white" />
        </button>
      </div>

      {/* Sticky Notes */}
      {notes.map((note) => (
        <StickyNote
          key={note.id}
          note={note}
          onUpdate={updateNote}
          onDelete={deleteNote}
          onEdit={(n) => {
            setEditNote(n);
            setEditText(n.text);
          }}
          onCreateLink={handleCreateLink}
          linkStartId={linkStartId}
          onColorChange={handleColorChange}
        />
      ))}

      {/* Note Editor Popup */}
      {editNote && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Edit Note</h2>
            <textarea
              className="w-full h-40 border p-2 rounded-md mb-4"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditNote(null)} variant="outline">
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Arrows for Linked Notes */}
      {links.map(([fromId, toId], index) => (
        <Xarrow
          key={index}
          start={`note-${fromId}`}
          end={`note-${toId}`}
          color="gray"
          strokeWidth={2}
          curveness={0.2}
          dashness={false}
          headSize={4}
        />
      ))}
    </div>
  );
}
