import React, { useState, useEffect, useRef } from "react";
import QuoteCard from "./QuoteCard";
import QuoteForm from "./QuoteForm";
import Profile from "./Profile";
import SavedQuotes from "./SavedQuote";
import {
  HomeIcon,
  BookmarkIcon,
  UserIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeSolid,
  BookmarkIcon as BookmarkSolid,
  UserIcon as UserSolid,
} from "@heroicons/react/24/solid";
import logo from "./logo.jpg";

function Motivation() {
  const [quotes, setQuotes] = useState([]);
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("latest");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState("home");
  const [archivedQuotes, setArchivedQuotes] = useState([]);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef(null);

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
        likes: 42,
        reposts: 18,
        comments: [],
        timestamp: new Date("2025-03-31T10:33:00").toISOString(),
      },
      {
        id: 2,
        text: "Believe you can and you're halfway there.",
        user: currentUser, // MotivatorX
        likes: 25,
        reposts: 5,
        comments: [],
        timestamp: new Date("2025-03-31T10:30:00").toISOString(),
      },
      {
        id: 3,
        text: "Everything you can imagine is real.",
        user: users.find((user) => user.id === "user3"), // QuoteMaster
        likes: 65,
        reposts: 24,
        comments: [
          {
            id: 101,
            user: {
              username: "InspireBot",
              avatar: "/images/timeManagement.png",
            },
            text: "So inspirational!",
          },
        ],
        timestamp: new Date("2025-03-30T15:30:00").toISOString(),
        hashtags: ["imagination", "creativity"],
        image:
          "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070",
      },
    ]);
  }, []);

  // Focus search input when mobile search is shown
  useEffect(() => {
    if (showMobileSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showMobileSearch]);

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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white z-20 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1 text-gray-700"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <img src={logo} alt="Sowalnk Logo" className="h-8" />

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="p-1 text-gray-700"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            <button
              onClick={() => setIsPostModalOpen(true)}
              className="p-1 text-gray-700"
            >
              <PencilSquareIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {showMobileSearch && (
          <div className="p-2 border-t border-gray-200 animate-slide-down">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search quotes and hashtags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 bg-gray-100 rounded-full text-sm"
              />
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-500" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed inset-0 z-30 lg:hidden ${
          isMobileMenuOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div className="absolute top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={currentUser?.avatar || defaultAvatar}
                alt="Profile"
                className="h-8 w-8 rounded-full border border-gray-300"
              />
              <span className="font-semibold">{currentUser?.username}</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            <button
              onClick={() => {
                setCurrentView("home");
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-4 w-full p-3 rounded-lg ${
                currentView === "home"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {currentView === "home" ? (
                <HomeSolid className="h-6 w-6" />
              ) : (
                <HomeIcon className="h-6 w-6" />
              )}
              <span className="text-lg">Home</span>
            </button>

            <button
              onClick={() => {
                setCurrentView("saved");
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-4 w-full p-3 rounded-lg ${
                currentView === "saved"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {currentView === "saved" ? (
                <BookmarkSolid className="h-6 w-6" />
              ) : (
                <BookmarkIcon className="h-6 w-6" />
              )}
              <span className="text-lg">Saved</span>
            </button>

            <button
              onClick={() => {
                setCurrentView("profile");
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-4 w-full p-3 rounded-lg ${
                currentView === "profile"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {currentView === "profile" ? (
                <UserSolid className="h-6 w-6" />
              ) : (
                <UserIcon className="h-6 w-6" />
              )}
              <span className="text-lg">Profile</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 sticky top-0 h-screen overflow-y-auto bg-white border-r border-gray-200">
        <div className="p-5 flex items-center gap-3 border-b border-gray-100">
          <img src={logo} alt="Logo" className="h-10 w-10 rounded-lg" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Sowalnk
          </h1>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => setCurrentView("home")}
            className={`flex items-center gap-4 w-full p-3 rounded-lg ${
              currentView === "home"
                ? "bg-indigo-50 text-indigo-600 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {currentView === "home" ? (
              <HomeSolid className="h-6 w-6" />
            ) : (
              <HomeIcon className="h-6 w-6" />
            )}
            <span className="text-lg">Home</span>
          </button>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex items-center gap-4 w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <PencilSquareIcon className="h-6 w-6" />
            <span className="text-lg">Create</span>
          </button>

          <button
            onClick={() => setCurrentView("saved")}
            className={`flex items-center gap-4 w-full p-3 rounded-lg ${
              currentView === "saved"
                ? "bg-indigo-50 text-indigo-600 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {currentView === "saved" ? (
              <BookmarkSolid className="h-6 w-6" />
            ) : (
              <BookmarkIcon className="h-6 w-6" />
            )}
            <span className="text-lg">Saved</span>
          </button>

          <button
            onClick={() => setCurrentView("profile")}
            className={`flex items-center gap-4 w-full p-3 rounded-lg ${
              currentView === "profile"
                ? "bg-indigo-50 text-indigo-600 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {currentView === "profile" ? (
              <UserSolid className="h-6 w-6" />
            ) : (
              <UserIcon className="h-6 w-6" />
            )}
            <span className="text-lg">Profile</span>
          </button>
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-4">
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100">
            <img
              src={currentUser?.avatar || defaultAvatar}
              alt="Profile"
              className="h-8 w-8 rounded-full border border-gray-300"
            />
            <span className="text-gray-800 truncate">
              {currentUser?.username || "Anonymous"}
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 ${
          !showMobileSearch ? "pt-12" : "pt-24"
        } lg:pt-0 h-screen overflow-y-auto flex flex-col`}
      >
        {currentView === "home" && (
          <div className="flex-1 p-2 sm:p-4 pb-20">
            {filteredQuotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                  <HeartIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium">
                  No quotes yet
                </p>
                <p className="text-gray-400 mt-1">
                  Be the first to share something!
                </p>
              </div>
            ) : (
              <div className="max-w-xl mx-auto space-y-6">
                {filteredQuotes.map((quote) => (
                  <div
                    key={quote.id}
                    id={`quote-${quote.id}`}
                    className="animate-fade-in"
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
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === "saved" && (
          <div className="flex-1">
            <SavedQuotes
              savedQuotes={savedQuotes}
              likeQuote={likeQuote}
              repostQuote={repostQuote}
              saveQuote={saveQuote}
              addComment={addComment}
            />
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

        {/* Mobile bottom navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-around lg:hidden z-20">
          <button
            onClick={() => setCurrentView("home")}
            className="flex flex-col items-center"
          >
            {currentView === "home" ? (
              <HomeSolid className="h-6 w-6 text-indigo-600" />
            ) : (
              <HomeIcon className="h-6 w-6 text-gray-700" />
            )}
          </button>

          <button
            onClick={() => setCurrentView("saved")}
            className="flex flex-col items-center"
          >
            {currentView === "saved" ? (
              <BookmarkSolid className="h-6 w-6 text-indigo-600" />
            ) : (
              <BookmarkIcon className="h-6 w-6 text-gray-700" />
            )}
          </button>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex flex-col items-center -mt-5"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-full">
              <PencilSquareIcon className="h-6 w-6 text-white" />
            </div>
          </button>

          <button
            onClick={() => setCurrentView("profile")}
            className="flex flex-col items-center"
          >
            {currentView === "profile" ? (
              <UserSolid className="h-6 w-6 text-indigo-600" />
            ) : (
              <UserIcon className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </nav>
      </main>

      {/* Right Sidebar for Home View */}
      {currentView === "home" && (
        <aside className="hidden xl:block w-80 sticky top-0 h-screen overflow-y-auto border-l border-gray-200 bg-white p-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search quotes and hashtags"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2.5 pl-10 bg-gray-100 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-500" />
            </div>
            <div className="mt-3 flex rounded-full bg-gray-100 p-1">
              <button
                onClick={() => setFilter("latest")}
                className={`flex-1 py-1.5 px-3 text-sm rounded-full ${
                  filter === "latest"
                    ? "bg-white shadow text-indigo-900 font-medium"
                    : "text-gray-600"
                }`}
              >
                Latest
              </button>
              <button
                onClick={() => setFilter("top")}
                className={`flex-1 py-1.5 px-3 text-sm rounded-full ${
                  filter === "top"
                    ? "bg-white shadow text-indigo-900 font-medium"
                    : "text-gray-600"
                }`}
              >
                Top
              </button>
              <button
                onClick={() => setFilter("trending")}
                className={`flex-1 py-1.5 px-3 text-sm rounded-full ${
                  filter === "trending"
                    ? "bg-white shadow text-indigo-900 font-medium"
                    : "text-gray-600"
                }`}
              >
                Trending
              </button>
            </div>
          </div>

          {/* Trending */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-bold text-lg mb-3">Trending Now</h3>

            {topTrending.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center">
                No trending quotes yet
              </p>
            ) : (
              <div className="space-y-3">
                {topTrending.map((quote) => (
                  <div
                    key={quote.id}
                    className="bg-white p-3 rounded-xl shadow-sm cursor-pointer hover:bg-indigo-50 transition-colors"
                    onClick={() => {
                      document
                        .getElementById(`quote-${quote.id}`)
                        ?.scrollIntoView({
                          behavior: "smooth",
                        });
                    }}
                  >
                    <p className="line-clamp-2 text-sm text-gray-800">
                      "{quote.text}"
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1.5">
                        <img
                          src={quote.user.avatar || defaultAvatar}
                          alt={quote.user.username}
                          className="h-5 w-5 rounded-full"
                        />
                        <span className="text-xs text-gray-600">
                          {quote.user.username}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center text-xs text-gray-500">
                          <HeartIcon className="h-3 w-3 mr-1" />
                          {quote.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Suggested Users */}
          <div className="mt-6">
            <h3 className="font-bold text-lg mb-3">Suggested for you</h3>
            <div className="space-y-3">
              {users
                .filter(
                  (u) =>
                    !currentUser.following.includes(u.id) &&
                    u.id !== currentUser.id
                )
                .map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={user.avatar || defaultAvatar}
                        alt={user.username}
                        className="h-8 w-8 rounded-full border border-gray-200"
                      />
                      <span className="text-sm font-medium">
                        {user.username}
                      </span>
                    </div>
                    <button
                      onClick={() => handleFollow(user.id)}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      Follow
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </aside>
      )}

      {/* Post Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 p-4">
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-scale-in overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 flex justify-between items-center">
              <h2 className="text-white font-semibold px-2">Create Post</h2>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <QuoteForm currentUser={currentUser} onPost={addQuote} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Motivation;
