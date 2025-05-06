import React from "react";
import QuoteCard from "./QuoteCard";
import { BookmarkIcon } from "@heroicons/react/24/solid";

function SavedQuotes({
  savedQuotes,
  likeQuote,
  repostQuote,
  saveQuote,
  addComment,
}) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen pb-20">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm px-4 py-3 mb-4 flex items-center">
        <BookmarkIcon className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Saved Quotes
        </h2>
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-2xl">
        {savedQuotes.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white/50 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 mt-8">
            <div className="mb-6">
              <BookmarkIcon className="h-16 w-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No saved quotes yet
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              When you save quotes from your feed, they'll appear here for easy
              access.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {savedQuotes.map((quote) => (
              <div
                key={quote.id}
                className="transform transition-all duration-300 hover:-translate-y-1"
              >
                <QuoteCard
                  quote={quote}
                  likeQuote={likeQuote}
                  repostQuote={repostQuote}
                  saveQuote={saveQuote}
                  addComment={addComment}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedQuotes;
