import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  useColorModeValue
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <Container maxW={'3xl'} py={20}>
      <Box textAlign="center" py={10} px={6}>
        <Heading
          display="inline-block"
          as="h1"
          size="4xl"
          bgGradient="linear(to-r, blue.400, blue.600)"
          backgroundClip="text">
          404
        </Heading>
        <Text fontSize="xl" mt={3} mb={6}>
          Page Not Found
        </Text>
        <Text color={useColorModeValue('gray.600', 'gray.400')} mb={8}>
          The page you're looking for does not seem to exist.
        </Text>

        <Button
          as={RouterLink}
          to="/"
          colorScheme="blue"
          bgGradient="linear(to-r, blue.400, blue.500, blue.600)"
          color="white"
          variant="solid"
          _hover={{
            bgGradient: 'linear(to-r, blue.500, blue.600, blue.700)',
          }}>
          Go to Home
        </Button>
      </Box>
    </Container>
  );
} 