# Lombok Tourism - AI Coding Instructions

## Project Overview

This is a **bilingual (Indonesian/English) semantic web tourism search engine** for Lombok, Indonesia. It uses **SPARQL queries** against RDF ontology data, Next.js 16 with React 19, and implements 16 SWRL (Semantic Web Rule Language) rules for intelligent search filtering.

## Architecture & Data Flow

### Core Data Pipeline
1. **RDF Source**: [`public/protege-tesis.rdf`](public/protege-tesis.rdf) - Tourism ontology created in Protégé with SWRL rules
2. **Data Layer**: [`src/app/lib/data.ts`](src/app/lib/data.ts) - Parses RDF/XML, caches N3 Store, executes SPARQL queries via Comunica
3. **Server Component**: [`src/app/page.tsx`](src/app/page.tsx) - SSR fetches initial data
4. **Client Component**: [`src/app/components/ClientView.tsx`](src/app/components/ClientView.tsx) - Handles filtering, search, i18n, and UI state

### Key Design Decisions
- **Global RDF cache** in `data.ts` - Store is parsed once and cached with file modification timestamp checking to avoid re-parsing on every request
- **Server-side data fetching** - Initial SPARQL query runs server-side for SEO and fast initial render
- **Client-side filtering** - All filtering (SWRL rules, categories, location, transport) happens in browser for instant UX
- **Bilingual from ontology** - Both ID and EN data stored in RDF with `@id` and `@en` language tags, queried together in one SPARQL query

## Development Workflow

### Essential Commands
```bash
npm run dev    # Dev server on localhost:3000
npm run build  # Production build
npm start      # Production server
```

### Environment Setup
Required `.env` file (optional - only needed for Apache Jena Fuseki integration):
```
SPARQL=http://localhost:3030/lombok/sparql  # External SPARQL endpoint (unused in current implementation)
TELEGRAM_BOT_TOKEN=<token>                   # For feedback API route
OWNER_TELEGRAM_ID=<chat_id>                  # For feedback API route
```

**Note**: Currently the app reads directly from [`public/protege-tesis.rdf`](public/protege-tesis.rdf), not an external SPARQL endpoint.

## Code Conventions & Patterns

### SWRL Rule Implementation
The 16 semantic search rules are hardcoded in [`ClientView.tsx`](src/app/components/ClientView.tsx) as the `swrlRules` object:
```typescript
const swrlRules = {
  holiday: { keywords: ['liburan', 'holiday', ...], types: ['Marine', 'Island', ...], badge: '✨ Holiday Choice' },
  budget: { keywords: ['murah', 'cheap', ...], priceFilter: 'cheap', badge: '💰 Budget Friendly' },
  // ... 14 more rules
};
```

**Pattern**: Each rule defines:
- `keywords` - Trigger words (bilingual)
- `types` - Ontology class URIs to match (e.g., 'Marine', 'Cultural')
- `priceFilter` or `ratingFilter` - Special filters for budget/expensive/popular/unpopular
- `badge` and `badgeId` - UI labels for active rules

**When adding rules**: Follow this structure and add to both the rule object and the filter logic around line 200 in `ClientView.tsx`.

### Internationalization Pattern
```typescript
// Define translations in dictionary.ts
export const dictionary = {
  id: { welcome: "Selamat Datang", ... },
  en: { welcome: "Welcome", ... }
};

// Use in components
const t = dictionary[lang];
<h1>{t.welcome}</h1>
```

**Always** add both `id` and `en` keys when adding new UI text.

### SPARQL Query Structure
See [`data.ts`](src/app/lib/data.ts) lines 60-155 for the main query pattern:
- Uses `PREFIX to: <http://www.semanticweb.org/harto/ontologies/2025/3/protegetesis#>` for custom ontology
- Retrieves bilingual data with `OPTIONAL` + `FILTER(lang(?x) = "en")` and `FILTER(lang(?x) = "id")`
- Uses `GROUP_CONCAT` for multi-valued properties (locations, transports)
- Uses `SAMPLE` aggregation for single-valued properties to handle duplicate rows

