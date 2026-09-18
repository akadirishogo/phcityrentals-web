import { Box, Image, Text, HStack, Badge, Button, VStack } from '@chakra-ui/react';
import type { Property } from '../core/types';
import { useNavigate } from 'react-router-dom';


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
     _hover={{ boxShadow: "md", cursor: "pointer" }}
     onClick={() => navigate(`/property/${property.id}`)}
     height="100%"
     display="flex"
     flexDirection="column"
    >
      {/* Image */}
      <Image src={property.images[0]} alt={property.title} height="200px" objectFit="cover" />
      
      {/* Content */}
      <Box p="4" display="flex" flexDirection="column" flex="1">
        <VStack justify="space-between" mb="2">
          <Text fontWeight="bold" fontSize="md">{property.title}</Text>
          {property.isVerified && <Badge colorScheme="green">Verified</Badge>}
        </VStack>
        
        <Text fontSize="sm" color="gray.600" mb="2">{property.location}</Text>
        
        <HStack justify="space-between" mb="4">
          <Text fontWeight="bold">₦{property.price.toLocaleString()}</Text>
          <Text fontSize="sm">{property.bedrooms} bed • {property.bathrooms} bath</Text>
        </HStack>
        
        <Button width="full" colorScheme={isSaved ? "green" : "blue"} 
 size="sm" onClick={(e) => {

  e.stopPropagation();
  onSave?.();
}} marginTop="auto">
          {isSaved ? "✓ Saved" : "Save Property"}
        </Button>
      </Box>
    </Box>
  );
}
