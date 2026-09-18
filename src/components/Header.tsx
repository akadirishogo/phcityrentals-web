import { Box, Container, HStack, Heading, Button, Text, Grid } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Search', to: '/search' },
  { label: 'Saved', to: '/saved' },
];

export function Header() {
  const { pathname } = useLocation();

  return (
    <Box as="header" bg="slate.700" color="white" py="3">
      <Container maxW="container.xl">
        <Grid templateColumns="1fr auto 1fr" alignItems="center" as="nav" aria-label="Main">
        <Heading size="md" letterSpacing="-0.02em">
          <RouterLink to="/">
            <Text as="span" color="orange.400" fontWeight="800">PH</Text>
            <Text as="span" color="black" fontWeight="600">CityRentals</Text>
          </RouterLink>
        </Heading>

          <HStack gap="1">
            {NAV_ITEMS.map(({ label, to }) => (
              <Button
                key={to}
                asChild
                size="sm"
                variant="ghost"
                fontWeight={pathname === to ? '700' : '400'}
              >
                <RouterLink to={to} aria-current={pathname === to ? 'page' : undefined}>
                  {label}
                </RouterLink>
              </Button>
            ))}
          </HStack>
        </Grid>
      </Container>
    </Box>
  );
}