**When modifying queries**: Test that bilingual data is properly retrieved and grouped.

### Component Structure
- **Server Components**: Only [`page.tsx`](src/app/page.tsx) (fetches data)
- **Client Components**: Everything in `components/` marked with `"use client"`
- **Styling**: Custom CSS in [`globals.css`](src/app/globals.css) with glassmorphism, gradients, and animations - **no CSS framework used**

### Image Handling
- **Next.js Image component** used throughout with `remotePatterns` configured in [`next.config.ts`](next.config.ts) to allow any `https://` and `http://` images
- **Carousel images**: [`public/01.png`](public/01.png) through `05.png` (hardcoded in `ClientView.tsx`)
- **YouTube embeds**: Extract video ID from ontology `to:Video` property and embed via iframe

## External Dependencies

### Key Packages
- `@comunica/query-sparql` - In-memory SPARQL engine
- `n3` - RDF triple store
- `rdfxml-streaming-parser` - Parse RDF/XML from Protégé
- `react-icons` - Icon library

### Third-party Integrations
- **Telegram Bot API** - Feedback submission in [`api/send-feedback/route.ts`](src/app/api/send-feedback/route.ts)
- **YouTube embeds** - Video URLs from ontology rendered as iframes
- **Font Awesome CDN** - Icons loaded in [`layout.tsx`](src/app/layout.tsx)

## Common Patterns to Follow

### Adding a New Filter Category
1. Add ontology class URI to `activeCategories` state initialization
2. Update filter logic in the `filteredData` useMemo hook
3. Add UI button/select with corresponding `typeURI` value
4. Add translations to `dictionary.ts` for both languages

### Adding a New SWRL Rule
1. Add rule to `swrlRules` object with keywords, types/filters, and badges
2. The existing filter logic will automatically pick it up via the loop in `filteredData`
3. Ensure keywords are bilingual (ID and EN)

### Modifying RDF Data
1. Edit [`public/protege-tesis.rdf`](public/protege-tesis.rdf) in Protégé
2. Save as RDF/XML format
3. Server auto-reloads cached store on file modification (timestamp check)
4. No database migration needed - it's file-based

## Testing & Debugging

- **RDF parsing logs**: Check console for `✅ Using cached RDF store` or `🔄 Parsing RDF file...`
- **SPARQL debugging**: Add `console.log(bindingsStream)` in `data.ts` to inspect query results
- **Filter debugging**: Log `activeRules` in `ClientView.tsx` to see which SWRL rules triggered
- **Build verification**: Run `npm run build` to ensure no TypeScript errors or SSR issues

## File Organization
- `/public` - Static assets (carousel images, RDF ontology file)
- `/src/app` - Next.js App Router structure
  - `page.tsx` - Home page (server component)
  - `layout.tsx` - Root layout with Font Awesome CDN
  - `dictionary.ts` - All i18n translations
  - `globals.css` - All custom CSS (glassmorphism, animations)
  - `/components` - Reusable client components (ClientView, Carousel)
  - `/lib` - Data fetching logic (SPARQL queries, RDF parsing)
  - `/api` - API routes (RDF serving, feedback submission)
  - `/feedback` - Feedback form page

## Important Gotchas

- **Don't use external SPARQL endpoint**: The `SPARQL` env var is unused. Data comes from local RDF file.
- **Client-side filtering only**: All 300 destinations are sent to browser. No server-side pagination.
- **Case-sensitive ontology URIs**: Use exact capitalization (e.g., `Marine` not `marine`)
- **Transport names hardcoded**: See `transportTranslations` object in `ClientView.tsx` for mapping
- **Modal video embeds**: Only YouTube URLs work (extracted via regex)
