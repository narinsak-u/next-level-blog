# Tests Directory

This directory contains all test files for the next-level-blog project.

## Structure

```
tests/
├── unit/                    # Unit tests for isolated functions/hooks
│   ├── helpers/            # Tests for helper functions
│   ├── lib/                # Tests for utility functions
│   ├── context/            # Tests for React context providers
│   └── hooks/              # Tests for custom hooks
├── integration/             # Integration tests for components
│   ├── actions/            # Tests for Server Actions
│   └── components/         # Tests for React components
├── e2e/                    # End-to-end tests (Playwright)
├── fixtures/               # Test data and mocks
└── setup.ts               # Vitest setup and mocks
```

## Running Tests

### Unit & Integration Tests (Vitest)

```bash
# Run all tests
bun test

# Run tests once (CI mode)
bun run test:run

# Run with coverage
bun run test:coverage

# Watch mode
bun run test:watch
```

### End-to-End Tests (Playwright)

```bash
# Install Playwright browsers (first time)
bunx playwright install

# Run E2E tests
bun run test:e2e

# Run with UI mode
bun run test:e2e:ui

# Debug mode
bun run test:e2e:debug
```

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '@/lib/my-function';

describe('myFunction', () => {
  it('should return expected value', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });
});
```

### Component Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeTruthy();
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('page loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/My Site/i);
});
```

## Test Fixtures

Test data is stored in `tests/fixtures/`:

- `notion-response.ts` - Mock Notion API responses
- `posts.ts` - Mock post data

## Mocks

Global mocks are configured in `tests/setup.ts`:

- `@mantine/core` - Mantine UI components
- `@mantine/hooks` - Mantine hooks
- `next/navigation` - Next.js navigation

## Coverage

Coverage reports are generated when running with `--coverage`:

```bash
bun run test:coverage
```

## CI Integration

Tests run automatically on push/PR via GitHub Actions. See `.github/workflows/test.yml` for configuration.
