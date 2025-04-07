import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  TrashIcon,
  ArchiveBoxIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { fetchUsers } from '../../store/user-slice'; // Ensure correct path
import { Loader } from 'lucide-react';

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
  users 
}) {
  const authData = useSelector((state) => state.user.loggedInUser);
  const allUsers = useSelector((state) => state.user.users);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for showing followers/following modals
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers())
      .then(() => setIsLoading(false))
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [dispatch]);

  // Find the current user from Redux store
  const currentUser = allUsers.find((user) => user._id === authData?._id);

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    currentUser?.name || 'User'
  )}&background=random`;

  // Filter quotes for the current user
  const userQuotes = quotes.filter(q => q.user.username === (currentUser?.name || 'Anonymous'));

  // Get followers and following users
  const followers = users.filter(user => currentUser?.followers?.includes(user.id) || []);
  const following = users.filter(user => currentUser?.following?.includes(user.id) || []);

  const handleFollowToggle = (userId) => {
    if (currentUser?.following?.includes(userId)) {
      onUnfollow(userId);
    } else {
      onFollow(userId);
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <Loader className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        <span className="text-lg font-medium">Back to Feed</span>
      </button>

      <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-gray-100">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <img
              src={currentUser.avatar || defaultAvatar}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-md"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {currentUser.name || 'Anonymous'}
              </h1>
              <p className="text-gray-600 mt-2">{currentUser.email}</p>
              <div className="flex gap-4 mt-3">
                <span className="text-sm text-gray-500">
                  <strong>{userQuotes.length}</strong> Posts
                </span>
                <span
                  onClick={() => setShowFollowersModal(true)}
                  className="text-sm text-gray-500 cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <strong>{followers.length}</strong> Followers
                </span>
                <span
                  onClick={() => setShowFollowingModal(true)}
                  className="text-sm text-gray-500 cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <strong>{following.length}</strong> Following
                </span>
                <span className="text-sm text-gray-500">
                  <strong>{savedQuotes.length}</strong> Saved
                </span>
                <span className="text-sm text-gray-500">
                  <strong>{archivedQuotes.length}</strong> Archived
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Followers Modal */}
      {showFollowersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Followers</h2>
              <button
                onClick={() => setShowFollowersModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {followers.length === 0 ? (
              <p className="text-gray-500 text-center">No followers yet.</p>
            ) : (
              <div className="space-y-4">
                {followers.map(user => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || defaultAvatar}
                        alt={user.username}
                        className="w-10 h-10 rounded-full border-2 border-indigo-500"
                      />
                      <span className="text-gray-800 font-medium">{user.username}</span>
                    </div>
                    <button
                      onClick={() => handleFollowToggle(user.id)}
                      className={`px-4 py-1 rounded-full font-medium text-sm transition-all duration-200 ${
                        currentUser.following.includes(user.id)
                          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {currentUser.following.includes(user.id) ? 'Following' : 'Follow'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Following</h2>
              <button
                onClick={() => setShowFollowingModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {following.length === 0 ? (
              <p className="text-gray-500 text-center">Not following anyone yet.</p>
            ) : (
              <div className="space-y-4">
                {following.map(user => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || defaultAvatar}
                        alt={user.username}
                        className="w-10 h-10 rounded-full border-2 border-indigo-500"
                      />
                      <span className="text-gray-800 font-medium">{user.username}</span>
                    </div>
                    <button
                      onClick={() => handleFollowToggle(user.id)}
                      className={`px-4 py-1 rounded-full font-medium text-sm transition-all duration-200 ${
                        currentUser.following.includes(user.id)
                          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {currentUser.following.includes(user.id) ? 'Following' : 'Follow'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Quotes</h2>
        {userQuotes.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500">You haven't posted any quotes yet.</p>
          </div>
        ) : (
          userQuotes.map(quote => (
            <div
              key={quote.id}
              className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              <p className="text-gray-800 font-serif italic text-lg mb-4">"{quote.text}"</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {quote.hashtags?.map(h => (
                  <span
                    key={h}
                    className="text-indigo-600 text-sm font-medium bg-indigo-100 px-2 py-1 rounded-full"
                  >
                    #{h}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-500 text-sm">
                  {new Date(quote.timestamp).toLocaleString()}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => onArchive(quote.id)}
                    className="flex items-center gap-1 text-gray-600 hover:text-yellow-500 transition-colors"
                    title="Archive quote"
                  >
                    <ArchiveBoxIcon className="h-5 w-5" />
                    <span className="text-sm">Archive</span>
                  </button>
                  <button
                    onClick={() => onDelete(quote.id)}
                    className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
                    title="Delete quote"
                  >
                    <TrashIcon className="h-5 w-5" />
                    <span className="text-sm">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {archivedQuotes.length > 0 && (
        <div className="mt-8 grid gap-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Archived Quotes</h2>
          {archivedQuotes.map(quote => (
            <div
              key={quote.id}
              className="bg-gray-50 p-6 rounded-xl shadow border border-gray-200 opacity-75 hover:opacity-100 transition-all duration-300"
            >
              <p className="text-gray-700 font-serif italic text-lg mb-4">"{quote.text}"</p>
              <div className="flex justify-between items-center">
                <p className="text-gray-500 text-sm">
                  {new Date(quote.timestamp).toLocaleString()}
                </p>
                <button
                  onClick={() => onUnarchive(quote.id)}
                  className="flex items-center gap-1 text-gray-600 hover:text-indigo-500 transition-colors"
                  title="Unarchive quote"
                >
                  <ArchiveBoxIcon className="h-5 w-5" />
                  <span className="text-sm">Unarchive</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;