import { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import MessageBubble from './MessageBubble';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  isSentByUser: boolean;
}

export default function ChatInterface({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);
    setSocket(newSocket);

    newSocket.emit('join-room', roomId);
    
    newSocket.on('message-history', (history: Message[]) => {
      setMessages(history);
    });

    newSocket.on('new-message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() && socket) {
      const messageData = {
        text: newMessage,
        roomId,
        sender: 'user123', // Replace with actual user ID
        isSentByUser: true,
        timestamp: new Date().toISOString(),
      };
      
      socket.emit('send-message', messageData);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg bg-white shadow-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-alama-primary"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-alama-primary hover:bg-alama-secondary text-white rounded-lg transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}