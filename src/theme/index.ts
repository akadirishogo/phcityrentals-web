import { createSystem, defaultConfig } from '@chakra-ui/react';

const FONT_STACK = "'Bricolage Grotesque', system-ui, sans-serif";

export const system = createSystem(defaultConfig, {
  globalCss: {
    'html, body': {
      fontFamily: FONT_STACK,
    },
  },
  theme: {
    recipes: {
      container: {
        base: {
          px: { base: '5', md: '8', lg: '12' },
        },
      },
    },
    tokens: {
      fonts: {
        body: { value: FONT_STACK },
        heading: { value: FONT_STACK },
      },
    },
  },
});
