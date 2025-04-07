import React from 'react';
import QuoteCard from './QuoteCard';

function SavedQuotes({ savedQuotes, likeQuote, repostQuote, saveQuote, addComment }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Saved Quotes
        </h2>
        {savedQuotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No saved quotes yet.</p>
            <p className="text-gray-400 mt-2">Start saving your favorite quotes from the Home page!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {savedQuotes.map((quote) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                likeQuote={likeQuote}
                repostQuote={repostQuote}
                saveQuote={saveQuote}
                addComment={addComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedQuotes;