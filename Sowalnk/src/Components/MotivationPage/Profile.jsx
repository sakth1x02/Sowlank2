import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  TrashIcon,
  ArchiveBoxIcon,
  ArrowLeftIcon,
  Cog6ToothIcon,
  UserPlusIcon,
  UserMinusIcon,
  PlusIcon,
  BookmarkIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Loader } from "lucide-react";

function Profile({
  quotes,
  savedQuotes,
  archivedQuotes,
  onBack,
  onDelete,
  onArchive,
  onUnarchive,
  onFollow,
  onUnfollow,
  users,
}) {
  const authData = useSelector((state) => state?.user?.loggedInUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  // For demo purposes, use current user from props if Redux store is not available
  const currentUser = authData || users.find((user) => user.id === "user1");

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    currentUser?.name || currentUser?.username || "User"
  )}&background=random`;

  // Filter quotes for the current user
  const userQuotes = quotes.filter(
    (q) => q.user?.username === (currentUser?.name || currentUser?.username)
  );

  // Get followers and following users
  const followers = users.filter(
    (user) => currentUser?.followers?.includes(user.id) || []
  );
  const following = users.filter(
    (user) => currentUser?.following?.includes(user.id) || []
  );

  const handleFollowToggle = (userId) => {
    if (currentUser?.following?.includes(userId)) {
      onUnfollow(userId);
    } else {
      onFollow(userId);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <Loader className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 mt-2">
            {userQuotes.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-400 mb-2">No posts yet</p>
                <button
                  onClick={() => {}}
                  className="flex items-center gap-2 bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium"
                >
                  <PlusIcon className="h-4 w-4" />
                  Create Your First Post
                </button>
              </div>
            ) : (
              userQuotes.map((quote) => (
                <div key={quote.id} className="relative aspect-square">
                  {quote.image ? (
                    <img
                      src={quote.image}
                      alt={quote.text}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
                      <p className="text-gray-800 text-sm line-clamp-4 text-center">
                        "{quote.text}"
                      </p>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                    <div className="flex gap-6 text-white">
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 mr-1"
                          fill="white"
                          viewBox="0 0 24 24"
                          stroke="none"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        {quote.likes}
                      </span>
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        {quote.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case "saved":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 mt-2">
            {savedQuotes.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
                <BookmarkIcon className="h-10 w-10 text-gray-300 mb-2" />
                <p className="text-gray-400">No saved quotes</p>
              </div>
            ) : (
              savedQuotes.map((quote) => (
                <div key={quote.id} className="relative aspect-square">
                  {quote.image ? (
                    <img
                      src={quote.image}
                      alt={quote.text}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
                      <p className="text-gray-800 text-sm line-clamp-4 text-center">
                        "{quote.text}"
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        );

      case "archived":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 mt-2">
            {archivedQuotes.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
                <ArchiveBoxIcon className="h-10 w-10 text-gray-300 mb-2" />
                <p className="text-gray-400">No archived quotes</p>
              </div>
            ) : (
              archivedQuotes.map((quote) => (
                <div key={quote.id} className="relative aspect-square group">
                  {quote.image ? (
                    <img
                      src={quote.image}
                      alt={quote.text}
                      className="w-full h-full object-cover opacity-70"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4 opacity-70">
                      <p className="text-gray-700 text-sm line-clamp-4 text-center">
                        "{quote.text}"
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => onUnarchive(quote.id)}
                    className="absolute bottom-2 right-2 bg-white bg-opacity-70 text-gray-700 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArchiveBoxIcon className="h-5 w-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white pb-16">
      <div className="sticky top-0 bg-white z-10 px-4 py-2 border-b border-gray-200 flex items-center">
        <button onClick={onBack} className="mr-4 text-gray-800">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="font-semibold text-xl">
          {currentUser?.name || currentUser?.username || "Profile"}
        </h1>
        <button className="ml-auto text-gray-800">
          <Cog6ToothIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="p-4">
        {/* Profile header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start">
          <div className="mb-4 sm:mb-0 sm:mr-8">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden ring-2 ring-gray-200 p-[2px] bg-gradient-to-tr from-yellow-400 to-purple-500">
              <img
                src={currentUser?.avatar || defaultAvatar}
                alt="Profile"
                className="h-full w-full rounded-full object-cover border-2 border-white"
              />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center mb-4">
              <h2 className="text-xl font-semibold mb-1 sm:mb-0">
                {currentUser?.username || currentUser?.name || "Anonymous"}
              </h2>
              <div className="sm:ml-auto flex justify-center sm:justify-start gap-2">
                <button className="px-4 py-1.5 rounded bg-gray-100 text-sm font-medium">
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="flex justify-center sm:justify-start text-sm gap-6 mb-4">
              <div>
                <span className="font-semibold">{userQuotes.length}</span> posts
              </div>
              <button
                onClick={() => setShowFollowersModal(true)}
                className="focus:outline-none"
              >
                <span className="font-semibold">{followers.length}</span>{" "}
                followers
              </button>
              <button
                onClick={() => setShowFollowingModal(true)}
                className="focus:outline-none"
              >
                <span className="font-semibold">{following.length}</span>{" "}
                following
              </button>
            </div>

            <div className="text-sm">
              {currentUser?.email && (
                <p className="text-gray-700">{currentUser.email}</p>
              )}
              <p className="mt-1 text-gray-800 max-w-md">
                Sharing daily motivation and inspiration. Join me on this
                journey!
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200 mt-6 flex text-center">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-3 flex justify-center items-center gap-1.5 border-t transition-colors ${
              activeTab === "posts"
                ? "border-gray-800 -mt-px"
                : "border-transparent text-gray-500"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span className="text-xs uppercase font-semibold tracking-wider hidden sm:inline">
              Posts
            </span>
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`flex-1 py-3 flex justify-center items-center gap-1.5 border-t transition-colors ${
              activeTab === "saved"
                ? "border-gray-800 -mt-px"
                : "border-transparent text-gray-500"
            }`}
          >
            <BookmarkIcon className="h-4 w-4" />
            <span className="text-xs uppercase font-semibold tracking-wider hidden sm:inline">
              Saved
            </span>
          </button>

          <button
            onClick={() => setActiveTab("archived")}
            className={`flex-1 py-3 flex justify-center items-center gap-1.5 border-t transition-colors ${
              activeTab === "archived"
                ? "border-gray-800 -mt-px"
                : "border-transparent text-gray-500"
            }`}
          >
            <ArchiveBoxIcon className="h-4 w-4" />
            <span className="text-xs uppercase font-semibold tracking-wider hidden sm:inline">
              Archived
            </span>
          </button>
        </div>

        {/* Tab content */}
        {renderTabContent()}
      </div>

      {/* Followers Modal */}
      {showFollowersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[70vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Followers</h3>
              <button onClick={() => setShowFollowersModal(false)}>
                <XMarkIcon className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {followers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No followers yet
                </p>
              ) : (
                <div className="space-y-4">
                  {followers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || defaultAvatar}
                          alt={user.username}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {user.username}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleFollowToggle(user.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                          currentUser?.following?.includes(user.id)
                            ? "bg-gray-200 text-gray-800"
                            : "bg-indigo-600 text-white"
                        }`}
                      >
                        {currentUser?.following?.includes(user.id)
                          ? "Following"
                          : "Follow"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[70vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Following</h3>
              <button onClick={() => setShowFollowingModal(false)}>
                <XMarkIcon className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {following.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Not following anyone yet
                </p>
              ) : (
                <div className="space-y-4">
                  {following.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || defaultAvatar}
                          alt={user.username}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {user.username}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleFollowToggle(user.id)}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium bg-gray-200 text-gray-800"
                      >
                        Following
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
