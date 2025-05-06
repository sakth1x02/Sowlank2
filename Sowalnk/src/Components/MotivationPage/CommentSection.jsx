import React, { useState, useRef, useEffect } from "react";
import {
  PaperAirplaneIcon,
  FaceSmileIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

function CommentSection({ comments, addComment }) {
  const [commentText, setCommentText] = useState("");
  const [likedComments, setLikedComments] = useState({});
  const defaultAvatar =
    "https://via.placeholder.com/40/cccccc/ffffff?text=User";
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(commentText);
    setCommentText("");
  };

  const toggleLike = (commentId) => {
    setLikedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const formatTimeAgo = (timestamp) => {
    // Simple time ago formatter - in a real app, use a library
    return "2h ago";
  };

  return (
    <div className="mt-1 pt-2">
      <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 pr-1 mb-3">
        {comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map((c) => (
              <div
                key={c.id}
                className="flex items-start group animate-fade-in"
              >
                <img
                  src={c.user.avatar || defaultAvatar}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full mr-3 object-cover border border-gray-200"
                />
                <div className="flex-1">
                  <div className="bg-gray-50 px-3 py-2 rounded-xl">
                    <span className="font-semibold text-gray-900 text-sm">
                      {c.user.username || "Anonymous"}
                    </span>
                    <p className="text-gray-800 text-sm">
                      {c.text || "No comment text"}
                    </p>
                  </div>
                  <div className="flex items-center mt-1 ml-1 text-xs text-gray-500">
                    <span className="mr-3">{formatTimeAgo(c.timestamp)}</span>
                    <button
                      onClick={() => toggleLike(c.id)}
                      className="mr-3 hover:text-gray-700"
                    >
                      {likedComments[c.id] ? (
                        <HeartSolid className="w-3 h-3 text-red-500" />
                      ) : (
                        <HeartIcon className="w-3 h-3" />
                      )}
                    </button>
                    <button className="hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-sm py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center space-x-2 mt-2 border-t border-gray-100 pt-3"
      >
        <img
          src={defaultAvatar}
          alt="Your avatar"
          className="w-8 h-8 rounded-full object-cover hidden sm:block"
        />
        <div className="relative flex-1 flex items-center">
          <input
            ref={inputRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 py-2 px-4 pr-12 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          />
          <button
            type="button"
            className="absolute right-12 text-indigo-500 hover:text-indigo-600"
          >
            <FaceSmileIcon className="w-5 h-5" />
          </button>
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="absolute right-3 text-indigo-500 hover:text-indigo-700 disabled:text-gray-300 transition-colors"
          >
            <PaperAirplaneIcon className="w-5 h-5 transform rotate-90" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default CommentSection;
