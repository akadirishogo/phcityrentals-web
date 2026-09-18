import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { system } from '../theme';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        {children}
      </ChakraProvider>
    </QueryClientProvider>
  );
}
