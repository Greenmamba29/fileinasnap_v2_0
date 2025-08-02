
import React, { useState } from 'react';

const JournalPage = () => {
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: '2025-08-02',
      title: 'My Productive Day',
      content: 'Today I organized all my photos from the summer vacation. The AI helped me create amazing memories!',
      tags: ['productivity', 'photos', 'vacation']
    },
    {
      id: 2,
      date: '2025-08-01',
      title: 'FileInASnap Journey',
      content: 'Started using FileInASnap today. The interface is intuitive and the AI suggestions are spot on.',
      tags: ['technology', 'organization']
    }
  ]);

  const [newEntry, setNewEntry] = useState({ title: '', content: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newEntry.title && newEntry.content) {
      const entry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        title: newEntry.title,
        content: newEntry.content,
        tags: ['new']
      };
      setEntries([entry, ...entries]);
      setNewEntry({ title: '', content: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">📝 Journal</h1>
          <p className="text-lg text-gray-600">Capture your thoughts and let AI help organize your memories</p>
        </div>

        {/* New Entry Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">New Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Entry title..."
                value={newEntry.title}
                onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <textarea
                placeholder="What's on your mind today?"
                value={newEntry.content}
                onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
            <div className="flex space-x-4">
              <button 
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                💾 Save Entry
              </button>
              <button 
                type="button"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                🤖 AI Analyze
              </button>
            </div>
          </form>
        </div>

        {/* Journal Entries */}
        <div className="space-y-6">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{entry.title}</h3>
                <span className="text-sm text-gray-500">{entry.date}</span>
              </div>
              <p className="text-gray-700 mb-4">{entry.content}</p>
              <div className="flex space-x-2">
                {entry.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex space-x-4">
          <a href="/" className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            ← Back to Home
          </a>
          <a href="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            📊 Dashboard
          </a>
          <a href="/timeline" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            📸 Memory Timeline
          </a>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
