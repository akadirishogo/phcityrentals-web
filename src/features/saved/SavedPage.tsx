import { Container, Heading, Text, SimpleGrid, VStack, Box } from '@chakra-ui/react';
import { MOCK_PROPERTIES } from '../../core/mock/properties';
import { PropertyCard } from '../../components/PropertyCard';
import { useSavedProperties } from './useSavedProperties';

export function SavedPage() {
  const { saved, toggleSave, isSaved } = useSavedProperties();

  // Get saved properties
  const savedProperties = MOCK_PROPERTIES.filter((p) => saved.includes(p.id));

  return (
    <Container maxW="container.xl" py="8">
      <VStack align="start" gap="6">
        <Heading size="xl">Saved Properties</Heading>

        {savedProperties.length === 0 ? (
          <Box textAlign="center" width="full" py="12">
            <Text color="gray.600" fontSize="lg">
              No saved properties yet. Start exploring to save your favorites!
            </Text>
          </Box>
        ) : (
          <>
            <Text color="gray.600">{savedProperties.length} property(ies) saved</Text>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="6" width="full">
              {savedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onSave={() => toggleSave(property.id)}
                  isSaved={isSaved(property.id)}
                />
              ))}
            </SimpleGrid>
          </>
        )}
      </VStack>
    </Container>
  );
}
