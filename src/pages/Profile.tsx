import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  List,
  ListItem,
  Badge,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Link,
  HStack,
  Icon
} from '@chakra-ui/react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaGlobe, FaEnvelope, FaMapMarkerAlt, FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserProfile as AlumniProfile, DatabaseService } from '../services/DatabaseService';
import ChatButton from '../components/ChatButton';

// Mock data - would come from API in a real application
const alumniData: AlumniProfile[] = [
  {
    id: 1,
    name: 'Alex Johnson',
    graduationYear: 2020,
    program: 'Computer Science',
    company: 'Google',
    position: 'Software Engineer',
    location: 'San Francisco, CA',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    email: 'alex.johnson@example.com',
    bio: 'Full-stack developer with 3+ years of experience specializing in React and Node.js. Passionate about creating intuitive user experiences and scalable backend solutions.',
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'MongoDB', 'GraphQL'],
    education: 'Bachelor of Science in Computer Science',
    linkedin: 'https://linkedin.com/in/alexjohnson',
    twitter: 'https://twitter.com/alexjohnson',
    website: 'https://alexjohnson.dev',
    experiences: [
      {
        company: 'Google',
        position: 'Software Engineer',
        duration: 'Jan 2021 - Present',
        description: 'Working on Google Cloud Platform team, developing new features and maintaining existing infrastructure.'
      },
      {
        company: 'Microsoft',
        position: 'Software Engineer Intern',
        duration: 'May 2020 - Aug 2020',
        description: 'Developed a feature for Microsoft Teams that improved video call quality in low-bandwidth situations.'
      }
    ]
  },
  // More alumni data would be here
];

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<AlumniProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Move all color hooks before the conditional return
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.900', 'gray.400');
  const skillsColor = useColorModeValue('yellow.500', 'yellow.300');
  
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      
      try {
        // If the ID parameter is "me", use the authenticated user's profile
        if (id === 'me') {
          // Get current user's profile
          const userProfile = await DatabaseService.getCurrentUserProfile();
          
          if (userProfile) {
            setProfileData(userProfile);
          } else if (user) {
            // If no profile exists yet, create a basic one
            const basicProfile: AlumniProfile = {
              id: user?.id || 0,
              name: `${user?.firstName} ${user?.lastName}`,
              graduationYear: parseInt(user?.graduationYear || '2020'),
              program: 'Alumni',
              company: 'Not specified',
              position: 'Not specified',
              location: 'Not specified',
              image: 'https://randomuser.me/api/portraits/lego/1.jpg', // Placeholder
              email: user?.email || '',
              bio: 'No bio provided yet.',
              skills: [],
              education: `Graduated in ${user?.graduationYear}`,
              experiences: []
            };
            
            setProfileData(basicProfile);
            
            // Save this basic profile
            await DatabaseService.updateUserProfile(basicProfile);
          }
        } else {
          // Try to get the profile from the DatabaseService first
          const userProfile = await DatabaseService.getUserProfile(Number(id));
          
          if (userProfile) {
            setProfileData(userProfile);
          } else {
            // Fall back to mock data
            const mockProfile = alumniData.find(a => a.id === Number(id));
            if (mockProfile) {
              setProfileData(mockProfile);
            } else {
              setProfileData(null);
            }
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setProfileData(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [id, isAuthenticated, user, navigate]);
  
  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Heading>Loading profile...</Heading>
      </Box>
    );
  }
  
  if (!profileData) {
    return (
      <Box textAlign="center" py={10}>
        <Heading>Profile Not Found</Heading>
        <Text mt={4}>We couldn't find the alumni profile you're looking for.</Text>
        <Button as={RouterLink} to="/alumni" colorScheme="blue" mt={6}>
          Return to Alumni Directory
        </Button>
      </Box>
    );
  }

  return (
    <Container maxW={'7xl'} py={12}>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 8, md: 10 }}>
        <Flex>
          <Image
            rounded={'md'}
            alt={profileData.name}
            src={profileData.image}
            fit={'cover'}
            align={'center'}
            w={'100%'}
            h={{ base: '100%', sm: '400px', lg: '500px' }}
          />
        </Flex>
        <Stack spacing={{ base: 6, md: 10 }}>
          <Box as={'header'}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
              {profileData.name}
            </Heading>
            <Text
              color={textColor}
              fontWeight={300}
              fontSize={'2xl'}>
              {profileData.position} at {profileData.company}
            </Text>
          </Box>

          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={'column'}
            divider={<StackDivider borderColor={borderColor} />}>
            
            <VStack spacing={{ base: 4, sm: 6 }}>
              <Text fontSize={'lg'}>
                {profileData.bio}
              </Text>
            </VStack>

            <Box>
              <HStack spacing={4} mb={4}>
                <HStack>
                  <Icon as={FaGraduationCap} color="blue.500" />
                  <Text fontWeight="bold">Class of {profileData.graduationYear}</Text>
                </HStack>
                <HStack>
                  <Icon as={FaBriefcase} color="blue.500" />
                  <Text fontWeight="bold">{profileData.program}</Text>
                </HStack>
              </HStack>
              
              <HStack spacing={4}>
                <HStack>
                  <Icon as={FaMapMarkerAlt} color="blue.500" />
                  <Text>{profileData.location}</Text>
                </HStack>
                <HStack>
                  <Icon as={FaEnvelope} color="blue.500" />
                  <Link href={`mailto:${profileData.email}`} color="blue.500">
                    {profileData.email}
                  </Link>
                </HStack>
              </HStack>
            </Box>

            <Box>
              <Text
                fontSize={{ base: '16px', lg: '18px' }}
                color={skillsColor}
                fontWeight={'500'}
                textTransform={'uppercase'}
                mb={'4'}>
                Skills
              </Text>

              <Flex wrap="wrap" gap={2}>
                {profileData.skills.map((skill) => (
                  <Badge key={skill} px={2} py={1} colorScheme="blue" borderRadius="md">
                    {skill}
                  </Badge>
                ))}
                {profileData.skills.length === 0 && (
                  <Text>No skills listed yet.</Text>
                )}
              </Flex>
            </Box>
            
            <Box>
              <Text
                fontSize={{ base: '16px', lg: '18px' }}
                color={skillsColor}
                fontWeight={'500'}
                textTransform={'uppercase'}
                mb={'4'}>
                Connect
              </Text>

              <HStack spacing={4}>
                {profileData.linkedin && (
                  <Button 
                    as="a" 
                    href={profileData.linkedin} 
                    target="_blank" 
                    leftIcon={<FaLinkedin />} 
                    colorScheme="linkedin" 
                    size="sm"
                  >
                    LinkedIn
                  </Button>
                )}
                {profileData.twitter && (
                  <Button 
                    as="a" 
                    href={profileData.twitter} 
                    target="_blank" 
                    leftIcon={<FaTwitter />} 
                    colorScheme="twitter" 
                    size="sm"
                  >
                    Twitter
                  </Button>
                )}
                {profileData.website && (
                  <Button 
                    as="a" 
                    href={profileData.website} 
                    target="_blank" 
                    leftIcon={<FaGlobe />} 
                    colorScheme="gray" 
                    size="sm"
                  >
                    Website
                  </Button>
                )}
              </HStack>
            </Box>
          </Stack>

          {id === 'me' && (
            <Button
              colorScheme="blue"
              size="lg"
              py="7"
              onClick={() => navigate('/profile/edit')}
              _hover={{
                transform: 'translateY(2px)',
                boxShadow: 'lg',
              }}>
              Edit Profile
            </Button>
          )}
          {id !== 'me' && (
            <ChatButton userId={Number(id)} size="lg" />
          )}
        </Stack>
      </SimpleGrid>

      <Box mt={12}>
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>Experience</Tab>
            <Tab>Education</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box p={4} borderWidth="1px" borderRadius="lg" bg={bgColor}>
                {profileData.experiences && profileData.experiences.length > 0 ? (
                  profileData.experiences.map((exp, index) => (
                    <Box 
                      key={index} 
                      mb={4} 
                      pb={4} 
                      borderBottomWidth={index < profileData.experiences.length - 1 ? "1px" : "0"}
                    >
                      <Heading as="h3" size="md">{exp.position}</Heading>
                      <Text fontWeight="bold" color="blue.500">{exp.company}</Text>
                      <Text color="gray.500" mb={2}>{exp.duration}</Text>
                      <Text>{exp.description}</Text>
                    </Box>
                  ))
                ) : (
                  <Text>No experience records yet.</Text>
                )}
              </Box>
            </TabPanel>
            <TabPanel>
              <Box p={4} borderWidth="1px" borderRadius="lg" bg={bgColor}>
                <List spacing={3}>
                  <ListItem>
                    <Text fontWeight="bold">{profileData.education}</Text>
                    <Text>Graduated: {profileData.graduationYear}</Text>
                  </ListItem>
                </List>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
} 