import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Image,
  Stack,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Flex,
  Button,
  useColorModeValue
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { SearchIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { UserProfile, DatabaseService } from '../services/DatabaseService';
import ChatButton from '../components/ChatButton';

interface AlumniData {
  id: number;
  name: string;
  graduationYear: number;
  program: string;
  company: string;
  position: string;
  location: string;
  image: string;
}

// Mock data - would come from API in a real application
const mockAlumniData: AlumniData[] = [
  {
    id: 1,
    name: 'Alex Johnson',
    graduationYear: 2020,
    program: 'Computer Science',
    company: 'Google',
    position: 'Software Engineer',
    location: 'San Francisco, CA',
    image: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 2,
    name: 'Sarah Williams',
    graduationYear: 2019,
    program: 'Business Administration',
    company: 'Microsoft',
    position: 'Product Manager',
    location: 'Seattle, WA',
    image: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: 3,
    name: 'Michael Chen',
    graduationYear: 2018,
    program: 'Electrical Engineering',
    company: 'Tesla',
    position: 'Hardware Engineer',
    location: 'Palo Alto, CA',
    image: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: 4,
    name: 'Emily Davis',
    graduationYear: 2021,
    program: 'Marketing',
    company: 'Facebook',
    position: 'Marketing Specialist',
    location: 'New York, NY',
    image: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    id: 5,
    name: 'Daniel Rodriguez',
    graduationYear: 2017,
    program: 'Computer Science',
    company: 'Amazon',
    position: 'Senior Developer',
    location: 'Seattle, WA',
    image: 'https://randomuser.me/api/portraits/men/5.jpg'
  },
  {
    id: 6,
    name: 'Jennifer Kim',
    graduationYear: 2022,
    program: 'Data Science',
    company: 'Netflix',
    position: 'Data Analyst',
    location: 'Los Angeles, CA',
    image: 'https://randomuser.me/api/portraits/women/6.jpg'
  },
];

export default function Alumni() {
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [alumniData, setAlumniData] = useState<AlumniData[]>([]);
  
  // Load alumni data, using DatabaseService to get all profiles
  useEffect(() => {
    const loadAlumniData = async () => {
      try {
        // Get user profiles from DatabaseService
        const userProfiles = await DatabaseService.getAllProfiles();
        
        // Merge with mock data
        const allAlumni = [...mockAlumniData];
        
        // Add user profiles if they have the required fields
        userProfiles.forEach((profile: UserProfile) => {
          if (profile.id && profile.name && profile.graduationYear) {
            // Check if this profile ID already exists in mock data
            const existingIndex = allAlumni.findIndex(a => a.id === profile.id);
            
            if (existingIndex >= 0) {
              // Update existing entry
              allAlumni[existingIndex] = {
                id: profile.id,
                name: profile.name,
                graduationYear: profile.graduationYear,
                program: profile.program || 'Alumni',
                company: profile.company || 'Not specified',
                position: profile.position || 'Not specified',
                location: profile.location || 'Not specified',
                image: profile.image || 'https://randomuser.me/api/portraits/lego/1.jpg'
              };
            } else {
              // Add as new entry
              allAlumni.push({
                id: profile.id,
                name: profile.name,
                graduationYear: profile.graduationYear,
                program: profile.program || 'Alumni',
                company: profile.company || 'Not specified',
                position: profile.position || 'Not specified',
                location: profile.location || 'Not specified',
                image: profile.image || 'https://randomuser.me/api/portraits/lego/1.jpg'
              });
            }
          }
        });
        
        setAlumniData(allAlumni);
      } catch (error) {
        console.error("Error loading alumni profiles:", error);
      }
    };
    
    loadAlumniData();
  }, []);
  
  // Get unique programs for filter
  const uniquePrograms = [...new Set(alumniData.map((alumni) => alumni.program))];

  // Get unique years for filter
  const uniqueYears = [...new Set(alumniData.map((alumni) => alumni.graduationYear))].sort((a, b) => b - a);
  
  // Filter alumni based on search and filters
  const filteredAlumni = alumniData.filter((alumni) => {
    const matchesSearch = alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alumni.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alumni.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProgram = programFilter === '' || alumni.program === programFilter;
    const matchesYear = yearFilter === '' || alumni.graduationYear === parseInt(yearFilter);
    
    return matchesSearch && matchesProgram && matchesYear;
  });

  const cardBg = useColorModeValue('white', 'gray.700');
  const cardBorder = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box py={8}>
      <Container maxW="container.xl">
        <Heading as="h1" mb={2}>
          Alumni Directory
        </Heading>
        <Text mb={8} color="gray.600">
          Connect with graduates from all years and programs
        </Text>
        
        <Flex 
          direction={{ base: 'column', md: 'row' }}
          mb={8}
          gap={4}
        >
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <SearchIcon color='gray.300' />
            </InputLeftElement>
            <Input 
              placeholder="Search by name, company or position" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          
          <Select 
            placeholder="Filter by program" 
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            maxW={{ base: '100%', md: '200px' }}
          >
            {uniquePrograms.map((program) => (
              <option key={program} value={program}>
                {program}
              </option>
            ))}
          </Select>
          
          <Select 
            placeholder="Filter by year" 
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            maxW={{ base: '100%', md: '150px' }}
          >
            {uniqueYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
          
          <Button 
            onClick={() => {
              setSearchTerm('');
              setProgramFilter('');
              setYearFilter('');
            }}
            colorScheme="gray"
          >
            Clear Filters
          </Button>
        </Flex>
        
        {filteredAlumni.length === 0 ? (
          <Text fontSize="lg" textAlign="center" py={10}>
            No alumni found matching your search criteria.
          </Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredAlumni.map((alumni) => (
              <Box
                key={alumni.id}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                bg={cardBg}
                borderColor={cardBorder}
                boxShadow="md"
                _hover={{ transform: 'translateY(-5px)', transition: 'all 0.3s ease' }}
              >
                <Box as={RouterLink} to={`/profile/${alumni.id}`}>
                  <Flex align="center" p={6}>
                    <Image
                      src={alumni.image}
                      alt={alumni.name}
                      borderRadius="full"
                      boxSize="80px"
                      mr={4}
                      objectFit="cover"
                    />
                    <Stack spacing={1}>
                      <Heading as="h3" size="md">
                        {alumni.name}
                      </Heading>
                      <Text color="gray.500" fontSize="sm">
                        {alumni.position} at {alumni.company}
                      </Text>
                      <Text fontSize="sm">{alumni.location}</Text>
                      <Flex mt={1}>
                        <Badge colorScheme="blue" mr={2}>
                          {alumni.program}
                        </Badge>
                        <Badge colorScheme="green">
                          Class of {alumni.graduationYear}
                        </Badge>
                      </Flex>
                    </Stack>
                  </Flex>
                </Box>
                
                <Flex borderTopWidth="1px" p={3} justifyContent="space-between" alignItems="center">
                  <Button 
                    as={RouterLink} 
                    to={`/profile/${alumni.id}`} 
                    size="sm" 
                    variant="ghost"
                    leftIcon={<Box as="span" fontSize="lg">👤</Box>}
                  >
                    View Profile
                  </Button>
                  <ChatButton userId={alumni.id} size="sm" isIconOnly />
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
} 