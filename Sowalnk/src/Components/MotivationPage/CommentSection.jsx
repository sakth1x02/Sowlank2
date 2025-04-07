import React, { useState } from 'react';

function CommentSection({ comments, addComment }) {
  const [commentText, setCommentText] = useState('');
  const defaultAvatar = 'https://via.placeholder.com/40/cccccc/ffffff?text=User';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(commentText);
    setCommentText('');
  };

  return (
    <div className="mt-2 border-t border-gray-200 pt-2">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Reply to this quote..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600">
          Reply
        </button>
      </form>
      <div className="mt-2 space-y-2">
        {comments.map((c) => (
          <div key={c.id} className="flex items-start space-x-2">
            <img
              src={c.user.avatar || defaultAvatar}
              alt="Avatar"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <span className="font-semibold text-gray-800">{c.user.username || 'Anonymous'}</span>
              <p className="text-gray-700 text-sm">{c.text || 'No comment text'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;