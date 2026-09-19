import { useEffect, useState } from 'react';
import { Box, Container, HStack, VStack, Heading, Button, Text, Grid, IconButton } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Search', to: '/search' },
  { label: 'Saved', to: '/saved' },
];

export function Header() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navLinks = NAV_ITEMS.map(({ label, to }) => (
    <Button
      key={to}
      asChild
      size="sm"
      variant="ghost"
      width={{ base: 'full', md: 'auto' }}
      justifyContent={{ base: 'flex-start', md: 'center' }}
      fontWeight={pathname === to ? '700' : '400'}
    >
      <RouterLink to={to} aria-current={pathname === to ? 'page' : undefined}>
        {label}
      </RouterLink>
    </Button>
  ));

  return (
    <Box as="header" bg="slate.700" color="white" py="3">
      <Container maxW="container.xl">
        <Grid
          templateColumns={{ base: '1fr auto', md: '1fr auto 1fr' }}
          alignItems="center"
          as="nav"
          aria-label="Main"
        >
          <Heading size="md" letterSpacing="-0.02em">
            <RouterLink to="/">
              <Text as="span" color="orange.400" fontWeight="800">PH</Text>
              <Text as="span" color="black" fontWeight="600">CityRentals</Text>
            </RouterLink>
          </Heading>

          <HStack gap="1" display={{ base: 'none', md: 'flex' }}>
            {navLinks}
          </HStack>

          <IconButton
            display={{ base: 'flex', md: 'none' }}
            variant="ghost"
            size="sm"
            color="slate.700"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {menuOpen ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </IconButton>
        </Grid>

        {menuOpen && (
          <VStack
            id="mobile-nav"
            display={{ base: 'flex', md: 'none' }}
            align="stretch"
            gap="1"
            mt="3"
            pt="3"
            borderTopWidth="1px"
            borderColor="whiteAlpha.300"
          >
            {navLinks}
          </VStack>
        )}
      </Container>
    </Box>
  );
}
