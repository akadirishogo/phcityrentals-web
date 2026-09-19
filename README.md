# PHCityRent — Property Discovery (Web)

A property-discovery slice for PHCityRent: search verified rentals in Port Harcourt,
inspect them on a map/list split, view full details, and save properties for later.

Built for the PHCityRent Frontend Engineer take-home assessment.

---

## Setup

**Requirements:** Node.js 20.17+ and npm.

```bash
git clone <REPO_URL>
cd phcityrent-web
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and produce a production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

No environment variables, API keys or backend access are required. All data is mocked.

---

## Tech stack

| Concern | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 5 |
| UI / design system | Chakra UI 3 |
| Server state | TanStack React Query 5 |
| Routing | React Router 7 |
| Map | Leaflet + react-leaflet (OpenStreetMap tiles) |
| Data | Static TypeScript mock (40 properties) |

---

## Architecture

```
src/
├── core/              Platform-agnostic domain layer — no React, no DOM
│   ├── types.ts           Property, SearchFilters, PropertyType
│   ├── queryKeys.ts       React Query cache key factory
│   ├── domains/
│   │   └── pricing.ts     Price breakdown + currency formatting
│   └── mock/
│       └── properties.ts  40 mock properties
│
├── api/
│   └── client.ts      Data access. Swap this file for a real API; nothing else changes.
│
├── features/          One folder per page, owning its own hooks
│   ├── home/
│   ├── search/            SearchPage + useProperties
│   ├── property/          PropertyDetailsPage + useProperty
│   └── saved/             SavedPage + useSavedProperties
│
├── components/        Shared UI used by more than one feature
│   ├── PropertyCard.tsx
│   ├── PropertyImage.tsx
│   ├── PropertyMap.tsx
│   └── Header.tsx
│
├── theme/             Chakra theme: fonts, container gutters
└── app/               providers.tsx (Chakra + React Query), router.tsx
```

**The `core/` boundary is deliberate.** Nothing in it imports React or touches the DOM,
so it can be copied unchanged into a React Native app. That was a design goal, since
this codebase has a mobile counterpart.

### State: the right tool per kind

| Kind of state | Where it lives | Why |
|---|---|---|
| Server / async data | React Query | Caching, loading, error and retry handled for us |
| Search filters + pagination | URL query string | Makes views shareable and restorable |
| Saved properties | `useSavedProperties` + `localStorage` | Survives reload without a backend |
| Transient UI (active image, hovered card) | Local `useState` | Never needs to outlive the component |

---

## Features

- **Home** — hero with search entry point and featured properties
- **Search** — filters for location, price range, bedrooms, property type and verified status, all reflected in the URL
- **Map + list** — 65/35 split, map shows the current page's results, hovering a card highlights its pin
- **Pagination** — 12 per page, page number in the URL, clamped against out-of-range values
- **Property details** — image gallery, all-inclusive price breakdown, amenities, agent details with working `tel:`/`mailto:` actions
- **Saved properties** — save and unsave, persisted across reloads

### Edge cases handled

| Case | Behaviour |
|---|---|
| Property with no images | Neutral "No photo available" placeholder |
| Image URL that fails to load | Same placeholder, tracked per URL so a new image is retried |
| Property with no coordinates | Skipped by the map, still listed |
| Missing description | Explanatory fallback text |
| Very long titles / addresses | Clamped to 2 and 1 lines respectively; full text stays in the DOM for screen readers |
| No search results | Empty state with guidance |
| No saved properties | Empty state |
| `?page=99` in the URL | Clamped to the last valid page |

The mock data deliberately includes these cases — properties 7 and 23 have no images,
31 has no coordinates, 12 has no description, and 4 and 19 have very long titles.

---

## Testing

```bash
npm test             # run once
npm run test:watch   # re-run on change
```

**Result: 17 tests passing across 2 files.**

Vitest, configured through the existing Vite config so tests resolve imports exactly as
the app does. The default environment is `node` rather than `jsdom` — the tested layers are
pure TypeScript with no DOM dependency, which is the `core/` boundary working as intended.

| File | Covers |
|---|---|
| `src/core/domains/pricing.test.ts` | Breakdown composition; the invariant that displayed lines sum to the displayed total; that this holds for all 40 properties; currency formatting |
| `src/api/client.test.ts` | Each filter in isolation, filters combined, case-insensitive partial location matching, empty results, single-property lookup including not-found |

**What I chose not to test, and why.** I did not write tests asserting that components
render. A test checking that a button appears proves little — it is visible on screen. The
value is in rules that can be quietly wrong: whether a filter actually filters, whether
"3 bedrooms" means exactly three or three-or-more, whether a price breakdown adds up.

Two deliberate details:

- Assertions are guarded with `expect(results.length).toBeGreaterThan(0)` before any
  `.every(...)` check, because `[].every()` returns `true` for an empty array. Without the
  guard, a filter returning nothing at all would pass every test.
- The bedroom test asserts both `>= 3` and that some result exceeds 3. That documents the
  filter as intentionally a minimum rather than an exact match, so a later "fix" to `===`
  fails the suite instead of silently changing behaviour.

**Not covered:** component rendering and the `useSavedProperties` hook, both of which need
a jsdom environment. See "What I would do with more time."

---

## Key decisions

**`core/` is separated from `features/` and imports nothing from React.**
Types, query keys, pricing rules and mock data are plain TypeScript. This keeps business
rules testable without rendering anything, and means the same layer can be lifted into a
React Native app without modification. The boundary is enforced by convention: if a file
in `core/` needed a React import, it would belong somewhere else.

**Filters and pagination live in the URL, not in component state.**
The assessment asks for shareable, restorable views, and the URL is the only place that
survives a refresh, a bookmark or a pasted link. It also means the browser back button
does something sensible. The cost is that every filter change is a navigation, so I keep
the query string minimal and rebuild it from scratch on each change — which has the useful
side effect of resetting pagination automatically when filters change.

**Pagination rather than list virtualisation.**
Virtualisation is the more impressive answer for a very long list, but it does not compose
with a map: you cannot virtualise pins, and a map showing results the user cannot scroll to
is confusing. Paginating at 12 per page bounds the render cost, keeps the map and list
showing the same set, and is trivially explainable. At genuinely large scale I would move to
server-side pagination with viewport-based map queries rather than virtualising the client.

**The map shows only the current page's results.**
The alternative — showing every match with clustering — is closer to what Zillow does, but
it decouples the map from the list, so hovering a pin might highlight a card that is three
pages away. Keeping them in lockstep makes the hover sync meaningful, and the map re-frames
naturally as you page through.

**Saved properties use `localStorage` behind a hook, not Context or a store.**
The set of saved IDs is small, is read by four pages and needs to survive a reload. A hook
over `localStorage` covers that without adding a state library. The hook is the seam: to move
this server-side behind authentication, only `useSavedProperties.ts` changes. I initialise
state lazily from `localStorage` inside `useState` rather than loading it in an effect —
loading in an effect leaves a render where state is empty, and the write-back effect would
persist that empty value over real data.

**The property title is a link; the whole card is not.**
A card-wide anchor would have to wrap the Save button, and a `<button>` inside an `<a>` is
invalid HTML with unpredictable behaviour. Scoping the link to the title gives keyboard
users a real, focusable target with Enter activation and right-click support, while the
card-wide `onClick` remains a convenience for mouse users. The card outlines on
`_focusWithin`, so tabbing to the title highlights the whole card.

---

## Tradeoffs

**Depth over breadth.** I was given the web and mobile assessments concurrently with
overlapping deadlines. Rather than submit two partial applications, I chose to deliver one
coherent, explainable application. The mobile submission is not included.

**No design system beyond Chakra's defaults.** I customised the font stack and container
gutters in the theme and otherwise used Chakra's tokens directly. Building a full token
scale would have looked more impressive but consumed time better spent on correctness and
edge cases.

**Mock data over a mock server.** I used a static TypeScript module rather than MSW or a
JSON server. The fetch functions in `api/client.ts` are `async` and simulate latency, so
React Query behaves exactly as it would against a real endpoint; swapping in a real API
means changing one file. MSW would have let me test network failure paths properly, which
is a real cost — see limitations.

**Two-state verification filter rather than three.** I dropped an "unverified only" option.
"All Properties" already lets a user browse unverified stock, and a dedicated unverified
mode works against the product's positioning as a verified-rentals platform. It also keeps
the filter a clean boolean rather than forcing a third state through a two-state value.

---

## Known limitations

Listed honestly rather than hidden — these are the things I would fix first.

**Responsive behaviour is not fully verified.** The search page stacks its map and list
below the `lg` breakpoint and the details page stacks its sidebar, but I have not tested
systematically at narrow widths. The header in particular will be cramped on a small phone,
and the six search filters are set to a single non-wrapping row, which will compress badly
below roughly 900px.

**The location filter is not debounced.** It is a text input wired directly to a React Query
key, so every keystroke triggers a query. Against mock data with a 300ms simulated delay this
is harmless, but against a real API it would be wasteful and could produce out-of-order
responses. The price, bedroom, type and verification filters are all dropdowns and fire once
per selection, so this affects only the location field.

**Loading is a spinner, not a skeleton.** Functional, but a skeleton matching the card layout
would avoid the layout shift when results arrive.

**Saving has no pending or failure state.** `localStorage` is synchronous, so there is
genuinely nothing to wait for. If this moved behind an API I would make it an optimistic
mutation with rollback — the hook is already the right seam for that.

**The map does not auto-fit to the current results.** It opens at a fixed zoom over Port
Harcourt. If a filter narrows results to two properties in one neighbourhood, the map still
shows the whole city. Fitting bounds to the visible markers is a small change I did not get to.

**The bundle is around 658 kB minified.** Leaflet and Chakra dominate it. Lazy-loading the
map behind `React.lazy` would take a meaningful bite out of the initial load, since the map
is only needed on one route.

**Chakra v2 prop names remain in places.** Some components still use `colorScheme`, which
Chakra v3 renamed to `colorPalette`. It fails silently — the colour simply does not apply —
so a few badges and buttons render in default colours rather than the intended ones.

---

## What I would do with more time

In roughly the order I would tackle them:

1. **Broaden the test suite.** The domain layer is the cheapest and most valuable thing to
   cover; beyond that I would test the filter and pagination behaviour through the UI with
   Testing Library, and add a Playwright run over the search → details → save flow.
2. **Finish the responsive pass**, particularly the header and the filter row on small screens.
3. **Debounce the location input** and sweep the remaining `colorScheme` props to `colorPalette`.
4. **Skeleton loading states** matching the card and details layouts.
5. **Code-split the map route** to cut the initial bundle.
6. **Fit the map to the current results** and add marker clustering once result counts grow.
7. **Move saved properties behind an API** with optimistic updates and rollback, once there
   is authentication to attach them to.
8. **Run an accessibility audit** with axe rather than relying on manual keyboard testing.

---

## AI disclosure

**Tool used:** Claude (Anthropic), via Claude Code, throughout the build.

I have tried to be precise here rather than give a blanket statement, because the
distinction between "typed by me" and "authored by me" is not always the same thing.

### Written by the model, reviewed and kept by me

| File | Note |
|---|---|
| `components/PropertyImage.tsx` | Image fallback component |
| `components/Header.tsx` | Navigation; I subsequently edited the layout and wordmark |
| `core/mock/properties.ts` | All 40 properties generated, including the deliberate edge cases |
| `theme/index.ts` | Font stack and container gutter overrides |
| `features/home/HomePage.tsx` | Hero section layout |
| Pagination logic in `SearchPage.tsx` | Clamping and page derivation |
| `aria-label` attributes on the search filters | |

### Written by me from model-supplied code

For most of the remaining work the model supplied code or exact edits and I typed them in,
asked questions and adjusted. This covers `core/types.ts`, `core/queryKeys.ts`,
`core/domains/pricing.ts`, `api/client.ts`, `components/PropertyCard.tsx`,
`components/PropertyMap.tsx`, the four feature pages and their hooks, and the router and
provider setup.

I would not claim to have written these unaided. What I can do is explain why each is
shaped the way it is, and change any of them — the "Key decisions" section above is my
own reasoning, not a summary handed to me.

### Where the model corrected me

Several bugs I introduced were found through this process and are worth naming, since they
shaped the final code:

- `useSavedProperties()` was being called at module scope in two files, outside the
  component, which silently broke saving on those pages.
- The save button was nested inside the card's click handler, so saving navigated away
  before state could persist. Fixed with `stopPropagation`.
- The saved-properties hook loaded from `localStorage` in an effect, so a second effect
  wrote an empty array over real data on mount. Replaced with lazy `useState` initialisation.

### What I did not use it for

The architectural decisions — the `core/` boundary, URL-driven filter state, pagination
over virtualisation, the scope cut on mobile — were mine, made with the model as a
sounding board rather than a decision-maker.

## Assumptions

- Rental prices are annual, as is standard in the Nigerian market.
- "All-Inclusive" means the quoted figure covers base rent, service charge and agency fee,
  so a tenant sees the true cost upfront rather than discovering additional charges at signing.
- Coordinates are mocked but plausible for the named Port Harcourt neighbourhoods.
- No authentication: saved properties are per-device, held in `localStorage`.
