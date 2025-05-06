import React, { useState } from "react";
import {
  PhotoIcon,
  FaceSmileIcon,
  GifIcon,
  XMarkIcon,
  HashtagIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import EmojiPicker from "emoji-picker-react";

function QuoteForm({ currentUser, onPost }) {
  const [text, setText] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [image, setImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showHashtagInput, setShowHashtagInput] = useState(false);
  const maxChars = 280;
  const defaultAvatar =
    "https://via.placeholder.com/40/cccccc/ffffff?text=User";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text || text.length > maxChars) return;

    setIsSubmitting(true);

    const hashtagArray = hashtags
      .trim()
      .split(/\s+|,+/)
      .map((h) => (h.startsWith("#") ? h.substring(1) : h))
      .filter((h) => h.length > 0);

    const newQuote = {
      text,
      hashtags: hashtagArray,
      image: image,
    };

    if (onPost) onPost(newQuote);

    setText("");
    setHashtags("");
    setImage(null);
    setShowEmojiPicker(false);
    setShowHashtagInput(false);
    setIsSubmitting(false);
  };

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* User avatar and textarea */}
      <div className="flex">
        <div className="mr-3">
          <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-indigo-500 p-[2px] bg-gradient-to-tr from-yellow-400 to-purple-500">
            <img
              src={currentUser?.avatar || defaultAvatar}
              alt="Your avatar"
              className="h-full w-full rounded-full object-cover border-2 border-white"
            />
          </div>
        </div>

        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            className={`w-full resize-none border-0 focus:ring-0 text-gray-900 placeholder-gray-500 text-lg bg-transparent`}
            rows="3"
            maxLength={maxChars}
          />

          <div className="text-right text-xs text-gray-500 -mt-2">
            {text.length}/{maxChars}
          </div>
        </div>
      </div>

      {/* Image preview */}
      {image && (
        <div className="relative mt-2 rounded-xl overflow-hidden bg-gray-100">
          <img
            src={image}
            alt="Selected"
            className="w-full h-60 object-cover"
          />
          <button
            type="button"
            onClick={() => setImage(null)}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-opacity"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Hashtag input */}
      {showHashtagInput && (
        <div className="relative flex items-center ml-12">
          <HashtagIcon className="h-5 w-5 text-indigo-500 absolute left-2" />
          <input
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="Add hashtags separated by spaces"
            className="pl-9 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          />
        </div>
      )}

      {/* Emoji picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-0 z-10">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(false)}
              className="absolute -right-2 -top-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300 z-10"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width={300}
              height={350}
            />
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 pt-3 mt-2">
        <div className="flex items-center space-x-2 mb-3 sm:mb-0">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
          >
            <FaceSmileIcon className="h-6 w-6" />
          </button>

          <label className="cursor-pointer p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
            <PhotoIcon className="h-6 w-6" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setImage(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
          </label>

          <button
            type="button"
            onClick={() => setShowHashtagInput(!showHashtagInput)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
          >
            <HashtagIcon className="h-6 w-6" />
          </button>
        </div>

        <button
          type="submit"
          disabled={!text.trim() || text.length > maxChars || isSubmitting}
          className={`px-5 py-2 flex items-center gap-2 rounded-full font-medium ${
            !text.trim() || text.length > maxChars || isSubmitting
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          } text-white transition-colors`}
        >
          <span>Post</span>
          <PaperAirplaneIcon className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

export default QuoteForm;
