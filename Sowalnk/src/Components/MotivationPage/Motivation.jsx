import React, { useState, useEffect } from "react";
import QuoteCard from "./QuoteCard";
import QuoteForm from "./QuoteForm";
import Profile from "./Profile";
import SavedQuotes from "./SavedQuote";
import {
  HomeIcon,
  BookmarkIcon,
  UserIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import logo from "./logo.jpg";

function Motivation() {
  const [quotes, setQuotes] = useState([]);
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("latest");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState("home");
  const [archivedQuotes, setArchivedQuotes] = useState([]);

  // Track all users in the app (for demo purposes)
  const [users, setUsers] = useState([
    {
      id: "user1",
      username: "MotivatorX",
      avatar: "/images/timeManagement.png",
      followers: [],
      following: ["user3"],
    },
    {
      id: "user2",
      username: "InspireBot",
      avatar: "/images/timeManagement.png",
      followers: ["user3"],
      following: [],
    },
    {
      id: "user3",
      username: "QuoteMaster",
      avatar: "/images/timeManagement.png",
      followers: ["user1"],
      following: ["user2"],
    },
  ]);

  const defaultAvatar =
    "https://via.placeholder.com/40/cccccc/ffffff?text=User";
  const currentUser = users.find((user) => user.id === "user1"); // Current user is MotivatorX

  useEffect(() => {
    const dailyQuote = "Rise today, conquer tomorrow.";
    if (Notification.permission === "granted") {
      new Notification("Daily Motivation", { body: dailyQuote });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Daily Motivation", { body: dailyQuote });
        }
      });
    }

    // Add sample quotes
    setQuotes([
      {
        id: 1,
        text: "The only way to do great work is to love what you do.",
        user: users.find((user) => user.id === "user2"), // InspireBot
        likes: 0,
        reposts: 0,
        comments: [],
        timestamp: new Date("2025-03-31T10:33:00").toISOString(),
      },
      {
        id: 2,
        text: "Believe you can and you're halfway there.",
        user: currentUser, // MotivatorX
        likes: 0,
        reposts: 0,
        comments: [],
        timestamp: new Date("2025-03-31T10:30:00").toISOString(),
      },
    ]);
  }, []);

  const addQuote = (newQuote) => {
    setQuotes((prevQuotes) => [
      {
        ...newQuote,
        id: Date.now(),
        likes: 0,
        reposts: 0,
        comments: [],
        user: currentUser,
        timestamp: new Date().toISOString(),
      },
      ...prevQuotes,
    ]);
    setIsPostModalOpen(false);
  };

  const likeQuote = (id) => {
    setQuotes(
      quotes.map((q) => (q.id === id ? { ...q, likes: q.likes + 1 } : q))
    );
  };

  const repostQuote = (id) => {
    setQuotes(
      quotes.map((q) => (q.id === id ? { ...q, reposts: q.reposts + 1 } : q))
    );
  };

  const saveQuote = (quote) => {
    if (!savedQuotes.some((q) => q.id === quote.id)) {
      setSavedQuotes([...savedQuotes, quote]);
    }
  };

  const addComment = (quoteId, comment) => {
    setQuotes(
      quotes.map((q) =>
        q.id === quoteId
          ? {
              ...q,
              comments: [
                ...q.comments,
                {
                  id: Date.now(),
                  text: comment,
                  user: {
                    username: currentUser.username,
                    avatar: currentUser.avatar,
                  },
                },
              ],
            }
          : q
      )
    );
  };

  const handleDelete = (quoteId) => {
    if (window.confirm("Are you sure you want to delete this quote?")) {
      setQuotes(quotes.filter((q) => q.id !== quoteId));
      setSavedQuotes(savedQuotes.filter((q) => q.id !== quoteId));
    }
  };

  const handleArchive = (quoteId) => {
    const quoteToArchive = quotes.find(
      (q) => q.id === quoteId && q.user.username === currentUser.username
    );
    if (quoteToArchive && !archivedQuotes.some((q) => q.id === quoteId)) {
      setArchivedQuotes([...archivedQuotes, quoteToArchive]);
      setQuotes(quotes.filter((q) => q.id !== quoteId));
    }
  };

  const handleUnarchive = (quoteId) => {
    const quoteToUnarchive = archivedQuotes.find((q) => q.id === quoteId);
    if (quoteToUnarchive) {
      setQuotes([...quotes, quoteToUnarchive]);
      setArchivedQuotes(archivedQuotes.filter((q) => q.id !== quoteId));
    }
  };

  const handleFollow = (userId) => {
    setUsers(
      users.map((user) => {
        if (user.id === currentUser.id) {
          return { ...user, following: [...user.following, userId] };
        }
        if (user.id === userId) {
          return { ...user, followers: [...user.followers, currentUser.id] };
        }
        return user;
      })
    );
  };

  const handleUnfollow = (userId) => {
    setUsers(
      users.map((user) => {
        if (user.id === currentUser.id) {
          return {
            ...user,
            following: user.following.filter((id) => id !== userId),
          };
        }
        if (user.id === userId) {
          return {
            ...user,
            followers: user.followers.filter((id) => id !== currentUser.id),
          };
        }
        return user;
      })
    );
  };

  const filteredQuotes = quotes
    .filter((q) => {
      const matchText = q.text
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchHashtag =
        q.hashtags &&
        q.hashtags.some((h) =>
          h.toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchText || matchHashtag;
    })
    .sort((a, b) => {
      if (filter === "top") return b.likes - a.likes;
      if (filter === "trending") {
        return (
          b.likes +
          b.reposts +
          b.comments.length -
          (a.likes + a.reposts + a.comments.length)
        );
      }
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

  const sortedByPopularity = [...quotes].sort(
    (a, b) =>
      b.likes +
      b.reposts +
      b.comments.length -
      (a.likes + a.reposts + a.comments.length)
  );
  const topTrending = sortedByPopularity.slice(0, 3);

  const handleTrendingClick = (quoteId) => {
    const quoteElement = document.getElementById(`quote-${quoteId}`);
    if (!quoteElement) return;
    quoteElement.scrollIntoView({ behavior: "smooth", block: "start" });
    quoteElement.classList.add("bg-yellow-100");
    setTimeout(() => quoteElement.classList.remove("bg-yellow-100"), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-80 p-6 sticky top-0 h-screen overflow-y-hidden text-black border-r border-gray-300 flex flex-col bg-white shadow-md">
        <div className="mb-8">
          <img
            src={logo}
            alt="Logo"
            className="w-20 h-20 mx-auto rounded-full shadow-sm"
          />
        </div>
        <nav className="space-y-4 flex-1">
          <button
            onClick={() => setCurrentView("home")}
            className={`flex items-center gap-4 hover:bg-indigo-50 rounded-lg px-4 py-3 w-full text-left transition-colors ${
              currentView === "home" ? "bg-indigo-100 text-indigo-600" : ""
            }`}
          >
            <HomeIcon className="h-7 w-7 text-indigo-600" />
            <span className="text-xl font-semibold text-gray-800">Home</span>
          </button>
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex items-center gap-4 hover:bg-indigo-50 rounded-lg px-4 py-3 w-full text-left transition-colors"
          >
            <PencilSquareIcon className="h-7 w-7 text-indigo-600" />
            <span className="text-xl font-semibold text-gray-800">Post</span>
          </button>
          <button
            onClick={() => setCurrentView("saved")}
            className={`flex items-center gap-4 hover:bg-indigo-50 rounded-lg px-4 py-3 w-full text-left transition-colors ${
              currentView === "saved" ? "bg-indigo-100 text-indigo-600" : ""
            }`}
          >
            <BookmarkIcon className="h-7 w-7 text-indigo-600" />
            <span className="text-xl font-semibold text-gray-800">
              Saved Quotes
            </span>
          </button>
          <button
            onClick={() => setCurrentView("profile")}
            className={`flex items-center gap-4 hover:bg-indigo-50 rounded-lg px-4 py-3 w-full text-left transition-colors ${
              currentView === "profile" ? "bg-indigo-100 text-indigo-600" : ""
            }`}
          >
            <UserIcon className="h-7 w-7 text-indigo-600" />
            <span className="text-xl font-semibold text-gray-800">Profile</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto flex flex-col">
        {currentView === "home" && (
          <>
            <div className="flex-1 p-6">
              {filteredQuotes.length === 0 ? (
                <p className="text-gray-500 text-center mt-6 text-lg">
                  No quotes yet—start posting!
                </p>
              ) : (
                filteredQuotes.map((quote) => (
                  <div
                    key={quote.id}
                    id={`quote-${quote.id}`}
                    className="mb-6 max-w-2xl mx-auto"
                  >
                    <QuoteCard
                      quote={quote}
                      currentUser={currentUser}
                      isFollowing={currentUser.following.includes(
                        quote.user.id
                      )}
                      onFollow={handleFollow}
                      onUnfollow={handleUnfollow}
                    />
                  </div>
                ))
              )}
            </div>
            <nav className="fixed bottom-0 left-0 right-0 bg-white p-3 shadow-lg flex justify-around md:hidden">
              <button
                onClick={() => setCurrentView("home")}
                className="text-gray-700 hover:text-indigo-600 text-2xl"
              >
                🏠
              </button>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="text-gray-700 hover:text-indigo-600 text-2xl"
              >
                ✍️
              </button>
              <button
                onClick={() => setCurrentView("saved")}
                className="text-gray-700 hover:text-indigo-600 text-2xl"
              >
                ⭐
              </button>
              <button
                onClick={() => setCurrentView("profile")}
                className="text-gray-700 hover:text-indigo-600 text-2xl"
              >
                👤
              </button>
            </nav>
          </>
        )}

        {currentView === "saved" && (
          <div className="flex-1 p-6">
            <SavedQuotes savedQuotes={savedQuotes} />
          </div>
        )}

        {currentView === "profile" && (
          <Profile
            currentUser={currentUser}
            quotes={quotes}
            savedQuotes={savedQuotes}
            archivedQuotes={archivedQuotes}
            onBack={() => setCurrentView("home")}
            onDelete={handleDelete}
            onArchive={handleArchive}
            onUnarchive={handleUnarchive}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
            users={users}
          />
        )}
      </main>

      {/* Right Sidebar for Home View */}
      {currentView === "home" && (
        <aside className="w-96 p-6 sticky top-0 h-screen overflow-y-auto border-l border-gray-300 hidden lg:flex flex-col gap-6 bg-white shadow-lg">
          <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200">
            <input
              type="text"
              placeholder="Search inspirational quotes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-full focus:outline-none focus:ring-4 focus:ring-indigo-300 text-lg transition-all"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full mt-4 p-4 border border-gray-300 rounded-full bg-white text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 text-lg transition-all"
            >
              <option value="latest">Latest</option>
              <option value="top">Top Liked</option>
              <option value="trending">Trending</option>
            </select>
          </div>

          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-5 rounded-2xl shadow-md border border-gray-200">
            <h3 className="text-2xl font-bold mb-4 text-indigo-800">
              Trending Now
            </h3>
            {topTrending.length === 0 ? (
              <p className="text-gray-400 text-lg">No trending quotes yet.</p>
            ) : (
              <div className="flex flex-col space-y-4">
                {topTrending.map((quote) => (
                  <div
                    key={quote.id}
                    onClick={() => handleTrendingClick(quote.id)}
                    className="cursor-pointer hover:bg-indigo-200 p-4 rounded-xl transition-colors"
                  >
                    <p className="text-lg font-medium text-gray-800 line-clamp-2">
                      "{quote.text}"
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-gray-600">
                        {quote.likes} Likes
                      </span>
                      <span className="text-sm text-gray-600">
                        {quote.reposts} Reposts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Post Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 hover:scale-100">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-t-xl flex justify-between items-center">
              <h2 className="text-white text-xl font-semibold">
                Share Your Motivation
              </h2>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="text-white hover:text-gray-200 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <QuoteForm currentUser={currentUser} onPost={addQuote} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Motivation;
