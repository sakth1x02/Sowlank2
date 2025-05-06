import React, { useState } from "react";
import CommentSection from "./CommentSection";
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  PaperAirplaneIcon,
  BookmarkIcon,
  EllipsisHorizontalIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from "@heroicons/react/24/solid";

function QuoteCard({ quote, currentUser, isFollowing, onFollow, onUnfollow }) {
  const [showComments, setShowComments] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(quote.likes || 0);
  const [repostsCount, setRepostsCount] = useState(quote.reposts || 0);
  const [comments, setComments] = useState(quote.comments || []);
  const defaultAvatar =
    "https://via.placeholder.com/40/cccccc/ffffff?text=User";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(quote.text);
    alert("Quote copied to clipboard!");
    setShowOptions(false);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleRepost = () => {
    setIsReposted(!isReposted);
    setRepostsCount((prev) => (isReposted ? prev - 1 : prev + 1));
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // In a real app, this would call a prop function to handle saved state
  };

  const handleAddComment = (commentText) => {
    const newComment = {
      id: Date.now(),
      user: currentUser || { username: "Anonymous", avatar: defaultAvatar },
      text: commentText,
      timestamp: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
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
    const text = encodeURIComponent(
      `${quote.text} - Check out this quote! ${url}`
    );
    const shareUrls = {
      whatsapp: `https://api.whatsapp.com/send?text=${text}`,
      x: `https://twitter.com/intent/tweet?text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
    };
    window.open(shareUrls[platform], "_blank");
    setShowShareMenu(false);
  };

  const formatTimeAgo = (timestamp) => {
    // Simple time ago formatter - in a real app use a library
    return "2h ago";
  };

  const isOwnQuote =
    currentUser?.id && quote.user?.id && currentUser.id === quote.user.id;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Post header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-full overflow-hidden ring-2 ring-indigo-500 p-[2px] bg-gradient-to-tr from-yellow-400 to-purple-500">
            <img
              src={quote.user.avatar || defaultAvatar}
              alt={quote.user.username}
              className="h-full w-full rounded-full object-cover border-2 border-white"
            />
          </div>
          <div className="ml-3">
            <span className="font-semibold text-[15px] text-gray-900">
              {quote.user.username || "Anonymous"}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isOwnQuote && (
            <button
              onClick={handleFollowToggle}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                isFollowing
                  ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="text-gray-700 p-1 hover:bg-gray-100 rounded-full"
            >
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </button>

            {showOptions && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10 animate-fade-in">
                <button
                  onClick={copyToClipboard}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Copy text
                </button>
                <button
                  onClick={() => {
                    setShowOptions(false);
                    // Report functionality would go here
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quote content */}
      <div className="px-4 pt-3 pb-2">
        <p className="text-gray-800 text-[15px] leading-relaxed">
          {quote.text}
        </p>

        {/* Hashtags */}
        {quote.hashtags && quote.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {quote.hashtags.map((h) => (
              <span
                key={h}
                className="text-indigo-600 text-sm hover:underline cursor-pointer"
              >
                #{h}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Image if available */}
      {quote.image && (
        <div className="mt-2 border-t border-b border-gray-100">
          <img
            src={quote.image}
            alt="Quote visual"
            className="w-full object-cover"
            style={{ maxHeight: "480px" }}
          />
        </div>
      )}

      {/* Actions */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center -ml-2 space-x-2">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                isLiked ? "text-red-500" : "text-gray-700"
              }`}
            >
              {isLiked ? (
                <HeartIconSolid className="h-6 w-6 scale-110 transition-transform" />
              ) : (
                <HeartIcon className="h-6 w-6" />
              )}
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
            >
              <ChatBubbleLeftIcon className="h-6 w-6 -scale-x-100" />
            </button>

            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
            >
              <PaperAirplaneIcon className="h-6 w-6 rotate-45" />
            </button>

            {showShareMenu && (
              <div className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-10 py-2 w-48 animate-fade-in">
                {["whatsapp", "x", "facebook"].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => shareTo(platform)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 capitalize flex items-center"
                  >
                    <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs font-bold mr-3">
                      {platform[0].toUpperCase()}
                    </span>
                    Share to {platform}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
              isSaved ? "text-black" : "text-gray-700"
            }`}
          >
            {isSaved ? (
              <BookmarkIconSolid className="h-6 w-6" />
            ) : (
              <BookmarkIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Likes count */}
        {likesCount > 0 && (
          <div className="mt-1 mb-1">
            <span className="font-semibold text-sm">
              {likesCount} {likesCount === 1 ? "like" : "likes"}
            </span>
          </div>
        )}

        {/* Timestamp */}
        <div className="mb-2">
          <span className="text-gray-500 text-[10px] uppercase tracking-wide">
            {formatTimeAgo(quote.timestamp)}
          </span>
        </div>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="border-t border-gray-100 px-4 py-2">
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
