import { useParams } from 'react-router-dom';
import { Box, Container, Heading, Text, VStack, HStack, Badge, Button, Spinner, Separator } from '@chakra-ui/react';
import { PropertyImage } from '../../components/PropertyImage';
import { useProperty } from './useProperty';
import { useSavedProperties } from '../saved/useSavedProperties';
import { getPriceBreakdown, getBreakdownTotal, formatNaira } from '../../core/domains/pricing';
import { useState } from 'react';



export function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, error } = useProperty(id || '');

  const { toggleSave, isSaved } = useSavedProperties();

  const [activeImage, setActiveImage] = useState(0);
  if (isLoading) return <Spinner />;
  if (error || !property) return <Text>Property not found</Text>;

  return (
    <Container maxW="container.lg" py="8">
      {/* Image Gallery */}
      <VStack align="stretch" gap="3" mb="8">
        <PropertyImage
          src={property.images[activeImage]}
          alt={`${property.title} — image ${activeImage + 1} of ${property.images.length}`}
          height="420px"
          borderRadius="lg"
        />

        {property.images.length > 1 && (
          <HStack gap="3" overflowX="auto" pb="1" role="group" aria-label="Property images">
            {property.images.map((image, index) => (
              <Box
                key={image}
                as="button"
                flexShrink="0"
                width="110px"
                borderRadius="md"
                overflow="hidden"
                opacity={index === activeImage ? 1 : 0.55}
                outline={index === activeImage ? '2px solid' : 'none'}
                outlineColor="orange.400"
                onClick={() => setActiveImage(index)}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === activeImage ? 'true' : undefined}
              >
                <PropertyImage src={image} alt="" height="72px" />
              </Box>
            ))}
          </HStack>
        )}
      </VStack>


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

          <Box width="full">
            <Heading size="md" mb="3">All-inclusive price breakdown</Heading>
            <VStack align="stretch" gap="2" maxW="sm">
              {getPriceBreakdown(property).map((line) => (
                <HStack key={line.label} justify="space-between">
                  <Text color="gray.600">{line.label}</Text>
                  <Text>{formatNaira(line.amount)}</Text>
                </HStack>
              ))}
              <Separator />
              <HStack justify="space-between">
                <Text fontWeight="bold">Total per year</Text>
                <Text fontWeight="bold" fontSize="lg">{formatNaira(getBreakdownTotal(property))}</Text>
              </HStack>
            </VStack>
          </Box>


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
            <Button asChild colorScheme="green" width="full">
              <a href={`tel:${property.agentPhone.replace(/\s/g, '')}`}>
                Call agent
              </a>
            </Button>

            <Button asChild variant="outline" width="full">
              <a href={`mailto:${property.agentEmail}?subject=${encodeURIComponent(`Enquiry: ${property.title}`)}`}>
                Email agent
              </a>
            </Button>
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
