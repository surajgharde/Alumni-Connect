/**
 * This is a mock chat service that uses localStorage for persistence.
 * In a real application, this would be replaced with actual API calls to a backend server.
 */

import { UserProfile } from './DatabaseService';

export interface Message {
  id: string;
  senderId: number;
  recipientId: number;
  content: string;
  timestamp: number;
  isRead: boolean;
}

export interface Conversation {
  participantIds: number[];
  messages: Message[];
  lastMessageTimestamp: number;
}

// Helper function to generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Helper function to get all conversations from localStorage
const getConversations = (): Record<string, Conversation> => {
  const conversations = localStorage.getItem('conversations');
  return conversations ? JSON.parse(conversations) : {};
};

// Helper function to save conversations to localStorage
const saveConversations = (conversations: Record<string, Conversation>): void => {
  localStorage.setItem('conversations', JSON.stringify(conversations));
};

// Helper function to get the conversation key for two users
const getConversationKey = (userId1: number, userId2: number): string => {
  // Sort IDs to ensure consistency
  const sortedIds = [userId1, userId2].sort((a, b) => a - b);
  return `${sortedIds[0]}_${sortedIds[1]}`;
};

export const ChatService = {
  /**
   * Send a message to another user
   */
  sendMessage: (senderId: number, recipientId: number, content: string): Promise<Message> => {
    return new Promise((resolve) => {
      // Get existing conversations
      const conversations = getConversations();
      
      // Generate a key for this conversation
      const conversationKey = getConversationKey(senderId, recipientId);
      
      // Create new message
      const newMessage: Message = {
        id: generateId(),
        senderId,
        recipientId,
        content,
        timestamp: Date.now(),
        isRead: false
      };
      
      // Update or create conversation
      if (conversations[conversationKey]) {
        conversations[conversationKey].messages.push(newMessage);
        conversations[conversationKey].lastMessageTimestamp = newMessage.timestamp;
      } else {
        conversations[conversationKey] = {
          participantIds: [senderId, recipientId],
          messages: [newMessage],
          lastMessageTimestamp: newMessage.timestamp
        };
      }
      
      // Save updated conversations
      saveConversations(conversations);
      
      // Simulate network delay
      setTimeout(() => {
        resolve(newMessage);
      }, 300);
    });
  },
  
  /**
   * Get all messages between the current user and another user
   */
  getConversation: (userId1: number, userId2: number): Promise<Message[]> => {
    return new Promise((resolve) => {
      // Get existing conversations
      const conversations = getConversations();
      
      // Generate a key for this conversation
      const conversationKey = getConversationKey(userId1, userId2);
      
      // Get messages from this conversation or return empty array
      const messages = conversations[conversationKey]?.messages || [];
      
      // Simulate network delay
      setTimeout(() => {
        resolve(messages);
      }, 300);
    });
  },
  
  /**
   * Mark messages as read for a specific conversation
   */
  markAsRead: (currentUserId: number, otherUserId: number): Promise<void> => {
    return new Promise((resolve) => {
      // Get existing conversations
      const conversations = getConversations();
      
      // Generate a key for this conversation
      const conversationKey = getConversationKey(currentUserId, otherUserId);
      
      // If conversation exists, mark unread messages as read
      if (conversations[conversationKey]) {
        const messages = conversations[conversationKey].messages;
        let updated = false;
        
        messages.forEach(message => {
          // Only mark messages from the other user as read
          if (message.senderId === otherUserId && !message.isRead) {
            message.isRead = true;
            updated = true;
          }
        });
        
        // Save if any changes were made
        if (updated) {
          saveConversations(conversations);
        }
      }
      
      // Simulate network delay
      setTimeout(() => {
        resolve();
      }, 200);
    });
  },
  
  /**
   * Get all conversations for a user
   */
  getUserConversations: (userId: number): Promise<{conversation: Conversation; participant: UserProfile}[]> => {
    return new Promise((resolve) => {
      // Get existing conversations
      const allConversations = getConversations();
      const userConversations: {conversation: Conversation; participant: UserProfile}[] = [];
      
      // Get all user profiles for participant info
      const allProfiles = JSON.parse(localStorage.getItem('allUserProfiles') || '[]');
      
      // Filter conversations that include the user
      Object.keys(allConversations).forEach(key => {
        const conversation = allConversations[key];
        
        if (conversation.participantIds.includes(userId)) {
          // Find the other participant
          const otherParticipantId = conversation.participantIds.find(id => id !== userId);
          
          if (otherParticipantId) {
            // Find the profile of the other participant
            const participantProfile = allProfiles.find((profile: UserProfile) => profile.id === otherParticipantId);
            
            if (participantProfile) {
              userConversations.push({
                conversation,
                participant: participantProfile
              });
            }
          }
        }
      });
      
      // Sort by most recent message
      userConversations.sort((a, b) => b.conversation.lastMessageTimestamp - a.conversation.lastMessageTimestamp);
      
      // Simulate network delay
      setTimeout(() => {
        resolve(userConversations);
      }, 300);
    });
  },
  
  /**
   * Get count of unread messages for a user
   */
  getUnreadCount: (userId: number): Promise<number> => {
    return new Promise((resolve) => {
      // Get existing conversations
      const conversations = getConversations();
      let unreadCount = 0;
      
      // Count unread messages across all conversations
      Object.values(conversations).forEach(conversation => {
        if (conversation.participantIds.includes(userId)) {
          conversation.messages.forEach(message => {
            // Only count messages sent to this user that are unread
            if (message.recipientId === userId && !message.isRead) {
              unreadCount++;
            }
          });
        }
      });
      
      // Simulate network delay
      setTimeout(() => {
        resolve(unreadCount);
      }, 200);
    });
  }
}; 