import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('@mantine/core', () => ({
  useMantineColorScheme: () => ({
    colorScheme: 'light',
    setColorScheme: vi.fn(),
    toggleColorScheme: vi.fn(),
  }),
  SegmentedControl: vi.fn(({ children }) => children),
  Group: vi.fn(({ children }) => children),
  Center: vi.fn(({ children }) => children),
  Box: vi.fn(({ children }) => children),
  ActionIcon: vi.fn(({ children }) => children),
  Affix: vi.fn(({ children }) => children),
  Transition: vi.fn(({ children }) => children),
  Card: vi.fn(({ children }) => children),
  Image: vi.fn(() => null),
  Text: vi.fn(({ children }) => children),
  Timeline: vi.fn(({ children }) => children),
  Space: vi.fn(() => null),
  Divider: vi.fn(() => null),
  Tooltip: vi.fn(({ children }) => children),
}));

vi.mock('@mantine/hooks', () => ({
  useWindowScroll: () => [{ y: 0 }, vi.fn()],
  useViewportSize: () => ({ width: 1024, height: 768 }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

HTMLMediaElement.prototype.play = vi.fn();
HTMLMediaElement.prototype.pause = vi.fn();
Object.defineProperty(HTMLMediaElement.prototype, 'volume', {
  get: function() { return this._volume || 1; },
  set: function(val) { this._volume = val; },
  configurable: true,
});
