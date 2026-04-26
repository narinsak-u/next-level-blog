# Project Configuration

> Fill in the sections below with your project's specific details.
> This file is referenced by the chief-agent framework for project context.

## Development Commands

> Commands to run during development and testing.
> Adjust as needed for your environment.

- **dev**: `bun run dev`
- **build**: `bun run build`
- **test**: `bun test`
- **lint**: `bun run lint`

## Architecture Overview

> A brief overview of the architecture, key patterns, and important rules.

Personal blog with Next.js (App Router), using Notion as headless CMS, Tailwind CSS + Mantine for UI, Zod for runtime validation, Zustand for state management.

### Tech Stack

> List of major technologies used in the project.

- Next.js (App Router)
- Tailwind CSS
- Mantine UI
- Notion (headless CMS)
- Zod (runtime validation)
- Zustand (state management)

### Key Architectural Patterns

> Description of important architectural patterns (e.g., Repository Pattern, Service Layer, etc.)

- Server Components by default
- Server Actions
- Compound components

### Directory Structure

> The main directory structure of the project.

```
app/       → page routes
components/ → React components
context/   → React context providers
docs/      → documentation
helpers/   → data transformation utilities
hooks/     → custom React hooks
lib/       → utilities and clients
```

### Important Development Rules

> Key rules that developers must follow.

- Use TypeScript strict mode
- Follow React/Next.js best practices
- Consider testability
- Follow hook best practices