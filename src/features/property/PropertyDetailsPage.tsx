import { useParams } from 'react-router-dom';
import { Box, Container, Image, Heading, Text, VStack, HStack, Badge, Button, Spinner } from '@chakra-ui/react';
import { useProperty } from './useProperty';
import { useSavedProperties } from '../saved/useSavedProperties';




export function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, error } = useProperty(id || '');

  const { toggleSave, isSaved } = useSavedProperties();


  if (isLoading) return <Spinner />;
  if (error || !property) return <Text>Property not found</Text>;

  return (
    <Container maxW="container.lg" py="8">
      {/* Image Gallery */}
      <Image src={property.images[0]} alt={property.title} width="full" height="400px" objectFit="cover" borderRadius="lg" mb="8" />

      <HStack align="start" gap="8">
        {/* Details */}
        <VStack align="start" flex="1" gap="6">
          <VStack align="start" gap="2">
            <HStack>
              <Heading size="xl">{property.title}</Heading>
              {property.isVerified && <Badge colorScheme="green">Verified</Badge>}
            </HStack>
            <Text fontSize="lg" color="gray.600">{property.location}</Text>
          </VStack>

          <VStack align="start" gap="2">
            <Heading size="md">Price</Heading>
            <Text fontSize="2xl" fontWeight="bold">₦{property.price.toLocaleString()}</Text>
            <Text fontSize="sm" color="gray.600">All-Inclusive: ₦{property.allInclusivePrice.toLocaleString()}</Text>
          </VStack>

          <VStack align="start" gap="2">
            <Heading size="md">Details</Heading>
            <HStack gap="6">
              <Text><strong>{property.bedrooms}</strong> Bedrooms</Text>
              <Text><strong>{property.bathrooms}</strong> Bathrooms</Text>
              <Text><strong>{property.propertyType}</strong></Text>
            </HStack>
          </VStack>

          <VStack align="start" gap="2">
            <Heading size="md">Amenities</Heading>
            <HStack flexWrap="wrap" gap="2">
              {property.amenities.map((amenity) => (
                <Badge key={amenity} colorScheme="blue">{amenity}</Badge>
              ))}
            </HStack>
          </VStack>

          <VStack align="start" gap="2">
            <Heading size="md">Description</Heading>
            <Text>{property.description}</Text>
          </VStack>
        </VStack>

        {/* Agent Info */}
        <Box width="300px" borderWidth="1" borderRadius="lg" p="6">
          <Heading size="md" mb="4">Agent Info</Heading>
          <VStack align="start" gap="4">
            <VStack align="start" gap="1">
              <Text fontWeight="bold">{property.agentName}</Text>
              <Text fontSize="sm">{property.agentPhone}</Text>
              <Text fontSize="sm">{property.agentEmail}</Text>
            </VStack>
            <Button width="full" colorScheme="green">Contact Agent</Button>
            <Button
              width="full"
              variant={isSaved(property.id) ? 'solid' : 'outline'}
              onClick={() => toggleSave(property.id)}
            >
              {isSaved(property.id) ? '✓ Saved' : 'Save Property'}
            </Button>

          </VStack>
        </Box>
      </HStack>
    </Container>
  );
}
