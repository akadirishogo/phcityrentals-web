import { Box, Skeleton, VStack, HStack } from '@chakra-ui/react';

export function PropertyCardSkeleton() {
  return (
    <Box borderRadius="lg" overflow="hidden" boxShadow="sm" height="100%">
      <Skeleton height="200px" />

      <Box p="4">
        <VStack align="center" gap="2" mb="3">
          <Skeleton height="16px" width="80%" />
          <Skeleton height="16px" width="55%" />
          <Skeleton height="20px" width="90px" borderRadius="full" />
        </VStack>

        <Skeleton height="14px" width="65%" mx="auto" mb="4" />

        <HStack justify="space-between" mb="4">
          <Skeleton height="18px" width="90px" />
          <Skeleton height="14px" width="80px" />
        </HStack>

        <Skeleton height="32px" borderRadius="md" />
      </Box>
    </Box>
  );
}
