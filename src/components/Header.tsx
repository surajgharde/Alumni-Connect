import { 
  Box, 
  Flex, 
  Text, 
  Button, 
  Stack, 
  Link, 
  useColorModeValue, 
  useDisclosure,
  IconButton,
  HStack,
  Container,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Badge
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { DatabaseService } from '../services/DatabaseService';
import { ChatService } from '../services/ChatService';

interface NavLinkProps {
  children: React.ReactNode;
  to: string;
}

const NavLink = ({ children, to }: NavLinkProps) => (
  <Link
    as={RouterLink}
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    to={to}>
    {children}
  </Link>
);

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthenticated, user, logout } = useAuth();
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    // Load user profile image if authenticated
    if (isAuthenticated && user) {
      const loadUserProfile = async () => {
        try {
          const profile = await DatabaseService.getCurrentUserProfile();
          if (profile && profile.image) {
            setUserAvatar(profile.image);
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      };
      
      loadUserProfile();
      
      // Load unread message count
      const loadUnreadCount = async () => {
        try {
          const count = await ChatService.getUnreadCount(user.id);
          setUnreadCount(count);
        } catch (error) {
          console.error("Error loading unread count:", error);
        }
      };
      
      // Load initially
      loadUnreadCount();
      
      // Set up interval to check for new messages every 30 seconds
      const interval = setInterval(loadUnreadCount, 30000);
      
      return () => clearInterval(interval);
    } else {
      setUserAvatar(undefined);
      setUnreadCount(0);
    }
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
  };

  return (
    <Box bg={useColorModeValue('white', 'gray.800')} boxShadow={'md'} px={4}>
      <Container maxW="container.xl">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box fontWeight="bold" fontSize="xl">
              <Text
                as={RouterLink}
                to="/"
                _hover={{
                  textDecoration: 'none',
                }}
              >
                Alumni Connect
              </Text>
            </Box>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/alumni">Alumni</NavLink>
              {isAuthenticated && (
                <Box position="relative">
                  <NavLink to="/messages">Messages</NavLink>
                  {unreadCount > 0 && (
                    <Badge
                      colorScheme="red"
                      borderRadius="full"
                      position="absolute"
                      top="-6px"
                      right="-6px"
                      fontSize="xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Box>
              )}
              <NavLink to="/events">Events</NavLink>
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Stack
              flex={{ base: 1, md: 0 }}
              justify={'flex-end'}
              direction={'row'}
              spacing={6}>
              {isAuthenticated ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}>
                    <Flex alignItems="center">
                      <Avatar
                        size={'sm'}
                        src={userAvatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                        mr={2}
                      />
                      <Text>{user?.firstName} {user?.lastName}</Text>
                      <ChevronDownIcon ml={1} />
                    </Flex>
                  </MenuButton>
                  <MenuList>
                    <MenuItem as={RouterLink} to="/profile/me">
                      My Profile
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/profile/edit">
                      Edit Profile
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/messages">
                      Messages {unreadCount > 0 && (
                        <Badge colorScheme="red" ml={2} borderRadius="full">
                          {unreadCount}
                        </Badge>
                      )}
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
                    <MenuItem as={RouterLink} to="/reset" color="red.500">
                      Reset Database
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <>
                  <Button
                    as={RouterLink}
                    fontSize={'sm'}
                    fontWeight={400}
                    variant={'link'}
                    to={'/login'}>
                    Sign In
                  </Button>
                  <Button
                    as={RouterLink}
                    display={{ base: 'none', md: 'inline-flex' }}
                    fontSize={'sm'}
                    fontWeight={600}
                    color={'white'}
                    bg={'blue.400'}
                    to={'/register'}
                    _hover={{
                      bg: 'blue.300',
                    }}>
                    Sign Up
                  </Button>
                </>
              )}
            </Stack>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/alumni">Alumni</NavLink>
              {isAuthenticated && (
                <Box position="relative" display="inline-block">
                  <NavLink to="/messages">Messages</NavLink>
                  {unreadCount > 0 && (
                    <Badge
                      colorScheme="red"
                      borderRadius="full"
                      position="absolute"
                      top="0"
                      right="-10px"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Box>
              )}
              <NavLink to="/events">Events</NavLink>
            </Stack>
          </Box>
        ) : null}
      </Container>
    </Box>
  );
} 