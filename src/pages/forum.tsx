import { useState } from 'react';
import ForumThread from '@/components/Forum/ForumThread';

const mockThreads = [
  {
    id: 1,
    title: "Career transition tips?",
    author: "Sarah Johnson",
    comments: 15,
    timestamp: "2h ago"
  },
  // Add more mock threads...
];

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Discussion Forum</h1>
        <input
          type="text"
          placeholder="Search discussions..."
          className="border rounded-lg px-4 py-2 w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {mockThreads.map((thread) => (
          <ForumThread
            key={thread.id}
            title={thread.title}
            author={thread.author}
            commentCount={thread.comments}
            timestamp={thread.timestamp}
          />
        ))}
      </div>
    </div>
  );
}