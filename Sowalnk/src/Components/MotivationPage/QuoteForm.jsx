import React, { useState } from 'react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Gif, Grid } from '@giphy/react-components';
import EmojiPicker from 'emoji-picker-react';

const giphyFetch = new GiphyFetch('YOUR_GIPHY_API_KEY');

function QuoteForm({ currentUser, onPost }) {
  const [text, setText] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [image, setImage] = useState(null);
  const [gif, setGif] = useState(null);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [gifSearchTerm, setGifSearchTerm] = useState('');
  const maxChars = 280;
  const defaultAvatar = 'https://via.placeholder.com/40/cccccc/ffffff?text=User';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text || text.length > maxChars) return;

    const hashtagArray = hashtags
      .trim()
      .split(/\s+/)
      .map((h) => (h.startsWith('#') ? h : `#${h}`))
      .filter((h) => h.length > 1);

    const newQuote = {
      text,
      hashtags: hashtagArray,
      image: image || (gif ? gif.images.original.url : null),
    };

    if (onPost) onPost(newQuote);

    setText('');
    setHashtags('');
    setImage(null);
    setGif(null);
    setShowGifPicker(false);
    setShowEmojiPicker(false);
    setGifSearchTerm('');
  };

  const handleEmojiClick = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
  };

  const fetchGifs = (offset) => {
    if (gifSearchTerm) {
      return giphyFetch.search(gifSearchTerm, { offset, limit: 10 });
    }
    return giphyFetch.trending({ offset, limit: 10 });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-lg bg-white text-black max-w-lg mx-auto transform transition-all duration-300 border border-gray-200 shadow-sm">
      <div className="flex items-start space-x-4">
        <img
          src={currentUser?.avatar || defaultAvatar}
          alt="Avatar"
          className="w-12 h-12 rounded-full border-2 border-gray-300"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening?"
          className="flex-1 p-3 bg-transparent text-black placeholder-gray-500 text-lg focus:outline-none resize-none border-b border-gray-300 hover:border-gray-400 transition-colors"
          rows="4"
        />
      </div>
      <div className="mt-3">
        <input
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          placeholder="#motivation #inspire"
          className="w-full p-3 bg-transparent text-black placeholder-gray-500 text-base focus:outline-none border-b border-gray-300 hover:border-gray-400 transition-colors"
        />
      </div>
      {(image || gif) && (
        <div className="relative mt-4">
          {image ? (
            <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-lg shadow-sm" />
          ) : (
            <Gif gif={gif} width="100%" className="rounded-lg shadow-sm" />
          )}
          <button
            type="button"
            onClick={() => {
              setImage(null);
              setGif(null);
            }}
            className="absolute top-2 right-2 bg-gray-200 text-black rounded-full p-1.5 hover:bg-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <div className="flex items-center space-x-4 mt-3">
        <label className="cursor-pointer">
          <svg className="w-6 h-6 text-indigo-500 hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files[0]) {
                setImage(URL.createObjectURL(e.target.files[0]));
                setGif(null);
              }
            }}
            className="hidden"
          />
        </label>
        <button
          type="button"
          onClick={() => {
            setShowGifPicker(!showGifPicker);
            setShowEmojiPicker(false);
          }}
          className="text-indigo-500 hover:text-indigo-400 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => {
            setShowEmojiPicker(!showEmojiPicker);
            setShowGifPicker(false);
          }}
          className="text-indigo-500 hover:text-indigo-400 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      {showGifPicker && (
        <div className="mt-3 bg-white rounded-lg p-3 max-h-48 overflow-y-auto border border-gray-200 shadow-sm">
          <input
            type="text"
            placeholder="Search GIFs..."
            value={gifSearchTerm}
            onChange={(e) => setGifSearchTerm(e.target.value)}
            className="w-full p-2 mb-2 bg-gray-50 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-gray-200"
          />
          <Grid
            width={400}
            columns={2}
            gutter={6}
            fetchGifs={fetchGifs}
            onGifClick={(gif, e) => {
              e.preventDefault();
              setGif(gif);
              setImage(null);
              setShowGifPicker(false);
            }}
            className="rounded-lg"
          />
        </div>
      )}
      {showEmojiPicker && (
        <div className="mt-3 max-h-48 overflow-y-auto bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
          <EmojiPicker onEmojiClick={handleEmojiClick} width="100%" />
        </div>
      )}
      <div className="flex justify-between items-center mt-4">
        <span className={`text-sm font-medium ${text.length > maxChars ? 'text-red-500 animate-pulse' : 'text-gray-500'}`}>
          {text.length}/{maxChars}
        </span>
        <button
          type="submit"
          disabled={text.length > maxChars || !text}
          className="bg-indigo-500 text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-indigo-600 disabled:bg-gray-300 disabled:text-gray-500 transition-all duration-200 transform hover:scale-105"
        >
          Post
        </button>
      </div>
    </form>
  );
}

export default QuoteForm;