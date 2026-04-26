# GEMINI.md - next-level-blog

## Project Overview
`next-level-blog` is a modern, high-performance personal blog built with **Next.js 15 (App Router)**. It uses **Notion** as a headless CMS, leveraging both the official Notion SDK for data querying and `react-notion-x` for high-fidelity content rendering. The project focuses on a rich developer experience and a polished user interface.

- **Author:** alohadancemeow
- **Live Site:** [alohadancemeow.dev](https://alohadancemeow.dev/)
- **Version:** 0.1.2 (Current Metadata v0.1.6)

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Mantine UI v8, Tailwind CSS, @tailwindcss/postcss
- **Animations:** Framer Motion
- **CMS:** Notion (Official API & react-notion-x)
- **State Management:** Zustand, TanStack React Query v5
- **Icons:** Tabler Icons, Lucide React
- **Comments:** Giscus (GitHub Discussions)
- **Deployment:** Vercel (Analytics & Speed Insights integrated)
- **Audio:** react-h5-audio-player

## Project Structure
- `actions/`: Next.js Server Actions for fetching Notion data (posts, categories, pages).
- `app/`: Main routing and layout using Next.js App Router.
    - `posts/[slug]/`: Dynamic routes for individual blog posts.
    - `tags/[slug]/`: Dynamic routes for posts filtered by tags.
    - `api/revalidate/`: Webhook endpoint for on-demand revalidation.
- `components/`: UI components organized by domain:
    - `common/`: Global utilities like ThemeMode, ScrollToTop, Spotlight.
    - `contents/`: Components for post rendering (Breadcrumbs, Comments, RelatedPosts).
    - `home/`: Home page specific components (NewProfile, MainFooter).
    - `layout/`: Global layout elements (Header, Footer, Menu).
    - `ui/`: Shared primitive components.
- `helpers/`: Utility functions for mapping Notion properties to application types.
- `hooks/`: Custom hooks for data fetching and state interaction.
- `lib/`: Configuration for Notion clients (official and unofficial).
- `site/`: Metadata configuration and static data.
- `styles/`: Global CSS and theme overrides.

## Building and Running
The project uses `bun` for dependency management and scripts.

| Command | Action |
| :--- | :--- |
| `bun run dev` | Starts the development server with **Turbopack** |
| `bun run pwa` | Starts dev server with **experimental HTTPS** for PWA testing |
| `bun run build` | Builds the application for production |
| `bun run start` | Starts the production server |
| `bun run lint` | Runs ESLint to check for code quality issues |

## Development Conventions
- **Server Actions:** Use `use server` directives in `actions/` for all data fetching logic from Notion.
- **Notion Integration:**
    - Use `@notionhq/client` for structured data queries (databases).
    - Use `react-notion-x` for rendering complex page blocks.
- **Styling:** Combine Mantine UI for complex components and Tailwind CSS for utility-first styling and layout.
- **State:** Use Zustand for lightweight client-side state (e.g., layout toggles) and React Query for server state caching/fetching.
- **SEO:** Metadata is centrally managed in `site/siteMatedata.ts` and dynamically generated in post routes using `generateMetadata`.

## Key Files
- `actions/notion.ts`: Official Notion SDK implementation for database queries.
- `actions/notion-x.ts`: `react-notion-x` implementation for page content fetching.
- `site/siteMatedata.ts`: Global site configuration.
- `components/providers/MantineProviders.tsx`: Mantine and theme initialization.
- `app/layout.tsx`: Root layout with font, theme, and analytics setup.
