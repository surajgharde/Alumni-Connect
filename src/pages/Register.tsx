/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Select,
  Stack,
  Text,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaGoogle, FaLinkedin } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { DatabaseService } from '../services/DatabaseService';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();
  const { register } = useAuth();

  // Generate graduation year options
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear; year >= currentYear - 50; year--) {
    yearOptions.push(year);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!firstName || !lastName || !email || !password || !confirmPassword || !graduationYear) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Register using DatabaseService
    setIsLoading(true);
    
    try {
      // Create user object
      const userData = {
        id: Math.floor(Math.random() * 1000), // Generate a random ID for demo
        firstName,
        lastName,
        email,
        graduationYear,
        // For demo purposes only - in a real app, we'd hash this properly on the server
        passwordHash: btoa(password) // Simple base64 encoding as a mock "hash"
      };
      
      // Call register service
      await DatabaseService.registerUser(userData);
      
      // Call the register function from auth context (omit password from auth context)
      const userDataForAuth = {
        id: userData.id,
        firstName,
        lastName,
        email,
        graduationYear
      };
      register(userDataForAuth);
      
      // Create an initial profile
      const profileData = {
        id: userData.id,
        name: `${firstName} ${lastName}`,
        graduationYear: parseInt(graduationYear),
        program: '',
        company: '',
        position: '',
        location: '',
        image: 'https://randomuser.me/api/portraits/lego/1.jpg',
        email,
        bio: '',
        skills: [],
        education: `Graduated in ${graduationYear}`,
        experiences: []
      };
      
      // Save the initial profile
      await DatabaseService.updateUserProfile(profileData);
      
      // Success handling
      toast({
        title: 'Registration successful',
        description: 'Your account has been created!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Navigate directly to profile edit page to complete profile
      navigate('/profile/edit');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: 'There was an error registering your account',
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
        <Stack spacing="6">
          <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
            <Heading size={{ base: 'xs', md: 'sm' }}>Create your account</Heading>
            <Text color="gray.500">
              Already have an account? <Link as={RouterLink} to="/login" color="blue.500">Log in</Link>
            </Text>
          </Stack>
        </Stack>
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={{ base: 'none', sm: 'md' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing="6">
              <Stack spacing="5">
                <HStack>
                  <FormControl isRequired>
                    <FormLabel htmlFor="firstName">First Name</FormLabel>
                    <Input 
                      id="firstName" 
                      type="text" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel htmlFor="lastName">Last Name</FormLabel>
                    <Input 
                      id="lastName" 
                      type="text" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </FormControl>
                </HStack>
                <FormControl isRequired>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="graduationYear">Graduation Year</FormLabel>
                  <Select 
                    id="graduationYear" 
                    placeholder="Select graduation year"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                  >
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </FormControl>
              </Stack>
              <Stack spacing="6">
                <Button 
                  type="submit" 
                  colorScheme="blue" 
                  isLoading={isLoading}
                >
                  Sign up
                </Button>
                <HStack>
                  <Divider />
                  <Text fontSize="sm" whiteSpace="nowrap" color="gray.500">
                    or continue with
                  </Text>
                  <Divider />
                </HStack>
                <HStack spacing="4">
                  <Button flex="1" variant="outline" leftIcon={<FaGoogle />}>
                    Google
                  </Button>
                  <Button flex="1" variant="outline" leftIcon={<FaLinkedin />}>
                    LinkedIn
                  </Button>
                </HStack>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
} 