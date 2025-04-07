import React, { useState } from 'react';
import CommentSection from './CommentSection';
import {
  HeartIcon,
  ArrowPathRoundedSquareIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ArrowUpTrayIcon,
  BookmarkIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

function QuoteCard({ quote, currentUser, isFollowing, onFollow, onUnfollow }) {
  const [showComments, setShowComments] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [likesCount, setLikesCount] = useState(quote.likes || 0);
  const [repostsCount, setRepostsCount] = useState(quote.reposts || 0);
  const [comments, setComments] = useState(quote.comments || []);
  const [isSaved, setIsSaved] = useState(false);
  const defaultAvatar = 'https://via.placeholder.com/40/cccccc/ffffff?text=User';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(quote.text);
    alert('Quote copied to clipboard!');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleRepost = () => {
    setIsReposted(!isReposted);
    setRepostsCount(prev => isReposted ? prev - 1 : prev + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    alert(isSaved ? 'Quote unsaved!' : 'Quote saved!');
  };

  const handleAddComment = (commentText) => {
    const newComment = {
      id: Date.now(),
      user: currentUser || { username: 'Anonymous', avatar: defaultAvatar },
      text: commentText,
    };
    setComments(prev => [...prev, newComment]);
  };

  const handleFollowToggle = () => {
    if (isFollowing) {
      onUnfollow(quote.user.id);
    } else {
      onFollow(quote.user.id);
    }
  };

  const shareTo = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${quote.text} - Check out this quote! ${url}`);
    const shareUrls = {
      whatsapp: `https://api.whatsapp.com/send?text=${text}`,
      x: `https://twitter.com/intent/tweet?text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
    };
    window.open(shareUrls[platform], '_blank');
    setShowShareMenu(false);
  };

  const isOwnQuote = currentUser?.id && quote.user?.id && currentUser.id === quote.user.id;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-200 shadow-lg max-w-2xl mx-auto my-8 overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl">
      <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <img
            src={quote.user.avatar || defaultAvatar}
            alt="Avatar"
            className="w-12 h-12 rounded-full border-2 border-indigo-500 shadow-md object-cover transition-transform hover:scale-110"
          />
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {quote.user.username || 'Anonymous'}
            </h2>
            <p className="text-xs text-gray-400 tracking-wide">
              {new Date(quote.timestamp).toLocaleString([], {
                hour: '2-digit',
                minute: '2-digit',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isOwnQuote && (
            <button
              onClick={handleFollowToggle}
              className={`px-4 py-1 rounded-full font-medium text-sm transition-all duration-200 ${
                isFollowing ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
          <button
            onClick={copyToClipboard}
            title="Copy quote"
            className="p-2 rounded-full bg-indigo-50 hover:bg-indigo-100 transition-colors"
          >
            <ClipboardDocumentIcon className="w-5 h-5 text-indigo-600" />
          </button>
        </div>
      </div>
      <div className="relative p-6 bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
        <blockquote className="text-gray-900 text-xl italic font-serif leading-relaxed px-6 py-4 bg-white/70 rounded-2xl shadow-md border-l-4 border-indigo-600">
          "{quote.text || 'No text available'}"
        </blockquote>
        <span className="absolute -top-6 -left-6 text-6xl text-indigo-300/50 select-none">“</span>
        <span className="absolute -bottom-6 -right-6 text-6xl text-indigo-300/50 select-none">”</span>
      </div>
      {quote.image && (
        <img
          src={quote.image}
          alt="Quote Visual"
          className="w-full h-72 object-cover mx-6 mb-6 rounded-2xl shadow-lg transition-transform hover:scale-105"
        />
      )}
      {quote.hashtags && quote.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 px-6 mb-6">
          {quote.hashtags.map((h) => (
            <span
              key={h}
              className="bg-indigo-600 text-white text-sm font-medium px-3 py-1 rounded-full hover:bg-indigo-700 transition-all cursor-pointer"
            >
              #{h}
            </span>
          ))}
        </div>
      )}
      <div className="flex justify-between items-center px-6 py-4 bg-white/80 border-t border-gray-100">
        <div className="flex items-center gap-8">
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6 transition-transform hover:rotate-12" />
            <span className="text-sm font-medium">{comments.length}</span>
          </button>
          <button
            onClick={handleRepost}
            className={`flex items-center gap-2 transition-colors ${isReposted ? 'text-green-600' : 'text-gray-600 hover:text-green-600'}`}
          >
            <ArrowPathRoundedSquareIcon className="w-6 h-6 transition-transform hover:rotate-90" />
            <span className="text-sm font-medium">{repostsCount}</span>
          </button>
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}
          >
            {isLiked ? <HeartIconSolid className="w-6 h-6 animate-pulse" /> : <HeartIcon className="w-6 h-6 transition-transform hover:scale-125" />}
            <span className="text-sm font-medium">{likesCount}</span>
          </button>
        </div>
        <div className="flex items-center gap-4 relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowUpTrayIcon className="w-6 h-6 transition-transform hover:rotate-12" />
          </button>
          {showShareMenu && (
            <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-10 animate-fade-in">
              {['whatsapp', 'x', 'facebook'].map((platform) => (
                <button
                  key={platform}
                  onClick={() => shareTo(platform)}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white transition-all capitalize"
                >
                  <span className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-xs font-bold text-gray-800">
                    {platform[0].toUpperCase()}
                  </span>
                  {platform}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={handleSave}
            className={`transition-colors ${isSaved ? 'text-yellow-500' : 'text-gray-600 hover:text-yellow-500'}`}
          >
            <BookmarkIcon className="w-6 h-6 transition-transform hover:scale-125" />
          </button>
        </div>
      </div>
      {showComments && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 animate-slide-down">
          <CommentSection
            quoteId={quote.id}
            comments={comments}
            addComment={handleAddComment}
          />
        </div>
      )}
    </div>
  );
}

export default QuoteCard;