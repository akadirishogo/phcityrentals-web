import { Box, Text, HStack, Badge, Button, VStack } from '@chakra-ui/react';
import { PropertyImage } from './PropertyImage';
import type { Property } from '../core/types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';



interface PropertyCardProps {
  property: Property;
  onSave?: () => void;
  isSaved?: boolean
}

export function PropertyCard({ property, onSave, isSaved }: PropertyCardProps) {
  
    const navigate = useNavigate();

    return (
    <Box 
    borderRadius="lg" 
    overflow="hidden" 
    boxShadow="sm"
    _focusWithin={{ outline: '2px solid', outlineColor: 'orange.400', outlineOffset: '2px' }}
     _hover={{ boxShadow: "md", cursor: "pointer" }}
     onClick={() => navigate(`/property/${property.id}`)}
     height="100%"
     display="flex"
     flexDirection="column"
    >
      {/* Image */}
      <PropertyImage src={property.images[0]} alt={property.title} height="200px" />
      
      {/* Content */}
      <Box p="4" display="flex" flexDirection="column" flex="1">
        <VStack align="center" gap="2" mb="4">
          <Text fontWeight="bold" fontSize="md" lineClamp={2} textAlign="center">
            <RouterLink
              to={`/property/${property.id}`}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              {property.title}
            </RouterLink>
          </Text>
          <HStack gap="2" flexWrap="wrap" justify="center">
            {property.isVerified && <Badge colorPalette="green">Verified</Badge>}
            <Badge colorPalette="purple" variant="subtle">All-Inclusive</Badge>
          </HStack>
        </VStack>
        
        <Text fontSize="sm" color="gray.600" mb="2" lineClamp={1} textAlign="center">{property.location}</Text>
        
        <VStack align="stretch" gap="1" mb="4">
          <HStack justify="space-between">
            <Text fontWeight="bold">₦{property.price.toLocaleString()}</Text>
            <Text fontSize="sm">{property.bedrooms} bed • {property.bathrooms} bath</Text>
          </HStack>
          <Text fontSize="xs" color="gray.500">
            ₦{property.allInclusivePrice.toLocaleString()} all-inclusive
          </Text>
        </VStack>

        
        <Button width="full" colorPalette={isSaved ? "green" : "blue"} size="sm" onClick={(e) => {
          e.stopPropagation();
          onSave?.();
        }} marginTop="auto">
          {isSaved ? "✓ Saved" : "Save Property"}
        </Button>
      </Box>
    </Box>
  );
}
