import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatabaseService } from '../services/DatabaseService';
import { useAuth } from '../context/AuthContext';

export default function ResetDatabase() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleReset = async () => {
    setIsLoading(true);
    
    try {
      // Clear database
      await DatabaseService.clearDatabase();
      
      // Also logout the user
      logout();
      
      toast({
        title: 'Database reset',
        description: 'All data has been cleared. You can register a new account now.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Reset failed',
        description: 'There was an error resetting the database',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <Stack spacing="8">
        <Stack spacing="6" align="center">
          <Heading>Reset Database</Heading>
          <Text color="red.500">
            Warning: This will erase all data including users, profiles, and messages.
          </Text>
        </Stack>
        <Box
          py="8"
          px={{ base: '4', sm: '10' }}
          boxShadow="md"
          borderRadius="xl"
        >
          <Stack spacing="6">
            <Text>
              Use this function to clear all data and start fresh. This is useful if
              you're experiencing issues with login or registration.
            </Text>
            <Button
              colorScheme="red"
              isLoading={isLoading}
              onClick={handleReset}
            >
              Reset All Data
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
} 