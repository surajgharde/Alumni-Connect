import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Button,
  Badge,
  HStack,
  VStack,
  useColorModeValue,
  Image,
  Flex,
  Stack,
  Link,
  Icon,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaCalendar, FaMapMarkerAlt, FaClock, FaExternalLinkAlt } from 'react-icons/fa';

// Mock event data - in a real app, this would come from an API
interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  category: string;
  registrationLink: string;
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Annual Alumni Reunion',
    date: 'June 15, 2023',
    time: '5:00 PM - 9:00 PM',
    location: 'Main Campus, Grand Hall',
    description: 'Join us for our annual alumni reunion! Connect with former classmates, network with professionals in your field, and enjoy food and refreshments. Special keynote speakers and entertainment included.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    category: 'Networking',
    registrationLink: 'https://example.com/register-reunion'
  },
  {
    id: 2,
    title: 'Career Fair 2023',
    date: 'July 22, 2023',
    time: '10:00 AM - 4:00 PM',
    location: 'Business School, Room 201-205',
    description: 'Our biggest career fair of the year with over 50 companies looking for talent. Bring your resume and business cards! Perfect opportunity for recent graduates and alumni looking for new opportunities.',
    image: 'https://images.unsplash.com/photo-1560523160-754a9e25c68f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    category: 'Career',
    registrationLink: 'https://example.com/register-career-fair'
  },
  {
    id: 3,
    title: 'Tech Talks: AI Revolution',
    date: 'August 5, 2023',
    time: '6:30 PM - 8:30 PM',
    location: 'Engineering Building, Auditorium A',
    description: 'A series of talks from industry leaders on how AI is transforming various sectors. Featuring alumni working at top tech companies who will share insights on the latest developments and future trends.',
    image: 'https://images.unsplash.com/photo-1581092921461-fd0e43f5e568?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    category: 'Educational',
    registrationLink: 'https://example.com/register-tech-talks'
  },
  {
    id: 4,
    title: 'Homecoming Weekend',
    date: 'October 14-15, 2023',
    time: 'All Day',
    location: 'Campus-wide',
    description: 'A weekend full of activities including sporting events, campus tours, department open houses, and the annual homecoming parade. Join fellow alumni to celebrate school spirit and reminisce about your time on campus.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    category: 'Social',
    registrationLink: 'https://example.com/register-homecoming'
  },
  {
    id: 5,
    title: 'Global Alumni Summit',
    date: 'November 10, 2023',
    time: '9:00 AM - 5:00 PM',
    location: 'Virtual Event',
    description: 'Our first-ever global alumni summit brings together graduates from around the world for a day of learning, networking, and inspiration. Join us online for panels, workshops, and virtual networking rooms.',
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    category: 'Networking',
    registrationLink: 'https://example.com/register-summit'
  },
  {
    id: 6,
    title: 'Alumni Mentorship Program Kickoff',
    date: 'January 20, 2024',
    time: '3:00 PM - 5:00 PM',
    location: 'Student Center, Conference Room B',
    description: 'Launch of our annual mentorship program matching current students with alumni mentors. If you\'re interested in becoming a mentor, join us to learn more about the program and meet potential mentees.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    category: 'Mentorship',
    registrationLink: 'https://example.com/register-mentorship'
  }
];

// Event card component
function EventCard({ event }: { event: Event }) {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.700');
  
  // Get badge color based on event category
  const getBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'networking': return 'blue';
      case 'career': return 'green';
      case 'educational': return 'purple';
      case 'social': return 'pink';
      case 'mentorship': return 'orange';
      default: return 'gray';
    }
  };
  
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="sm"
      borderColor={borderColor}
      bg={bgColor}
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'md',
      }}
    >
      <Box position="relative">
        <Image
          src={event.image}
          alt={event.title}
          width="100%"
          height="200px"
          objectFit="cover"
          fallbackSrc="https://via.placeholder.com/800x400?text=Event+Image"
        />
        <Badge
          position="absolute"
          top="10px"
          right="10px"
          colorScheme={getBadgeColor(event.category)}
          borderRadius="full"
          px={3}
          py={1}
        >
          {event.category}
        </Badge>
      </Box>
      
      <Box p={5}>
        <Heading as="h3" size="md" mb={2} noOfLines={1}>
          {event.title}
        </Heading>
        
        <Stack spacing={2} mt={4} mb={5}>
          <HStack>
            <Icon as={FaCalendar} color="blue.500" />
            <Text>{event.date}</Text>
          </HStack>
          <HStack>
            <Icon as={FaClock} color="blue.500" />
            <Text>{event.time}</Text>
          </HStack>
          <HStack>
            <Icon as={FaMapMarkerAlt} color="blue.500" />
            <Text noOfLines={1}>{event.location}</Text>
          </HStack>
        </Stack>
        
        <Text noOfLines={3} mb={5}>
          {event.description}
        </Text>
        
        <Button
          as={Link}
          href={event.registrationLink}
          isExternal
          rightIcon={<FaExternalLinkAlt />}
          colorScheme="blue"
          size="sm"
          width="full"
        >
          Register Now
        </Button>
      </Box>
    </Box>
  );
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  
  useEffect(() => {
    // In a real app, this would be an API call
    setEvents(mockEvents);
  }, []);
  
  return (
    <Container maxW="container.xl" py={8}>
      <Box textAlign="center" mb={10}>
        <Heading as="h1" mb={4}>
          Upcoming Alumni Events
        </Heading>
        <Text fontSize="xl" maxW="container.md" mx="auto">
          Join fellow alumni for these exciting events. Connect, learn, and grow your network.
        </Text>
      </Box>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </SimpleGrid>
      
      <Box mt={12} textAlign="center">
        <Heading as="h3" size="md" mb={4}>
          Don't see an event you're interested in?
        </Heading>
        <Button colorScheme="blue" size="lg" as={Link} href="mailto:alumni@university.edu" isExternal>
          Suggest an Event
        </Button>
      </Box>
    </Container>
  );
} 