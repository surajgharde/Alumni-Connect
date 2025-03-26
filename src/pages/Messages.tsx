import {
  Box,
  Container,
  Heading,
  Text,
  Divider,
  Flex,
  Avatar,
  HStack,
  Badge,
  Input,
  IconButton,
  VStack,
  List,
  ListItem,
  useColorModeValue,
  Tabs,
  TabList,
  Tab, 
  TabPanels,
  TabPanel,
  useBreakpointValue
} from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChatService, Message, Conversation } from '../services/ChatService';
import { DatabaseService, UserProfile } from '../services/DatabaseService';
import { ArrowBackIcon } from '@chakra-ui/icons';

// Custom send icon since it's not provided by Chakra directly
const SendIcon = (props: any) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
      fill="currentColor"
    />
  </svg>
);

interface ConversationItemProps {
  profile: UserProfile;
  lastMessage?: Message;
  isSelected: boolean;
  hasUnread: boolean;
  onClick: () => void;
}

const ConversationItem = ({ profile, lastMessage, isSelected, hasUnread, onClick }: ConversationItemProps) => {
  const bg = useColorModeValue('gray.100', 'gray.700');
  const selectedBg = useColorModeValue('blue.100', 'blue.700');
  
  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  return (
    <ListItem
      p={3}
      borderRadius="md"
      cursor="pointer"
      bg={isSelected ? selectedBg : 'transparent'}
      _hover={{ bg: isSelected ? selectedBg : bg }}
      onClick={onClick}
    >
      <HStack spacing={3} align="center">
        <Avatar size="md" name={profile.name} src={profile.image} />
        <Box flex="1" overflow="hidden">
          <HStack justifyContent="space-between" mb={1}>
            <Text fontWeight={hasUnread ? "bold" : "normal"}>
              {profile.name}
            </Text>
            {lastMessage && (
              <Text fontSize="xs" color="gray.500">
                {formatTime(lastMessage.timestamp)}
              </Text>
            )}
          </HStack>
          {lastMessage ? (
            <Text
              fontSize="sm"
              noOfLines={1}
              color={hasUnread ? "black" : "gray.500"}
              fontWeight={hasUnread ? "semibold" : "normal"}
            >
              {lastMessage.content}
            </Text>
          ) : (
            <Text fontSize="sm" color="gray.500">
              No messages yet
            </Text>
          )}
        </Box>
        {hasUnread && (
          <Badge colorScheme="blue" borderRadius="full">
            New
          </Badge>
        )}
      </HStack>
    </ListItem>
  );
};

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessageBubble = ({ message, isCurrentUser }: MessageBubbleProps) => {
  const bubbleBg = useColorModeValue(
    isCurrentUser ? 'blue.500' : 'gray.100',
    isCurrentUser ? 'blue.500' : 'gray.700'
  );
  const textColor = useColorModeValue(
    isCurrentUser ? 'white' : 'black',
    isCurrentUser ? 'white' : 'white'
  );
  
  // Format timestamp
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Box
      alignSelf={isCurrentUser ? 'flex-end' : 'flex-start'}
      maxW="70%"
      mb={2}
    >
      <Box
        bg={bubbleBg}
        color={textColor}
        p={3}
        borderRadius="lg"
        borderBottomRightRadius={isCurrentUser ? 0 : undefined}
        borderBottomLeftRadius={!isCurrentUser ? 0 : undefined}
      >
        <Text>{message.content}</Text>
      </Box>
      <Text
        fontSize="xs"
        color="gray.500"
        textAlign={isCurrentUser ? 'right' : 'left'}
        mt={1}
      >
        {formatTime(message.timestamp)}
        {isCurrentUser && message.isRead && (
          <Text as="span" ml={1}>
            • Read
          </Text>
        )}
      </Text>
    </Box>
  );
};

