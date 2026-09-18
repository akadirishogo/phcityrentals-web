import { useState } from 'react';
import { Box, Image, Text, VStack } from '@chakra-ui/react';

interface PropertyImageProps {
  src?: string;
  alt: string;
  height?: string;
  borderRadius?: string;
}

export function PropertyImage({ src, alt, height = '200px', borderRadius }: PropertyImageProps) {
  // Tracked by URL, not a boolean, so a new src is retried instead of
  // inheriting the previous image's failure.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <Box
        height={height}
        width="full"
        bg="gray.100"
        borderRadius={borderRadius}
        display="flex"
        alignItems="center"
        justifyContent="center"
        role="img"
        aria-label={`${alt} — no photo available`}
      >
        <VStack gap="2" color="gray.400">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <Text fontSize="xs" fontWeight="500">No photo available</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      height={height}
      width="full"
      objectFit="cover"
      borderRadius={borderRadius}
      onError={() => setFailedSrc(src)}
    />
  );
}
