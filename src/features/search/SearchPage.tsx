import { Box, Container, SimpleGrid, VStack, Input, Text, Heading, HStack, Button, Flex } from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { PropertyCard } from '../../components/PropertyCard';
import { useProperties } from './useProperties';
import type { SearchFilters, PropertyType } from '../../core/types';
import { useSavedProperties } from '../saved/useSavedProperties';
import { PropertyMap } from '../../components/PropertyMap';
import { PropertyCardSkeleton } from '../../components/PropertyCardSkeleton';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';


const PRICE_STEPS = [
  100_000, 150_000, 200_000, 300_000, 400_000,
  500_000, 750_000, 1_000_000, 1_500_000, 2_000_000,
];

const formatPrice = (value: number) =>
  value >= 1_000_000 ? `₦${value / 1_000_000}M` : `₦${value / 1_000}k`;



export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toggleSave, isSaved } = useSavedProperties();
  // Add verified filter state (can be 'all', 'verified', or 'unverified')
  const [verifiedFilter, setVerifiedFilter] = useState(searchParams.get('verified') || 'all');
  const [activeId, setActiveId] = useState<string | null>(null);



  // Get filters from URL
  const [filters, setFilters] = useState<SearchFilters>({
    location: searchParams.get('location') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
    propertyType: searchParams.get('propertyType') as PropertyType || undefined,
    isVerifiedOnly: verifiedFilter === "verified"
  });

  const debouncedLocation = useDebouncedValue(filters.location, 350);
  const queryFilters = { ...filters, location: debouncedLocation };


  const { data: properties = [], isLoading, error, refetch, isFetching } = useProperties(queryFilters);

  const PAGE_SIZE = 12;
  const totalPages = Math.max(1, Math.ceil(properties.length / PAGE_SIZE));
  // Clamp rather than trust the URL: ?page=99 or ?page=-3 would otherwise render an empty grid.
  const page = Math.min(Math.max(1, Number(searchParams.get('page')) || 1), totalPages);
  const pageItems = properties.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToPage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(nextPage));
    setSearchParams(next);
  };

  
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
    
    setSearchParams(params, { replace: true });

  };

  return (
    <Container maxW="container.xl" py="8">
      <VStack align="start" gap="6">
        {/* Filters at Top */}
        <Box width="full" pb="6">
        <HStack gap="3" flexWrap={{ base: 'wrap', lg: 'nowrap' }} justify="center" width="full" role="group" aria-label="Property filters">
            <Input
              placeholder="Location"
              aria-label="Filter by location"
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              flex="1"
              minW="0"
              size="sm"
            />
            
            <select
              aria-label="Minimum price"
              value={filters.minPrice || ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)
              }
              style={{ borderWidth: '1px', borderRadius: '0.375rem', padding: '0.5rem', fontSize: '0.875rem', flex: 1, minWidth: 0 }}
            >
              <option value="">Min Price</option>
              {PRICE_STEPS.map((step) => (
                <option key={step} value={step}>{formatPrice(step)}</option>
              ))}
            </select>

            
            <select
              aria-label="Maximum price"
              value={filters.maxPrice || ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)
              }
              style={{ borderWidth: '1px', borderRadius: '0.375rem', padding: '0.5rem', fontSize: '0.875rem', flex: 1, minWidth: 0 }}
            >
              <option value="">Max Price</option>
              {PRICE_STEPS.map((step) => (
                <option key={step} value={step}>{formatPrice(step)}</option>
              ))}
            </select>

            
            <select
              aria-label="Number of bedrooms"
              value={filters.bedrooms || ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
              style={{
                borderWidth: '1px',
                borderRadius: '0.375rem',
                padding: '0.5rem',
                fontSize: '0.875rem',
                flex:"1",
                minWidth: "0"
              }}
            >
              <option value="">Bedrooms</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>
            
            <select
              aria-label="Property type"
              value={filters.propertyType || ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange('propertyType', e.target.value || undefined)}
              style={{
                borderWidth: '1px',
                borderRadius: '0.375rem',
                padding: '0.5rem',
                fontSize: '0.875rem',
                flex:"1",
                minWidth: "0"
              }}
            >
              <option value="">Property Type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="studio">Studio</option>
            </select>
            
            <select
              aria-label="Verification status"
              value={verifiedFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setVerifiedFilter(e.target.value);
                handleFilterChange('isVerifiedOnly', e.target.value === 'verified');
              }}
              style={{
                borderWidth: '1px',
                borderRadius: '0.375rem',
                padding: '0.5rem',
                fontSize: '0.875rem',
                flex:"1",
                minWidth: "0"
              }}
            >
              <option value="all">All Properties</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </HStack>
        </Box>

        {/* Results */}
        <Box width="full">
          <Heading size="lg" mb="6">Results ({properties.length})</Heading>

          {isLoading && (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} gap="6">
              {Array.from({ length: 6 }).map((_, index) => (
                <PropertyCardSkeleton key={index} />
              ))}
            </SimpleGrid>
          )}

          {error && (
            <VStack align="start" gap="3" py="8">
              <Heading size="sm">We couldn’t load these results</Heading>
              <Text color="gray.600">
                Something went wrong reaching the property service. Your filters are still applied.
              </Text>
              <Button onClick={() => refetch()} loading={isFetching}>
                Try again
              </Button>
            </VStack>
          )}

          {!isLoading && !error && properties.length === 0 && (
            <Text color="gray.600">No properties found. Try adjusting your filters.</Text>
          )}

          {!isLoading && !error && properties.length > 0 && (
            <Flex gap="6" align="start" direction={{ base: 'column', lg: 'row' }}>
              <Box flex="1" width="full">
              <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} gap="6">
                {pageItems.map((property) => (
                  <Box
                    key={property.id}
                    onMouseEnter={() => setActiveId(property.id)}
                    onMouseLeave={() => setActiveId(null)}
                    onFocus={() => setActiveId(property.id)}
                    onBlur={() => setActiveId(null)}
                  >
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onSave={() => toggleSave(property.id)}
                      isSaved={isSaved(property.id)}
                  />
                  </Box>
                ))}
              </SimpleGrid>

              {totalPages > 1 && (
                <HStack justify="center" gap="4" mt="10">
                  <Button
                    variant="outline"
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1}
                  >
                    Previous
                  </Button>

                  <Text fontSize="sm" color="gray.600" aria-live="polite">
                    Page {page} of {totalPages}
                  </Text>

                  <Button
                    variant="outline"
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= totalPages}
                  >
                    Next
                  </Button>
                </HStack>
              )}
              </Box>

               {/* RIGHT — map */}
              <Box
                flex="1"
                width="full"
                height="75vh"
                position="sticky"
                top="4"
                borderRadius="lg"
                overflow="hidden"
              >
                <PropertyMap properties={pageItems} activeId={activeId} />
              </Box>
            </Flex>
          )}
        </Box>
      </VStack>
    </Container>
  );
}