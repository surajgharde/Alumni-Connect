import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue,
  Flex
} from '@chakra-ui/react';
import { FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const SocialButton = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => {
  return (
    <Link
      href={href}
      isExternal
      _hover={{ color: 'blue.400' }}
      mr={4}
    >
      {children}
    </Link>
  );
};

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      mt={10}
      py={6}
    >
      <Container
        as={Stack}
        maxW={'container.xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>© {new Date().getFullYear()} Alumni Connect. All rights reserved.</Text>
        <Flex>
          <SocialButton href={'https://twitter.com'}>
            <FaTwitter size={20} />
          </SocialButton>
          <SocialButton href={'https://linkedin.com'}>
            <FaLinkedin size={20} />
          </SocialButton>
          <SocialButton href={'https://instagram.com'}>
            <FaInstagram size={20} />
          </SocialButton>
        </Flex>
      </Container>
    </Box>
  );
} 