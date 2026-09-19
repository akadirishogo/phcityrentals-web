import { Box, Heading, Text, Input, Button, SimpleGrid, VStack, Container, HStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PropertyCard } from '../../components/PropertyCard';
import { MOCK_PROPERTIES } from '../../core/mock/properties';
import { useSavedProperties } from '../saved/useSavedProperties';

export function HomePage() {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState('');
  const { toggleSave, isSaved } = useSavedProperties();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.append('location', searchLocation);
    navigate(`/search?${params.toString()}`);
  };

  const featured = MOCK_PROPERTIES.slice(0, 3);

  return (
    <Box>
      {/* Hero Section - Design Decision: Large, compelling hero with gradient depth */}
      <Box
        bg="linear-gradient(135deg, #475569 0%, #334155 100%)"
        color="white"
        py="32"
        position="relative"
        overflow="hidden"
      >
        {/* Subtle background pattern for visual depth */}
        <Box
          position="absolute"
          right="-100px"
          top="-50px"
          width="400px"
          height="400px"
          borderRadius="full"
          bg="rgba(255,255,255,0.05)"
          pointerEvents="none"
        />

        <Container maxW="container.lg" position="relative" zIndex="1">
          <VStack align="center" gap="8" maxW="2xl" mx="auto">
            {/* Headline Section */}
            <VStack align="center" gap="4">
              <Heading
                size="4xl"
                fontWeight="600"
                lineHeight="1.1"
                letterSpacing="-0.02em"
                textAlign="center"
              >
                Find Your Perfect Home in Port Harcourt
              </Heading>

              <Text
                fontSize="md"
                color="gray.100"
                maxW="lg"
                textAlign="center"
              >
                Explore verified properties, connect with trusted agents, and secure your ideal rental today.
              </Text>
            </VStack>

            {/* Search Section */}
            <VStack gap="4" width="full" maxW="md">
              <Input
                placeholder="Search by location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                bg="white"
                color="gray.400"
                size="lg"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                borderRadius="lg"
                fontWeight="500"
                _placeholder={{ color: 'gray.400' }}
              />
              <Button
                width="full"
                bg="orange.500"
                color="white"
                size="lg"
                onClick={handleSearch}
                fontWeight="700"
                _hover={{ bg: 'orange.600' }}
                transition="all 0.2s"
              >
                Search Properties
              </Button>
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* Featured Properties Section - Design Decision: Clear hierarchy with description */}
      <Container maxW="container.lg" py="20">
        <VStack align="start" gap="12" width="full">
          {/* Section Header */}
          <VStack align="start" gap="2">
            <Heading size="2xl" fontWeight="800">
              Featured Properties
            </Heading>
            <Text color="gray.600" fontSize="md">
              Handpicked selections from verified landlords across Port Harcourt
            </Text>
          </VStack>

          {/* Properties Grid */}
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            gap="8"
            width="full"
          >
            {featured.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSave={() => toggleSave(property.id)}
                isSaved={isSaved(property.id)}
              />
            ))}
          </SimpleGrid>

          {/* Call-to-Action */}
          <HStack
            width="full"
            justify="center"
            pt="8"
          >
            <Button
              variant="outline"
              colorScheme="slate"
              size="lg"
              onClick={() => navigate('/search')}
              fontWeight="600"
            >
              View All Properties
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}