export default function Messages() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<{conversation: Conversation; participant: UserProfile}[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(id ? Number(id) : null);
  const [selectedUserProfile, setSelectedUserProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [showConversations, setShowConversations] = useState(true);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Load user conversations
  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const userConversations = await ChatService.getUserConversations(user.id);
        setConversations(userConversations);
        
        // If no conversation is selected and we have conversations, select the first one
        if (!selectedUserId && userConversations.length > 0) {
          setSelectedUserId(userConversations[0].participant.id);
          setSelectedUserProfile(userConversations[0].participant);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConversations();
  }, [user, selectedUserId]);
  
  // Load selected conversation
  useEffect(() => {
    const loadConversation = async () => {
      if (!user || !selectedUserId) return;
      
      try {
        // Get conversation messages
        const conversationMessages = await ChatService.getConversation(user.id, selectedUserId);
        setMessages(conversationMessages);
        
        // Mark messages as read
        await ChatService.markAsRead(user.id, selectedUserId);
        
        // Get user profile if not already loaded
        if (!selectedUserProfile) {
          const userProfile = await DatabaseService.getUserProfile(selectedUserId);
          if (userProfile) {
            setSelectedUserProfile(userProfile);
          }
        }
        
        // On mobile, show conversation instead of list
        if (isMobile && selectedUserId) {
          setShowConversations(false);
        }
      } catch (error) {
        console.error('Error loading conversation:', error);
      }
    };
    
    loadConversation();
  }, [user, selectedUserId, selectedUserProfile, isMobile]);
  
  // Handle selecting a conversation
  const handleSelectConversation = (userId: number, profile: UserProfile) => {
    setSelectedUserId(userId);
    setSelectedUserProfile(profile);
    
    // Update URL without reloading
    navigate(`/messages/${userId}`, { replace: true });
    
    // On mobile, show conversation instead of list
    if (isMobile) {
      setShowConversations(false);
    }
  };
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!user || !selectedUserId || !newMessage.trim()) return;
    
    try {
      // Send message
      const sentMessage = await ChatService.sendMessage(
        user.id,
        selectedUserId,
        newMessage.trim()
      );
      
      // Update local state
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      
      // Reload conversations to update last message
      const userConversations = await ChatService.getUserConversations(user.id);
      setConversations(userConversations);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  // Handle pressing Enter to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Handle back button on mobile
  const handleBackToList = () => {
    setShowConversations(true);
  };
  
  // Check if a conversation has unread messages
  const hasUnreadMessages = (conversation: Conversation) => {
    if (!user) return false;
    
    return conversation.messages.some(
      message => message.recipientId === user.id && !message.isRead
    );
  };
  
  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>Messages</Heading>
      
      {isMobile ? (
        // Mobile view with tabs
        <Box>
          {showConversations ? (
            // Show conversation list on mobile
            <Box>
              <Heading size="md" mb={4}>Conversations</Heading>
              <List spacing={2}>
                {conversations.map(({ conversation, participant }) => (
                  <ConversationItem
                    key={participant.id}
                    profile={participant}
                    lastMessage={conversation.messages[conversation.messages.length - 1]}
                    isSelected={selectedUserId === participant.id}
                    hasUnread={hasUnreadMessages(conversation)}
                    onClick={() => handleSelectConversation(participant.id, participant)}
                  />
                ))}
                {conversations.length === 0 && !isLoading && (
                  <Text textAlign="center" py={8} color="gray.500">
                    No conversations yet
                  </Text>
                )}
              </List>
            </Box>
          ) : (
            // Show selected conversation on mobile
            <Box>
              {selectedUserProfile && (
                <>
                  <HStack mb={4} spacing={4}>
                    <IconButton
                      aria-label="Back to conversations"
                      icon={<ArrowBackIcon />}
                      onClick={handleBackToList}
                    />
                    <Avatar size="md" name={selectedUserProfile.name} src={selectedUserProfile.image} />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold">{selectedUserProfile.name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {selectedUserProfile.position} at {selectedUserProfile.company}
                      </Text>
                    </VStack>
                  </HStack>
                  <Divider mb={4} />
                  
                  <Box
                    height="calc(100vh - 300px)"
                    overflowY="auto"
                    px={2}
                    mb={4}
                  >
                    <VStack spacing={4} align="stretch">
                      {messages.length === 0 ? (
                        <Text textAlign="center" py={8} color="gray.500">
                          No messages yet. Start the conversation!
                        </Text>
                      ) : (
                        messages.map(message => (
                          <MessageBubble
                            key={message.id}
                            message={message}
                            isCurrentUser={user?.id === message.senderId}
                          />
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </VStack>
                  </Box>
                  
                  <HStack spacing={2}>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyPress={handleKeyPress}
                    />
                    <IconButton
                      colorScheme="blue"
                      aria-label="Send message"
                      icon={<SendIcon />}
                      onClick={handleSendMessage}
                      isDisabled={!newMessage.trim()}
                    />
                  </HStack>
                </>
              )}
            </Box>
          )}
        </Box>
      ) : (
        // Desktop view with split layout
        <Flex
          direction={{ base: 'column', md: 'row' }}
          height="calc(100vh - 200px)"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
        >
          {/* Conversation list */}
          <Box
            width={{ base: '100%', md: '350px' }}
            borderRightWidth={{ base: 0, md: '1px' }}
            height="100%"
            overflowY="auto"
            p={4}
          >
            <Heading size="md" mb={4}>Conversations</Heading>
            <List spacing={2}>
              {conversations.map(({ conversation, participant }) => (
                <ConversationItem
                  key={participant.id}
                  profile={participant}
                  lastMessage={conversation.messages[conversation.messages.length - 1]}
                  isSelected={selectedUserId === participant.id}
                  hasUnread={hasUnreadMessages(conversation)}
                  onClick={() => handleSelectConversation(participant.id, participant)}
                />
              ))}
              {conversations.length === 0 && !isLoading && (
                <Text textAlign="center" py={8} color="gray.500">
                  No conversations yet
                </Text>
              )}
            </List>
          </Box>
          
          {/* Chat area */}
          <Box flex="1" height="100%" display="flex" flexDirection="column">
            {selectedUserProfile ? (
              <>
                <HStack p={4} borderBottomWidth="1px" spacing={4}>
                  <Avatar size="md" name={selectedUserProfile.name} src={selectedUserProfile.image} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">{selectedUserProfile.name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {selectedUserProfile.position} at {selectedUserProfile.company}
                    </Text>
                  </VStack>
                </HStack>
                
                <Box flex="1" overflowY="auto" p={4}>
                  <VStack spacing={4} align="stretch">
                    {messages.length === 0 ? (
                      <Text textAlign="center" py={8} color="gray.500">
                        No messages yet. Start the conversation!
                      </Text>
                    ) : (
                      messages.map(message => (
                        <MessageBubble
                          key={message.id}
                          message={message}
                          isCurrentUser={user?.id === message.senderId}
                        />
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </VStack>
                </Box>
                
                <Box p={4} borderTopWidth="1px">
                  <HStack spacing={2}>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyPress={handleKeyPress}
                    />
                    <IconButton
                      colorScheme="blue"
                      aria-label="Send message"
                      icon={<SendIcon />}
                      onClick={handleSendMessage}
                      isDisabled={!newMessage.trim()}
                    />
                  </HStack>
                </Box>
              </>
            ) : (
              <Flex
                height="100%"
                alignItems="center"
                justifyContent="center"
                p={8}
              >
                <Text color="gray.500" textAlign="center">
                  Select a conversation to start chatting
                </Text>
              </Flex>
            )}
          </Box>
        </Flex>
      )}
    </Container>
  );
} 