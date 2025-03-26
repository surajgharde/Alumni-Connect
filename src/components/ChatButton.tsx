import { Button, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ChatButtonProps {
  userId: number;
  size?: 'sm' | 'md' | 'lg';
  isIconOnly?: boolean;
}

/**
 * Button component that navigates to a message conversation with a specific user
 */
export default function ChatButton({ userId, size = 'md', isIconOnly = false }: ChatButtonProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Start conversation with this user
  const handleStartConversation = () => {
    if (isAuthenticated) {
      navigate(`/messages/${userId}`);
    } else {
      navigate('/login');
    }
  };
  
  if (isIconOnly || isMobile) {
    return (
      <IconButton
        aria-label="Message this alumni"
        icon={<ChatIcon />}
        size={size}
        colorScheme="blue"
        onClick={handleStartConversation}
      />
    );
  }
  
  return (
    <Button
      leftIcon={<ChatIcon />}
      size={size}
      colorScheme="blue"
      onClick={handleStartConversation}
    >
      Message
    </Button>
  );
} 