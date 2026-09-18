import { Box, Container, HStack, Heading, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  return (
    <Box bg="slate.700" color="white" py="4" mb="8">
      <Container maxW="container.xl">
        <HStack justify="space-between">
          <Heading 
            size="md" 
            cursor="pointer" 
            onClick={() => navigate('/')}
          >
            PHCityRent
          </Heading>
          
          <HStack gap="4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              Home
            </Button>
            <Button variant="ghost" onClick={() => navigate('/search')}>
              Search
            </Button>
            <Button variant="ghost" onClick={() => navigate('/saved')}>
              Saved
            </Button>
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
}
