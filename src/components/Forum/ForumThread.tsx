// components/Forum/ForumThread.tsx
interface ForumThreadProps {
    title: string;
    author: string;
    commentCount: number;
    timestamp: string;
  }
  
  export default function ForumThread({ 
    title, 
    author, 
    commentCount, 
    timestamp 
  }: ForumThreadProps) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex items-center text-sm text-gray-500">
          <span>By {author}</span>
          <span className="mx-2">•</span>
          <span>{commentCount} comments</span>
          <span className="mx-2">•</span>
          <span>{timestamp}</span>
        </div>
      </div>
    );
  }