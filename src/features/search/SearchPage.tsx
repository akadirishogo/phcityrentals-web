import { Box, Container, SimpleGrid, VStack, Input, Text, Spinner, Heading, HStack, Button, Flex } from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { PropertyCard } from '../../components/PropertyCard';
import { PropertyMap } from '../../components/PropertyMap';
import { useProperties } from './useProperties';
import type { SearchFilters, PropertyType } from '../../core/types';
import { useSavedProperties } from '../saved/useSavedProperties';




export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toggleSave, isSaved } = useSavedProperties();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  // Add verified filter state (can be 'all', 'verified', or 'unverified')
  const [verifiedFilter, setVerifiedFilter] = useState(searchParams.get('verified') || 'all');



  // Get filters from URL
  const [filters, setFilters] = useState<SearchFilters>({
    location: searchParams.get('location') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
    propertyType: searchParams.get('propertyType') as PropertyType || undefined,
    isVerifiedOnly: verifiedFilter === "verified"
  });

  const { data: properties = [], isLoading, error } = useProperties(filters);

  
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL
    const params = new URLSearchParams();
    if (newFilters.location) params.append('location', newFilters.location);
    if (newFilters.minPrice) params.append('minPrice', String(newFilters.minPrice));
    if (newFilters.maxPrice) params.append('maxPrice', String(newFilters.maxPrice));
    if (newFilters.bedrooms) params.append('bedrooms', String(newFilters.bedrooms));
    if (newFilters.propertyType) params.append('propertyType', newFilters.propertyType);
    if (newFilters.isVerifiedOnly) params.append('verified', 'true');
    
    setSearchParams(params);
  };

  return (
    <Container maxW="container.xl" py="8">
      <VStack align="start" gap="6">
        {/* Filters at Top */}
        <Box width="full" pb="6">
          <Heading size="md" mb="4">Filters</Heading>
          <HStack gap="4" flexWrap="wrap">
            <Input
              placeholder="Location"
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              width="200px"
            />
            
            <Input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              width="150px"
            />
            
            <Input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              width="150px"
            />
            
            <select
              value={filters.bedrooms || ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
              style={{
                borderWidth: '1px',
                borderRadius: '0.375rem',
                padding: '0.5rem',
                width: '150px',
              }}
            >
              <option value="">Bedrooms</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>
            
            <select
              value={filters.propertyType || ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange('propertyType', e.target.value || undefined)}
              style={{
                borderWidth: '1px',
                borderRadius: '0.375rem',
                padding: '0.5rem',
                width: '150px',
              }}
            >
              <option value="">Property Type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="studio">Studio</option>
            </select>
            
            <select
              value={verifiedFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setVerifiedFilter(e.target.value);
                handleFilterChange('isVerifiedOnly', e.target.value === 'verified');
              }}
              style={{
                borderWidth: '1px',
                borderRadius: '0.375rem',
                padding: '0.5rem',
                width: '150px',
              }}
            >
              <option value="all">All Properties</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </HStack>
        </Box>

        {/* Results: side-by-side on desktop, toggled on mobile */}
        <Box width="full">
          <HStack justify="space-between" mb="6" flexWrap="wrap" gap="3">
            <Heading size="lg">Results ({properties.length})</Heading>

            <HStack gap="2" display={{ base: 'flex', lg: 'none' }}>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'solid' : 'outline'}
                onClick={() => setViewMode('list')}
                aria-pressed={viewMode === 'list'}
              >
                List
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'map' ? 'solid' : 'outline'}
                onClick={() => setViewMode('map')}
                aria-pressed={viewMode === 'map'}
              >
                Map
              </Button>
            </HStack>
          </HStack>

          {isLoading && <Spinner />}
          {error && <Text color="red.600">Error loading properties</Text>}
          {!isLoading && !error && properties.length === 0 && (
            <Text color="gray.600">No properties found. Try adjusting your filters.</Text>
          )}

          {!isLoading && !error && properties.length > 0 && (
            <Flex gap="6" align="start" direction={{ base: 'column', lg: 'row' }}>
              <Box
                flex="1"
                width="full"
                display={{ base: viewMode === 'map' ? 'none' : 'block', lg: 'block' }}
              >
                <SimpleGrid columns={{ base: 1, md: 2, lg: 1, xl: 2 }} gap="6">
                  {properties.map((property) => (
                    <Box
                      key={property.id}
                      onMouseEnter={() => setActiveId(property.id)}
                      onMouseLeave={() => setActiveId(null)}
                      onFocus={() => setActiveId(property.id)}
                      onBlur={() => setActiveId(null)}
                    >
                      <PropertyCard
                        property={property}
                        onSave={() => toggleSave(property.id)}
                        isSaved={isSaved(property.id)}
                      />
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>

              <Box
                flex="1"
                width="full"
                height={{ base: '70vh', lg: '75vh' }}
                position={{ base: 'static', lg: 'sticky' }}
                top="6"
                borderRadius="lg"
                overflow="hidden"
                display={{ base: viewMode === 'list' ? 'none' : 'block', lg: 'block' }}
              >
                <PropertyMap
                  properties={properties}
                  activeId={activeId}
                  onMarkerClick={setActiveId}
                />
              </Box>
            </Flex>
          )}
        </Box>
      </VStack>
    </Container>
  );
}