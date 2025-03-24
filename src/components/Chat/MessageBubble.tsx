interface MessageBubbleProps {
    message: {
      id: string;
      text: string;
      sender: string;
      timestamp: string;
      isSentByUser: boolean;
    };
  }
  
  export default function MessageBubble({ message }: MessageBubbleProps) {
    return (
      <div className={`flex ${message.isSentByUser ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-[75%] rounded-lg p-3 ${
            message.isSentByUser
              ? 'bg-alama-primary text-white'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {!message.isSentByUser && (
            <p className="text-xs font-medium text-gray-500 mb-1">
              {message.sender}
            </p>
          )}
          <p className="break-words">{message.text}</p>
          <p className="text-xs mt-1 opacity-70 text-right">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    );
  }